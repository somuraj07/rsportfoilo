"use client";

import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { process, services, tenancySteps, work, products } from "@/lib/data";
import { Arrow, SectionHead } from "./ui";

/* ---------- Capabilities marquee ---------- */

export function Marquee() {
  const items = [...services[0].items, ...services[1].items.slice(0, 4), ...products.map((p) => p.name)];
  return (
    <div className="marquee overflow-hidden bg-signal py-5 text-ink" aria-label="What we build">
      <div className="marquee-track flex w-max animate-marquee gap-10">
        {[...items, ...items].map((t, i) => (
          <span key={i} className="flex items-center gap-10 font-display text-2xl font-medium tracking-tight whitespace-nowrap" aria-hidden={i >= items.length}>
            {t}
            <span className="size-2 rounded-full bg-ink" />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- Services ---------- */

export function Services() {
  return (
    <section id="services" className="py-24 md:py-32">
      <div className="wrap">
        <SectionHead
          eyebrow="What we do"
          title={
            <>
              Three ways we build <span className="text-muted">for your business.</span>
            </>
          }
          aside="Start with a custom website or app, or switch on one of our ERP products and be running in your own space."
        />

        <div className="mt-16 grid gap-4 lg:grid-cols-3">
          {services.map((s, i) => (
            <motion.article
              key={s.id}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className={`group flex flex-col rounded-[24px] border p-7 md:p-8 ${
                i === 2 ? "border-ink bg-ink text-bone" : "border-line bg-paper"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`font-mono text-[13px] ${i === 2 ? "text-bone/60" : "text-muted"}`}>0{i + 1}</span>
                <ServiceGlyph id={s.id} dark={i === 2} />
              </div>
              <h3 className="mt-10 font-display text-[1.9rem] font-semibold leading-tight tracking-[-0.03em]">{s.title}</h3>
              <p className={`mt-4 text-[16px] leading-relaxed ${i === 2 ? "text-bone/70" : "text-muted"}`}>{s.body}</p>
              <ul className="mt-8 flex flex-wrap gap-2">
                {s.items.map((it) => (
                  <li
                    key={it}
                    className={`rounded-full border px-3 py-1.5 text-[13px] ${
                      i === 2 ? "border-line-dark text-bone/85" : "border-line text-ink/80"
                    }`}
                  >
                    {it}
                  </li>
                ))}
              </ul>
              <Link
                href={i === 2 ? "/#products" : "/#book"}
                className={`mt-auto inline-flex min-h-11 items-center gap-2 pt-10 text-[15px] font-medium ${i === 2 ? "text-signal" : "text-ink"}`}
              >
                <span className="relative">
                  {i === 2 ? "See the ERP products" : `Talk about your ${s.short.toLowerCase().replace(/s$/, "")}`}
                  <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-current transition-transform duration-300 group-hover:scale-x-100" />
                </span>
                <Arrow />
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceGlyph({ id, dark }: { id: string; dark?: boolean }) {
  const stroke = dark ? "#f5f4f0" : "#0e1a2b";
  return (
    <svg viewBox="0 0 48 48" className="size-12" fill="none" aria-hidden>
      {id === "web" && (
        <>
          <rect x="5" y="9" width="38" height="30" rx="5" stroke={stroke} strokeWidth="1.6" />
          <path d="M5 17h38" stroke={stroke} strokeWidth="1.6" />
          <circle cx="10" cy="13" r="1.4" fill="#2bd3a0" />
          <rect x="11" y="23" width="14" height="10" rx="2" fill="#2bd3a0" className="transition-transform duration-300 group-hover:translate-x-1" />
        </>
      )}
      {id === "app" && (
        <>
          <rect x="14" y="4" width="20" height="40" rx="5" stroke={stroke} strokeWidth="1.6" />
          <rect x="18" y="12" width="12" height="12" rx="3" fill="#2bd3a0" className="transition-transform duration-300 group-hover:-translate-y-1" />
          <path d="M21 38h6" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
        </>
      )}
      {id === "saas" && (
        <>
          <circle cx="24" cy="24" r="6" fill="#2bd3a0" />
          {[0, 60, 120, 180, 240, 300].map((a) => {
            const r = (a * Math.PI) / 180;
            const pt = (d: number) => [+(24 + Math.cos(r) * d).toFixed(2), +(24 + Math.sin(r) * d).toFixed(2)];
            const [x1, y1] = pt(8);
            const [x2, y2] = pt(16);
            const [x3, y3] = pt(18.5);
            return (
              <g key={a}>
                <path d={`M${x1} ${y1}L${x2} ${y2}`} stroke={stroke} strokeWidth="1.4" />
                <circle cx={x3} cy={y3} r="2.6" stroke={stroke} strokeWidth="1.4" />
              </g>
            );
          })}
        </>
      )}
    </svg>
  );
}

/* ---------- Statement (scroll-linked word highlight) ---------- */

const statement =
  "Most businesses still run on notebooks, registers and WhatsApp groups. We replace them with software built around the way you already work.";

export function Statement() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = statement.split(" ");
  return (
    <section className="flex min-h-[80dvh] items-center bg-paper py-24">
      <div ref={ref} className="wrap">
        <p className="max-w-[18ch] font-display text-[clamp(2.2rem,6vw,5.4rem)] font-semibold leading-[1.02] tracking-[-0.04em] md:max-w-[22ch]">
          {words.map((w, i) => (
            <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
              {w}
            </Word>
          ))}
        </p>
      </div>
    </section>
  );
}

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const reduce = useReducedMotion();
  const opacity = useTransform(progress, range, reduce ? [1, 1] : [0.18, 1]);
  return (
    <motion.span style={{ opacity }} className="inline">
      {children}{" "}
    </motion.span>
  );
}

/* ---------- Multi-tenant subscription ---------- */

export function Tenancy() {
  return (
    <section className="py-24 md:py-32">
      <div className="wrap grid items-center gap-14 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <SectionHead
            compact
            eyebrow="How the ERP subscription works"
            title={
              <>
                Your own space on a shared platform.
              </>
            }
          />
          <ol className="mt-12 space-y-0 border-t border-line">
            {tenancySteps.map((s, i) => (
              <li key={s.title} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-line py-6">
                <span className="font-mono text-[13px] text-muted">0{i + 1}</span>
                <div>
                  <p className="font-display text-xl font-semibold tracking-tight">{s.title}</p>
                  <p className="mt-1.5 text-[16px] leading-relaxed text-muted">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="lg:col-span-6">
          <TenantDiagram />
        </div>
      </div>
    </section>
  );
}

function TenantDiagram() {
  const tenants = products.map((p) => p.for.split(" ")[0]);
  const cx = 260;
  const cy = 230;
  return (
    <div className="rounded-[24px] border border-line bg-paper p-4 md:p-6">
      <svg viewBox="0 0 520 460" className="h-auto w-full" role="img" aria-label="One RS platform serving separate tenants: schools, hospitals, coaching centres, garages, distributors and restaurants">
        <style>{`.pulse{stroke-dasharray:6 200;animation:flow 3s linear infinite}@keyframes flow{from{stroke-dashoffset:206}to{stroke-dashoffset:0}}@media (prefers-reduced-motion:reduce){.pulse{animation:none;stroke-dasharray:none;opacity:0}}`}</style>
        {tenants.map((t, i) => {
          const a = (-90 + i * 60) * (Math.PI / 180);
          const x = Math.round(cx + Math.cos(a) * 175);
          const y = Math.round(cy + Math.sin(a) * 160);
          const d = `M${cx} ${cy} L${x} ${y}`;
          return (
            <g key={t}>
              <path d={d} stroke="#d9dce1" strokeWidth="1.5" />
              <path d={d} stroke="#2bd3a0" strokeWidth="2.5" strokeLinecap="round" className="pulse" style={{ animationDelay: `${i * 0.45}s` }} />
              <rect x={x - 62} y={y - 22} width="124" height="44" rx="22" fill="#f5f4f0" stroke="#0e1a2b" strokeWidth="1.2" />
              <text x={x} y={y + 5} textAnchor="middle" fontSize="15" fontWeight="500" fill="#0e1a2b" fontFamily="var(--font-sans)">
                {t}
              </text>
            </g>
          );
        })}
        <rect x={cx - 100} y={cy - 42} width="200" height="84" rx="20" fill="#0e1a2b" />
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="18" fontWeight="600" fill="#f5f4f0" fontFamily="var(--font-display)">
          RS platform
        </text>
        <text x={cx} y={cy + 18} textAnchor="middle" fontSize="12" fill="#f5f4f0" opacity="0.6" fontFamily="var(--font-mono)">
          own data per tenant
        </text>
      </svg>
    </div>
  );
}

/* ---------- Work ---------- */

export function Work() {
  return (
    <section id="work" className="py-24 md:py-32">
      <div className="wrap">
        <SectionHead
          eyebrow="Our work"
          title={
            <>
              Apps we have shipped <span className="text-muted">for our clients.</span>
            </>
          }
        />
        <div className="mt-16 grid gap-4 md:grid-cols-2">
          {work.map((w, i) => (
            <motion.article
              key={w.name}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className={`flex min-h-[420px] flex-col rounded-[24px] p-7 md:p-10 ${i === 0 ? "bg-signal text-ink" : "border border-line bg-paper"}`}
            >
              <div className="flex items-center justify-between">
                <span className={`rounded-full border px-3 py-1 font-mono text-[12px] ${i === 0 ? "border-ink/25" : "border-line text-muted"}`}>
                  {w.kind}
                </span>
                <span className="font-mono text-[13px] opacity-60">0{i + 1}</span>
              </div>
              <h3 className="mt-auto pt-16 font-display text-[clamp(2.6rem,5vw,4.5rem)] font-semibold leading-none tracking-[-0.045em]">
                {w.name}
              </h3>
              <p className={`mt-4 max-w-md text-[17px] leading-relaxed ${i === 0 ? "text-ink/80" : "text-muted"}`}>{w.line}</p>
              {w.points.length > 0 && (
                <ul className="mt-6 flex flex-wrap gap-2">
                  {w.points.map((p) => (
                    <li key={p} className={`rounded-full px-3 py-1.5 text-[13px] ${i === 0 ? "bg-ink/10" : "bg-bone"}`}>
                      {p}
                    </li>
                  ))}
                </ul>
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Process ---------- */

export function Process() {
  return (
    <section id="process" className="border-t border-line bg-paper py-24 md:py-32">
      <div className="wrap">
        <SectionHead
          eyebrow="How we work"
          title={
            <>
              From first call <span className="text-muted">to live software.</span>
            </>
          }
        />
        <ol className="mt-16 grid gap-px overflow-hidden rounded-[24px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {process.map((p) => (
            <li key={p.n} className="group flex min-h-[260px] flex-col bg-paper p-7 transition-colors duration-300 hover:bg-bone">
              <span className="font-mono text-[13px] text-muted">{p.n}</span>
              <p className="mt-14 font-display text-2xl font-semibold tracking-tight">{p.title}</p>
              <p className="mt-2 mb-8 text-[15px] leading-relaxed text-muted">{p.body}</p>
              <span className="mt-auto block h-0.5 w-8 bg-signal transition-[width] duration-500 ease-out group-hover:w-full" />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
