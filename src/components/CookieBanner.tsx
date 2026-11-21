"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const KEY = "rs-cookie-choice";
const OPEN_EVENT = "rs:open-cookie-notice";

function read(): string | null {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

/**
 * Honest cookie notice. The site sets no optional cookies, so there is nothing to
 * accept or reject: the notice says so plainly and is dismissed with one button.
 * If optional cookies are ever added, add a real "Accept" / "Reject" pair here with
 * equal weight, and load those scripts only after "Accept".
 */
export function CookieBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // read after mount so the server render and the first client render match
    const t = window.setTimeout(() => setOpen(read() === null), 600);
    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, reopen);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener(OPEN_EVENT, reopen);
    };
  }, []);

  function close() {
    try {
      window.localStorage.setItem(KEY, JSON.stringify({ essentialOnly: true, at: new Date().toISOString() }));
    } catch {
      /* storage blocked: the notice simply shows again next visit */
    }
    setOpen(false);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.section
          role="region"
          aria-label="Cookie notice"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
          className="fixed inset-x-3 bottom-24 z-[70] rounded-[20px] border border-line bg-paper p-5 shadow-[0_24px_60px_-20px_rgba(14,26,43,0.4)] sm:inset-x-auto sm:bottom-6 sm:left-6 sm:max-w-[400px]"
        >
          <p className="font-medium">No tracking cookies here</p>
          <p className="mt-1.5 text-[14px] leading-relaxed text-muted">
            We don&apos;t use analytics or advertising cookies. We only store your choice on this notice so it doesn&apos;t
            keep appearing.{" "}
            <Link href="/cookies" className="text-ink underline underline-offset-2">
              Cookie policy
            </Link>
          </p>
          <button
            type="button"
            onClick={close}
            className="mt-4 inline-flex min-h-11 items-center rounded-full bg-ink px-5 text-[14px] font-medium text-bone transition-[background-color,transform] hover:bg-ink-3 active:scale-[0.97]"
          >
            OK, got it
          </button>
        </motion.section>
      )}
    </AnimatePresence>
  );
}

/** Reopens the notice (used on the cookie policy page and in the footer). */
export function CookieSettingsButton({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}
      className={
        className ||
        "mt-3 inline-flex min-h-11 items-center rounded-full border border-ink/20 px-5 text-[15px] font-medium transition-colors hover:border-ink"
      }
    >
      Cookie settings
    </button>
  );
}
