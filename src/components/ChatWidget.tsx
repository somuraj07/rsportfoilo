"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

const starters = [
  "What does the School ERP include?",
  "How does the subscription work?",
  "Can you build an e-commerce site?",
  "What apps have you built?",
];

const greeting: Msg = {
  role: "assistant",
  content: "Hi, I'm the RS Digital assistant. Ask me about our websites, apps or ERP products.",
};

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([greeting]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function send(text: string) {
    const q = text.trim();
    if (!q || busy) return;
    const history: Msg[] = [...msgs, { role: "user", content: q }];
    setMsgs([...history, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // greeting is UI-only; the API conversation must start with the user
        body: JSON.stringify({ messages: history.slice(1) }),
      });
      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "The assistant is unavailable right now.");
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let acc = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
        setMsgs([...history, { role: "assistant", content: acc }]);
      }
    } catch (e) {
      setMsgs([
        ...history,
        { role: "assistant", content: e instanceof Error ? e.message : "Something went wrong. Please try again." },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <aside aria-label="Chat assistant" className="fixed right-4 bottom-4 z-[60] flex flex-col items-end gap-3 md:right-6 md:bottom-6">

        <motion.button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="rs-chat"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="flex min-h-14 items-center gap-2.5 rounded-full bg-ink pr-5 pl-4 text-[15px] font-medium text-bone shadow-[0_12px_30px_-10px_rgba(14,26,43,0.6)]"
        >
          <span className="relative grid size-7 place-items-center rounded-full bg-signal text-ink">
            <AnimatePresence mode="wait" initial={false}>
              <motion.svg
                key={open ? "x" : "chat"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.18 }}
                viewBox="0 0 16 16"
                className="size-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                {open ? <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" /> : <path d="M3 4h10v6H7l-3 3V4Z" strokeLinejoin="round" />}
              </motion.svg>
            </AnimatePresence>
          </span>
          {open ? "Close" : "Ask our AI"}
        </motion.button>
      </aside>

      <AnimatePresence>
        {open && (
          <motion.div
            id="rs-chat"
            role="dialog"
            aria-label="RS Digital assistant"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            style={{ transformOrigin: "bottom right" }}
            className="fixed inset-x-3 bottom-22 z-[60] flex h-[min(620px,calc(100dvh-7.5rem))] flex-col overflow-hidden rounded-[22px] border border-line bg-paper shadow-[0_30px_80px_-20px_rgba(14,26,43,0.45)] sm:inset-x-auto sm:right-6 sm:w-[400px] md:bottom-24"
          >
            <div className="flex items-center gap-3 border-b border-line bg-ink px-5 py-4 text-bone">
              <span className="grid size-10 place-items-center rounded-[10px] bg-bone px-1.5"><Image src="/brand/mark-black.png" alt="" width={1266} height={555} className="h-auto w-full" /></span>
              <div>
                <p className="text-[15px] font-medium">RS Digital assistant</p>
                <p className="flex items-center gap-1.5 text-[12px] text-bone/60">
                  <span className="size-1.5 rounded-full bg-whatsapp" /> Answers from our product information
                </p>
              </div>
            </div>

            <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-5" aria-live="polite">
              {msgs.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[14.5px] leading-relaxed whitespace-pre-wrap ${
                      m.role === "user" ? "rounded-br-md bg-ink text-bone" : "rounded-bl-md bg-bone text-ink"
                    }`}
                  >
                    {m.content || <TypingDots />}
                  </div>
                </motion.div>
              ))}
              {msgs.length === 1 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {starters.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="min-h-9 rounded-full border border-line px-3.5 text-left text-[13px] transition-colors hover:border-ink"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-end gap-2 border-t border-line p-3"
            >
              <label htmlFor="rs-chat-input" className="sr-only">
                Your question
              </label>
              <textarea
                id="rs-chat-input"
                ref={inputRef}
                rows={1}
                value={input}
                maxLength={1000}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                placeholder="Ask about a product or project…"
                className="max-h-28 min-h-11 flex-1 resize-none rounded-xl bg-bone px-3.5 py-2.5 text-[16px] focus:outline-none sm:text-[15px]"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                aria-label="Send"
                className="grid size-11 shrink-0 place-items-center rounded-xl bg-signal text-ink transition-[opacity,transform] active:scale-95 disabled:opacity-40"
              >
                <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function TypingDots() {
  return (
    <span className="flex gap-1 py-1.5" aria-label="Typing">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="size-1.5 rounded-full bg-muted"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </span>
  );
}
