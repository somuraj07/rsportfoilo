"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { products } from "@/lib/data";
import { Button, Icon } from "./ui";
import { PhoneChip, PhoneFrame } from "./PhoneFrame";

const ease = [0.25, 1, 0.5, 1] as const;

/* One word per ERP product, in the same order as `products`, so every word on screen is something we sell. */
const words = ["school", "hospital", "coaching", "garage", "distribution", "restaurant"];
const appUser = ["Parents and students", "Patients", "Students", "Customers", "Retailers", "Guests"];
const STEP = 3200;

export function Hero() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((v) => (v + 1) % words.length), STEP);
    return () => clearInterval(t);
  }, [paused]);

  const pause = {
    onMouseEnter: () => setPaused(true),
    onMouseLeave: () => setPaused(false),
    onFocus: () => setPaused(true),
    onBlur: () => setPaused(false),
  };

  return (
    <section className="relative flex min-h-dvh flex-col overflow-hidden pt-[72px]">
      <div className="wrap flex flex-1 flex-col">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between border-b border-ink/10 py-4 text-[13px] text-muted md:text-[14px]"
        >
          <span>Websites · Apps · ERP software</span>
          <span className="hidden items-center gap-2 sm:flex">
            <span className="size-1.5 animate-pulse-dot rounded-full bg-ink" />6 ERP products on subscription
          </span>
        </motion.div>

        <div className="grid flex-1 items-center gap-10 py-8 lg:grid-cols-12 lg:gap-8 lg:py-6">
          {/* statement */}
          <div className="lg:col-span-7">
            <h1
              {...pause}
              className="font-display leading-[0.9] font-bold tracking-[-0.04em] uppercase"
              style={{ fontSize: "clamp(2.6rem, min(6vw, 12vh), 6rem)" }}
            >
              {["Software that", "runs your"].map((l, li) => (
                <span key={l} className="block overflow-hidden pb-[0.04em]">
                  <motion.span
                    className="block"
                    initial={{ y: "105%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.9, delay: 0.1 + li * 0.1, ease }}
                  >
                    {l}
                  </motion.span>
                </span>
              ))}
              <span className="mt-[0.1em] block overflow-hidden pb-[0.06em]">
                <motion.span
                  className="inline-flex"
                  initial={{ y: "105%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: 0.3, ease }}
                >
                  <motion.span
                    layout
                    transition={{ type: "spring", stiffness: 260, damping: 30 }}
                    className="relative inline-flex overflow-hidden rounded-[0.16em] bg-signal px-[0.12em]"
                    aria-hidden
                  >
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span
                        key={words[i]}
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "-100%", opacity: 0 }}
                        transition={{ duration: 0.5, ease }}
                        className="block"
                      >
                        {words[i]}
                      </motion.span>
                    </AnimatePresence>
                  </motion.span>
                  <span className="sr-only">school, hospital, coaching centre, garage, distribution business or restaurant</span>
                </motion.span>
              </span>
            </h1>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55, ease }}
            >
              <p className="mt-7 max-w-[34rem] text-[17px] leading-relaxed text-muted md:text-[18px]">
                We build the website, the mobile app and the ERP your business runs on, or switch on one of our six
                ready-made ERP products on a monthly subscription.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href="/#book">Book a free call</Button>
                <Button href="/#products" variant="ghost">
                  See ERP products
                </Button>
              </div>
            </motion.div>
          </div>

          {/* live product scene: what this business gets from us */}
          <motion.div
            {...pause}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.35, ease }}
            className="relative lg:col-span-5"
          >
            <Scene i={i} />
          </motion.div>
        </div>
      </div>

      {/* product strip, synced with the word */}
      <motion.nav
        aria-label="ERP products"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.75 }}
        className="border-t border-ink/10"
      >
        <ul className="wrap flex overflow-x-auto md:grid md:grid-cols-6">
          {products.map((p, pi) => (
            <li key={p.slug} className="shrink-0 border-r border-ink/10 first:border-l md:shrink">
              <Link
                href={`/products/${p.slug}`}
                onMouseEnter={() => {
                  setI(pi);
                  setPaused(true);
                }}
                onMouseLeave={() => setPaused(false)}
                onFocus={() => {
                  setI(pi);
                  setPaused(true);
                }}
                onBlur={() => setPaused(false)}
                className={`group relative flex min-h-[64px] items-center justify-between gap-4 overflow-hidden px-4 text-[15px] font-medium transition-colors md:px-5 ${
                  pi === i ? "text-ink" : "text-ink/65"
                }`}
              >
                <span className="absolute inset-0 origin-bottom scale-y-0 bg-signal transition-transform duration-300 ease-out group-hover:scale-y-100" />
                <span className="relative whitespace-nowrap">{p.name}</span>
                <span className="relative transition-transform duration-300 group-hover:translate-x-0.5">
                  <Icon name="arrow" />
                </span>
                {pi === i && (
                  <motion.span
                    layoutId="hero-active"
                    className="absolute inset-x-0 top-0 h-0.5 bg-ink"
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  />
                )}
                {pi === i && !paused && (
                  <motion.span
                    key={`bar-${i}`}
                    className="absolute bottom-0 left-0 h-0.5 bg-ink/30"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: STEP / 1000, ease: "linear" }}
                  />
                )}
              </Link>
            </li>
          ))}
        </ul>
      </motion.nav>
    </section>
  );
}

/* ---------- The scene: a realistic desktop display with the ERP, an iPhone with the app ---------- */

function Scene({ i }: { i: number }) {
  const p = products[i];
  const modules = p.groups.flatMap((g) => g.modules);
  const ref = useRef<HTMLDivElement>(null);
  const [phoneScale, setPhoneScale] = useState(0.68);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setPhoneScale(Math.max(0.42, Math.min(0.8, (e.contentRect.width * 0.4) / 300))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={ref} className="relative mx-auto aspect-[6/5] w-full max-w-[640px]" aria-hidden>
      <Desktop p={p} modules={modules} />
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-0 bottom-[-4%]"
      >
        <PhoneFrame scale={phoneScale} progress={{ total: products.length, index: i, ms: STEP, key: p.slug }}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={p.slug}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.45, delay: 0.08, ease }}
              className="flex h-full flex-col px-5 pt-5"
            >
              <p className="text-[12px] text-muted">App for {appUser[i].toLowerCase()}</p>
              <p className="mt-1 font-display text-[24px] leading-tight font-semibold tracking-tight">Your {words[i]}</p>
              <div className="mt-4 space-y-2">
                {modules.slice(0, 4).map((m, mi) => (
                  <div
                    key={m}
                    className={`flex items-center gap-3 rounded-2xl border p-3 text-[13px] font-medium ${
                      mi === 0 ? "border-ink bg-ink text-bone" : "border-line bg-white"
                    }`}
                  >
                    <span className={`grid size-8 shrink-0 place-items-center rounded-xl ${mi === 0 ? "bg-signal" : "bg-bone"}`}>
                      <span className={`size-3 rounded-[4px] ${mi === 0 ? "bg-ink" : "bg-ink/40"}`} />
                    </span>
                    <span className="truncate">{m}</span>
                  </div>
                ))}
              </div>
              <span className="mt-auto mb-5 flex items-center justify-center gap-2 rounded-2xl bg-ink py-3 text-[13px] font-medium text-bone">
                Open {modules[0]}
              </span>
            </motion.div>
          </AnimatePresence>
        </PhoneFrame>
      </motion.div>
      <span className="absolute -top-3 left-6 hidden rounded-full bg-ink px-3 py-1.5 text-[12px] font-medium text-bone shadow-lg md:block">
        Website + ERP
      </span>
      <PhoneChip className="left-[2%] bottom-[11%]">
        <span className="size-2 rounded-full bg-signal" /> Your brand on every screen
      </PhoneChip>
      <PhoneChip className="left-[2%] bottom-[0%]">Android and iOS</PhoneChip>
    </div>
  );
}

type P = (typeof products)[number];

function Desktop({ p, modules }: { p: P; modules: string[] }) {
  return (
    <div className="absolute top-0 left-0 w-[88%]">
      {/* aluminium frame */}
      <div className="rounded-[16px] bg-[#c9ced6] p-[5px] shadow-[0_1px_0_#eef0f3_inset,0_50px_80px_-40px_rgba(14,26,43,0.55),0_12px_24px_-12px_rgba(14,26,43,0.35)]">
        {/* black glass border */}
        <div className="relative rounded-[12px] bg-[#05080d] p-[8px] pt-[14px]">
          <span className="absolute top-[5px] left-1/2 size-[4px] -translate-x-1/2 rounded-full bg-[#1c2533] ring-1 ring-[#2b3546]" />
          {/* screen */}
          <div className="relative aspect-[16/10] overflow-hidden rounded-[4px] bg-[#e9ecf1]">
            {/* macOS-style menu bar */}
            <div className="flex h-[5.5%] items-center justify-between bg-white/80 px-2 text-[7px] font-medium text-ink/80">
              <span className="flex items-center gap-2">
                <span className="size-[7px] rounded-full bg-ink/80" />
                <span className="font-semibold">Browser</span>
                <span className="hidden sm:inline">File</span>
                <span className="hidden sm:inline">View</span>
              </span>
              <span>9:41</span>
            </div>
            {/* browser window */}
            <div className="absolute inset-x-[3%] top-[9%] bottom-[4%] overflow-hidden rounded-[6px] bg-paper shadow-[0_10px_30px_-10px_rgba(14,26,43,0.35)] ring-1 ring-ink/10">
              <div className="flex items-center gap-2 border-b border-line bg-[#f6f7f9] px-2 py-[5px]">
                <span className="flex gap-[3px]">
                  <span className="size-[6px] rounded-full bg-[#ff5f57]" />
                  <span className="size-[6px] rounded-full bg-[#febc2e]" />
                  <span className="size-[6px] rounded-full bg-[#28c840]" />
                </span>
                <span className="mx-auto flex w-[55%] items-center justify-center gap-1 rounded-[4px] bg-white px-2 py-[2px] text-[7.5px] text-muted ring-1 ring-ink/5">
                  <svg viewBox="0 0 10 12" className="h-[7px] w-[6px]" fill="currentColor">
                    <path d="M2 5V3.5a3 3 0 0 1 6 0V5h.5A1.5 1.5 0 0 1 10 6.5v4A1.5 1.5 0 0 1 8.5 12h-7A1.5 1.5 0 0 1 0 10.5v-4A1.5 1.5 0 0 1 1.5 5H2Zm1.5 0h3V3.5a1.5 1.5 0 0 0-3 0V5Z" />
                  </svg>
                  yourbrand · {p.name}
                </span>
              </div>
              <div className="grid h-full grid-cols-[30%_1fr]">
                <div className="border-r border-line bg-bone/70 p-2">
                  <div className="mb-2 flex items-center gap-1.5">
                    <span className="grid size-4 place-items-center rounded-[4px] bg-ink text-[6px] font-bold text-bone">YB</span>
                    <span className="truncate text-[8px] font-semibold">Your brand</span>
                  </div>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.ul
                      key={p.slug}
                      initial="hide"
                      animate="show"
                      exit="hide"
                      variants={{ show: { transition: { staggerChildren: 0.035 } }, hide: {} }}
                      className="space-y-[3px]"
                    >
                      {modules.slice(0, 7).map((m, mi) => (
                        <motion.li
                          key={m}
                          variants={{ hide: { opacity: 0, x: -6 }, show: { opacity: 1, x: 0 } }}
                          className={`truncate rounded-[4px] px-1.5 py-[3px] text-[7.5px] md:text-[8px] ${mi === 0 ? "bg-ink text-bone" : "text-ink/75"}`}
                        >
                          {m}
                        </motion.li>
                      ))}
                    </motion.ul>
                  </AnimatePresence>
                </div>
                <div className="p-2.5">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={p.slug}
                      initial={{ opacity: 0, y: 10, filter: "blur(5px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -6, filter: "blur(3px)" }}
                      transition={{ duration: 0.45, ease }}
                    >
                      <p className="text-[7.5px] text-muted">For {p.for.toLowerCase()}</p>
                      <p className="font-display text-[12px] leading-tight font-semibold tracking-tight md:text-[14px]">{p.name}</p>
                      <div className="mt-2 grid grid-cols-2 gap-1.5">
                        {p.groups.slice(0, 4).map((g, gi) => (
                          <div key={g.name} className={`rounded-[6px] p-1.5 ${gi === 0 ? "bg-signal" : "ring-1 ring-line"}`}>
                            <p className="text-[7.5px] font-semibold md:text-[8px]">{g.name}</p>
                            <p className="mt-0.5 line-clamp-2 text-[7px] leading-snug text-ink/70">{g.modules.join(" · ")}</p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-1.5 space-y-1">
                        {modules.slice(0, 2).map((m) => (
                          <div key={m} className="flex items-center justify-between rounded-[4px] bg-bone px-1.5 py-1 text-[7.5px]">
                            <span>{m}</span>
                            <span className="h-1 w-6 rounded-full bg-ink/15" />
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* stand: front face, side face, base, floor shadow */}
      <div className="relative mx-auto h-[46px] w-[20%]">
        <div className="absolute inset-0 bg-[#bfc5ce] [clip-path:polygon(10%_0,90%_0,100%_100%,0_100%)]" />
        <div className="absolute inset-y-0 right-0 w-[12%] bg-[#a9b0bb] [clip-path:polygon(0_0,30%_0,100%_100%,0_100%)]" />
      </div>
      <div className="relative mx-auto h-[8px] w-[34%] rounded-[3px] bg-[#c9ced6] shadow-[0_1px_0_#e6e9ed_inset]" />
      <div className="mx-auto h-[10px] w-[40%] rounded-[50%] bg-ink/25 blur-[8px]" />
    </div>
  );
}
