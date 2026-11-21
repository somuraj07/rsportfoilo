"use client";

import Image from "next/image";
import Link from "next/link";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { products, services, work } from "@/lib/data";
import { HeroScreens } from "./HeroScreens";
import { Icon, SectionHead } from "./ui";
import { PhoneChip, PhoneFrame } from "./PhoneFrame";

const ease = [0.25, 1, 0.5, 1] as const;

/* ---------- Facts: true counts only, numbers count up once ---------- */

const facts = [
  { n: 6, label: "ERP products ready on subscription" },
  { n: 3, label: "Ways we build: websites, apps and SaaS" },
  { n: 3, label: "Client projects shipped: two apps and a saree e-commerce store" },
  { n: 1, label: "Separate tenant per business, with its own brand and data" },
];

export function Facts() {
  return (
    <section className="py-24 md:py-32">
      <div className="wrap">
        <div className="grid gap-8 md:grid-cols-12">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease }}
            className="max-w-[30ch] font-display text-[clamp(1.8rem,3.4vw,3rem)] leading-[1.12] font-medium tracking-[-0.025em] md:col-span-12"
          >
            A software studio with two sides: custom websites and apps built to order, and{" "}
            <span className="font-serif text-[1.08em] font-normal italic">ready-made ERP products</span> that schools,
            hospitals and businesses switch on by subscription.
          </motion.p>
        </div>

        <div className="mt-16 grid gap-3 sm:grid-cols-2">
          {facts.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: (i % 2) * 0.08, ease }}
              whileHover={{ y: -3 }}
              className="flex min-h-[140px] items-center justify-between gap-6 rounded-[20px] border border-line bg-paper px-6 py-5 md:px-8"
            >
              <p className="max-w-[16rem] text-[15px] leading-snug text-muted md:text-[16px]">{f.label}</p>
              <p className="font-serif text-[clamp(3.5rem,7vw,5.5rem)] leading-none italic">
                <CountUp to={f.n} />
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(to);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 1.2, ease: "easeOut", onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [inView, to]);
  return <span ref={ref}>{v}</span>;
}

/* ---------- Services as columns of rows (list style) ---------- */

const columns = [
  {
    title: "Websites",
    href: "/?interest=website#book",
    rows: services[0].items.map((t) => ({ t, href: "/?interest=website#book" })),
  },
  {
    title: "Apps",
    href: "/?interest=app#book",
    rows: services[1].items.map((t) => ({ t, href: "/?interest=app#book" })),
  },
  {
    title: "ERP products",
    href: "/#products",
    rows: products.map((p) => ({ t: p.name, href: `/products/${p.slug}` })),
  },
];

export function ServiceLists() {
  return (
    <section id="services" className="border-t border-line bg-paper py-24 md:py-32">
      <div className="wrap">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ rotate: -20, scale: 0.6, opacity: 0 }}
            whileInView={{ rotate: 0, scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 160, damping: 14 }}
            className="mx-auto grid size-24 place-items-center rounded-[24px] bg-ink px-4"
            aria-hidden
          >
            <Image src="/brand/mark-white.png" alt="" width={1266} height={555} className="h-auto w-full" />
          </motion.div>
          <h2 className="mt-8 font-display text-[clamp(2.2rem,5vw,4rem)] leading-[1.02] font-semibold tracking-[-0.035em] text-balance">
            Everything we build, <span className="font-serif font-normal italic">in one place</span>
          </h2>
        </div>

        <div className="mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
          {columns.map((c, ci) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: ci * 0.1, ease }}
            >
              <div className="flex items-center justify-between border-b border-ink pb-4">
                <p className="font-serif text-[2rem] italic">{c.title}</p>
                <Link
                  href={c.href}
                  aria-label={`Go to ${c.title}`}
                  className="group grid size-11 place-items-center rounded-full border border-ink/20 transition-[background-color,border-color,transform] duration-300 hover:rotate-45 hover:border-ink hover:bg-ink hover:text-bone"
                >
                  <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                    <path d="M5 11 11 5M6 5h5v5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
              <ul>
                {c.rows.map((r) => (
                  <li key={r.t} className="border-b border-line">
                    <Link href={r.href} className="group relative flex min-h-14 items-center justify-between overflow-hidden">
                      <span className="absolute inset-0 origin-bottom scale-y-0 bg-signal transition-transform duration-300 ease-out group-hover:scale-y-100" />
                      <span className="relative text-[16px] font-medium transition-transform duration-300 group-hover:translate-x-3">
                        {r.t}
                      </span>
                      <span className="relative pr-3 text-muted transition-[transform,color] duration-300 group-hover:text-ink">
                        <Icon name="chevron" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Live product demo ---------- */

export function Demo() {
  return (
    <section className="py-24 md:py-32">
      <div className="wrap grid items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHead
            compact
            eyebrow="Try it"
            title={
              <>
                Click around <span className="font-serif font-normal italic">the ERP</span>
              </>
            }
          />
          <p className="mt-6 max-w-md text-[17px] leading-relaxed text-muted">
            Mark attendance, call the next hospital token or build a restaurant bill. These are small working pieces of the
            same screens your staff would use.
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 40, rotateX: 12 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease }}
          style={{ transformPerspective: 1200 }}
          className="lg:col-span-7"
        >
          <HeroScreens />
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- Work: large project cards ---------- */

export function WorkShowcase() {
  return (
    <section id="work" className="py-24 md:py-32">
      <div className="wrap">
        <SectionHead
          eyebrow="Our work"
          title={
            <>
              Work we have shipped <span className="font-serif font-normal italic">for our clients</span>
            </>
          }
        />
        <div className="mt-16 space-y-6">
          {work.map((w, i) => (
            <ProjectCard key={w.name} w={w} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ w, index }: { w: (typeof work)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.97, 1]);

  // cursor-follow badge over the visual
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 300, damping: 28 });
  const sy = useSpring(my, { stiffness: 300, damping: 28 });
  const [hover, setHover] = useState(false);

  const flip = index % 2 === 1;

  return (
    <motion.article ref={ref} style={{ scale }} className="grid overflow-hidden rounded-[28px] border border-line bg-paper lg:grid-cols-12">
      <div
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          mx.set(e.clientX - r.left);
          my.set(e.clientY - r.top);
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className={`group relative min-h-[540px] overflow-hidden lg:col-span-7 lg:min-h-[580px] ${flip ? "lg:order-2" : ""} ${
          index === 0 ? "bg-night" : index === 1 ? "bg-signal" : "bg-[#efe6dc]"
        }`}
      >
        <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.03]">
          {index === 0 ? <SaathyakiVisual /> : index === 1 ? <YoungCeoVisual /> : <SareeStoreVisual />}
        </div>
        <motion.span
          aria-hidden
          style={{ x: sx, y: sy }}
          animate={{ scale: hover ? 1 : 0, opacity: hover ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 26 }}
          className="pointer-events-none absolute top-0 left-0 -mt-12 -ml-12 hidden size-24 place-items-center rounded-full bg-bone text-[13px] font-medium text-ink md:grid"
        >
          {w.name}
        </motion.span>
      </div>

      <div className={`flex flex-col p-7 md:p-10 lg:col-span-5 ${flip ? "lg:order-1" : ""}`}>
        <div className="flex items-center justify-between">
          <span className="rounded-full border border-line px-3 py-1 font-mono text-[12px] text-muted">{w.kind}</span>
          
        </div>
        <h3 className="mt-auto pt-12 font-display text-[clamp(2.4rem,4.5vw,4rem)] leading-none font-semibold tracking-[-0.045em]">
          {w.name}
        </h3>
        <p className="mt-4 text-[17px] leading-relaxed text-muted">{w.line}</p>
        {w.points.length > 0 && (
          <ul className="mt-6 space-y-2 border-t border-line pt-6">
            {w.points.map((p, i) => (
              <motion.li
                key={p}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.07, duration: 0.4 }}
                className="flex items-center gap-3 text-[15px]"
              >
                <span className="size-1.5 rounded-full bg-ink" />
                {p}
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </motion.article>
  );
}

/** Saathyaki's real flow on a phone: pick a mode, talk, pay per minute. */
function SaathyakiVisual() {
  return (
    <div className="relative flex h-full items-center justify-center p-8">
      <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
        <PhoneFrame scale={0.74} progress={{ total: 5, index: 1 }}>
          <div className="flex h-full flex-col px-5 pt-5">
            <p className="text-[12px] text-muted">New session</p>
            <p className="mt-1 font-display text-[22px] leading-tight font-semibold tracking-tight">Talk to a mentor</p>
            <p className="mt-1 text-[12px] text-muted">Career · Studies · Money · Startup · Personal</p>
            <div className="mt-4 space-y-2">
              {["Video call", "Chat"].map((m, i) => (
                <div
                  key={m}
                  className={`flex items-center justify-between rounded-2xl p-3.5 text-[13px] font-medium ${
                    i === 0 ? "bg-ink text-bone" : "border border-line bg-white"
                  }`}
                >
                  {m}
                  <span className="font-mono text-[11px] opacity-60">per minute</span>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-2xl bg-signal p-3.5">
              <p className="text-[11px] text-ink/70">Billing</p>
              <p className="text-[14px] font-semibold">Pay only for the minutes you use</p>
            </div>
            <span className="mt-auto mb-5 flex items-center justify-center rounded-2xl bg-ink py-3 text-[13px] font-medium text-bone">
              Find mentors
            </span>
          </div>
        </PhoneFrame>
      </motion.div>
      <PhoneChip className="top-[22%] left-[8%]">
        <span className="size-2 rounded-full bg-signal" /> Private sessions
      </PhoneChip>
      <PhoneChip className="right-[8%] bottom-[20%]">No subscription</PhoneChip>
    </div>
  );
}

/** Young CEO: a working mutual fund SIP calculator, the kind of tool the app offers. */
function YoungCeoVisual() {
  const [monthly, setMonthly] = useState(5000);
  const [years, setYears] = useState(10);
  const rate = 12; // example annual return used for the illustration
  const r = rate / 100 / 12;
  const n = years * 12;
  const value = Math.round(monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r));
  const invested = monthly * n;
  const fmt = (x: number) => "₹" + x.toLocaleString("en-IN");
  const share = Math.round((invested / value) * 100);

  return (
    <div className="relative flex h-full items-center justify-center p-8">
      <PhoneFrame scale={0.74} progress={{ total: 3, index: 1 }}>
        <div className="flex h-full flex-col px-5 pt-5">
          <p className="text-[12px] text-muted">Mutual funds</p>
          <p className="mt-1 font-display text-[22px] leading-tight font-semibold tracking-tight">SIP calculator</p>
          <p className="mt-1 text-[12px] text-muted">Example return {rate}% a year</p>

          <label className="mt-5 block text-[12px] text-muted">
            <span className="flex justify-between">
              Monthly investment <b className="font-mono text-ink">{fmt(monthly)}</b>
            </span>
            <input type="range" min={500} max={50000} step={500} value={monthly} onChange={(e) => setMonthly(+e.target.value)} className="mt-2 w-full accent-[#0e1a2b]" aria-label="Monthly investment" />
          </label>
          <label className="mt-3 block text-[12px] text-muted">
            <span className="flex justify-between">
              Time period <b className="font-mono text-ink">{years} yrs</b>
            </span>
            <input type="range" min={1} max={30} value={years} onChange={(e) => setYears(+e.target.value)} className="mt-2 w-full accent-[#0e1a2b]" aria-label="Time period in years" />
          </label>

          <div className="mt-5 flex h-2.5 overflow-hidden rounded-full bg-signal">
            <motion.span className="h-full bg-ink" animate={{ width: `${share}%` }} transition={{ type: "spring", stiffness: 200, damping: 26 }} />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-[12px]">
            <div className="rounded-2xl bg-bone p-3">
              <p className="text-muted">Invested</p>
              <p className="font-mono text-[13px] font-medium">{fmt(invested)}</p>
            </div>
            <div className="rounded-2xl bg-signal p-3">
              <p className="text-ink/70">Estimated value</p>
              <p className="font-mono text-[13px] font-semibold">{fmt(value)}</p>
            </div>
          </div>
          <span className="mt-auto mb-5 flex items-center justify-center rounded-2xl bg-ink py-3 text-[13px] font-medium text-bone">
            Talk to a coach
          </span>
        </div>
      </PhoneFrame>
      <PhoneChip className="top-[20%] left-[8%]">Financial coaching</PhoneChip>
      <PhoneChip className="right-[6%] bottom-[22%]">
        <span className="size-2 rounded-full bg-ink" /> Finance analytics
      </PhoneChip>
    </div>
  );
}

/** Saree store: the mobile storefront in the phone, with its CMS and checkout beside it. */
function SareeStoreVisual() {
  const sarees = [
    { name: "Kanjivaram silk", price: "₹8,400", c1: "#7a1f2b", c2: "#c9a24a" },
    { name: "Banarasi", price: "₹6,900", c1: "#1f3d5c", c2: "#d4b067" },
    { name: "Cotton handloom", price: "₹2,150", c1: "#2f5d3a", c2: "#e8d7b0" },
    { name: "Chiffon", price: "₹1,890", c1: "#b5476b", c2: "#f1d3dc" },
  ];
  const [cart, setCart] = useState(1);
  return (
    <div className="flex h-full items-center justify-center gap-6 p-6 md:p-10">
      <PhoneFrame scale={0.74} progress={{ total: 3, index: 0 }}>
        <div className="flex h-full flex-col px-4 pt-4">
          <div className="flex items-center justify-between">
            <p className="font-serif text-[24px] italic">Sarees</p>
            <span className="rounded-full bg-ink px-3 py-1 text-[11px] font-medium text-bone">Cart {cart}</span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2.5">
            {sarees.map((s) => (
              <button key={s.name} type="button" tabIndex={-1} onClick={() => setCart((c) => c + 1)} className="text-left">
                <span className="block aspect-[4/5] rounded-2xl" style={{ backgroundColor: s.c1, boxShadow: `inset 0 -22px 0 ${s.c2}` }} />
                <span className="mt-1.5 block text-[12px] font-medium">{s.name}</span>
                <span className="block font-mono text-[11px] text-muted">{s.price}</span>
              </button>
            ))}
          </div>
          <span className="mt-auto mb-5 flex items-center justify-center rounded-2xl bg-ink py-3 text-[13px] font-medium text-bone">
            Checkout
          </span>
        </div>
      </PhoneFrame>
      <div className="hidden w-[200px] flex-col gap-3 sm:flex">
        <div className="rounded-[18px] bg-ink p-4 text-bone">
          <p className="text-[13px] font-semibold">CMS dashboard</p>
          {["Products", "Orders", "Bookings", "Banners"].map((r, i) => (
            <p key={r} className="mt-2 flex justify-between text-[11px] text-bone/75">
              {r} <span className="font-mono">{i === 2 ? "Today" : "Edit"}</span>
            </p>
          ))}
        </div>
        <div className="rounded-[18px] border border-ink/10 bg-paper p-4">
          <p className="text-[13px] font-semibold">Online payment</p>
          <p className="mt-1 text-[11px] text-muted">Pay at checkout</p>
          <span className="mt-3 flex min-h-9 items-center justify-center rounded-full bg-ink text-[12px] font-medium text-bone">Pay now</span>
        </div>
      </div>
    </div>
  );
}
