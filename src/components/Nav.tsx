"use client";

import Image from "next/image";
import { Icon } from "./ui";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const links = [
  { href: "/#services", label: "Services" },
  { href: "/#products", label: "Products" },
  { href: "/#work", label: "Work" },
  { href: "/#process", label: "Process" },
];

export function Logo({ light }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <Image
        src={light ? "/brand/mark-white.png" : "/brand/mark-black.png"}
        alt=""
        width={1266}
        height={555}
        priority
        className="h-7 w-auto transition-transform duration-300 group-hover:scale-105"
      />
      <span className={`font-display text-[16px] font-semibold tracking-[0.18em] uppercase ${light ? "text-bone" : "text-ink"}`}>
        Digital
      </span>
    </span>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const onDark = false;

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-300 ${
        scrolled || open ? "border-b border-line bg-bone/90 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <div className="wrap flex h-[72px] items-center justify-between">
        <Link href="/" aria-label="RS Digital home" className="group flex min-h-11 items-center" onClick={() => setOpen(false)}>
          <Logo light={onDark} />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`group relative rounded-full px-4 py-2.5 text-[15px] transition-colors ${onDark ? "text-bone/75 hover:text-bone" : "text-ink/80 hover:text-ink"}`}
            >
              {l.label}
              <span className="absolute inset-x-4 bottom-1.5 h-px origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/#book"
            className={`hidden min-h-11 items-center rounded-full px-5 text-[15px] font-medium transition-[background-color,transform] active:scale-[0.97] sm:inline-flex ${onDark ? "bg-bone text-ink hover:bg-paper" : "bg-ink text-bone hover:bg-ink-3"}`}
          >
            Book a call
          </Link>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className={`grid size-11 place-items-center rounded-full border lg:hidden ${onDark ? "border-white/20 text-bone" : "border-ink/15 text-ink"}`}
          >
            <span className="relative block h-3 w-5">
              <span
                className={`absolute left-0 h-[1.5px] w-5 bg-current transition-transform duration-300 ${open ? "top-[5px] rotate-45" : "top-0"}`}
              />
              <span
                className={`absolute left-0 h-[1.5px] w-5 bg-current transition-transform duration-300 ${open ? "top-[5px] -rotate-45" : "top-[10px]"}`}
              />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 top-[72px] bottom-0 bg-bone lg:hidden"
          >
            <ul className="wrap flex flex-col pt-6">
              {[...links, { href: "/#book", label: "Book a call" }].map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 * i, duration: 0.3 }}
                  className="border-b border-line"
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="flex min-h-16 items-center justify-between font-display text-3xl font-semibold tracking-tight"
                  >
                    {l.label}
                    <Icon name="arrow" className="size-6" />
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
