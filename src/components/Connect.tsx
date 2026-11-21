"use client";

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { products } from "@/lib/data";

/**
 * Pinned three-stage scroll moment.
 * 1. Two overlapping circles: Websites & apps | RS Digitech | ERP products.
 * 2. They pull apart, joined by a liquid neck (SVG goo filter).
 * 3. They shrink to end points on a dotted line, rings appear, and the services
 *    between the two sides pop in: dark pills near the centre, light ones outside.
 */

const W = 1200;
const H = 700;
const CX = 600;
const CY = 350;

type Pill = { t: string; x: number; y: number; dark?: boolean; icon?: string; at: number };

const pills: Pill[] = [
  // centre: what both sides share
  { t: "Custom SaaS tools", x: 600, y: 215, dark: true, icon: "#2bd3a0", at: 0.62 },
  { t: "Full-stack web apps", x: 475, y: 285, dark: true, icon: "#7fb2ff", at: 0.66 },
  { t: "Monthly subscription", x: 740, y: 285, dark: true, icon: "#f5f4f0", at: 0.68 },
  { t: "Mobile apps", x: 480, y: 420, dark: true, icon: "#ff8fb1", at: 0.7 },
  { t: "Your brand, your data", x: 730, y: 420, dark: true, icon: "#2bd3a0", at: 0.72 },
  // outside left: custom builds
  { t: "Static websites", x: 300, y: 215, at: 0.76 },
  { t: "E-commerce stores", x: 220, y: 285, at: 0.78 },
  { t: "Admin panels", x: 255, y: 420, at: 0.8 },
  { t: "Redesigns", x: 330, y: 490, at: 0.82 },
  // outside right: the ERP products
  ...products.map((p, i) => {
    const spots = [
      [880, 215],
      [995, 285],
      [990, 420],
      [865, 490],
      [1045, 490],
      [1055, 215],
    ];
    return { t: p.name, x: spots[i][0], y: spots[i][1], at: 0.76 + i * 0.02 };
  }),
];

export function Connect() {
  const ref = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(Math.min(1, e.contentRect.width / W, e.contentRect.height / H)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 28 });
  const p = useTransform(smooth, (v) => (reduce ? 1 : v));

  // stage 1 -> 2: venn fades, goo appears
  const vennOpacity = useTransform(p, [0.14, 0.22], [1, 0]);
  const gooOpacity = useTransform(p, [0.14, 0.22], [0, 1]);
  // circles separate and shrink
  const d = useTransform(p, [0.14, 0.5], [55, 440]);
  const r = useTransform(p, [0.14, 0.32, 0.5], [120, 95, 9]);
  const leftX = useTransform(d, (v) => CX - v);
  const rightX = useTransform(d, (v) => CX + v);
  const neckW = useTransform(d, (v) => v * 2);
  const neckH = useTransform(p, [0.2, 0.45], [26, 3]);
  const neckY = useTransform(neckH, (h) => CY - h / 2);
  // stage 3
  const ringScale = useTransform(p, [0.4, 0.6], [0.5, 1]);
  const ringOpacity = useTransform(p, [0.4, 0.58], [0, 1]);
  const endLabel = useTransform(p, [0.46, 0.56], [0, 1]);
  const centreTop = useTransform(p, [0.4, 0.58], [0, 1]);

  return (
    <section ref={ref} className="relative h-[320vh] border-t border-line bg-paper">
      <div className="sticky top-0 flex h-dvh flex-col overflow-hidden pt-24 pb-6">
        <div className="wrap grid gap-4 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <h2 className="font-display text-[clamp(1.9rem,3.8vw,3.4rem)] leading-[1.02] font-semibold tracking-[-0.035em]">
              At the meeting point of <span className="font-serif font-normal italic">custom builds and ready software</span>
            </h2>
          </div>
          <p className="text-[16px] leading-relaxed text-muted md:col-span-5">
            Some businesses need something built from scratch. Others need software they can start using straight away.
            We do both.
          </p>
        </div>

        <div ref={stageRef} className="wrap relative flex min-h-0 flex-1 items-center justify-center">
          <div className="relative" style={{ width: W * scale, height: H * scale }}>
            <div className="absolute top-0 left-0 origin-top-left" style={{ width: W, height: H, transform: `scale(${scale})` }}>
              <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden>
                <defs>
                  <filter id="goo">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="b" />
                    <feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10" />
                  </filter>
                  <clipPath id="venn-left">
                    <circle cx={CX - 55} cy={CY} r={120} />
                  </clipPath>
                </defs>

                {/* stage 3 rings + dotted axis */}
                <motion.g style={{ scale: ringScale, opacity: ringOpacity, transformBox: "view-box", transformOrigin: `${CX}px ${CY}px` }}>
                  <circle cx={CX} cy={CY} r="180" fill="none" stroke="#0e1a2b" strokeOpacity=".35" strokeDasharray="2 5" />
                  <circle cx={CX} cy={CY} r="315" fill="none" stroke="#0e1a2b" strokeOpacity=".3" strokeDasharray="2 5" />
                </motion.g>
                <motion.line
                  x1={160}
                  x2={1040}
                  y1={CY}
                  y2={CY}
                  stroke="#0e1a2b"
                  strokeOpacity=".5"
                  strokeDasharray="2 4"
                  style={{ opacity: endLabel }}
                />

                {/* stage 1: venn */}
                <motion.g style={{ opacity: vennOpacity }}>
                  <circle cx={CX - 55} cy={CY} r={120} fill="#1a2a40" />
                  <circle cx={CX + 55} cy={CY} r={120} fill="#1a2a40" />
                  <circle cx={CX + 55} cy={CY} r={120} fill="#081120" clipPath="url(#venn-left)" />
                </motion.g>

                {/* stage 2: liquid bridge */}
                <motion.g filter="url(#goo)" style={{ opacity: gooOpacity }}>
                  <motion.circle cx={leftX} cy={CY} r={r} fill="#0e1a2b" />
                  <motion.circle cx={rightX} cy={CY} r={r} fill="#0e1a2b" />
                  <motion.rect x={leftX} y={neckY} width={neckW} height={neckH} fill="#0e1a2b" />
                </motion.g>
              </svg>

              {/* venn labels */}
              <motion.div style={{ opacity: vennOpacity }} className="pointer-events-none absolute inset-0 text-[22px] font-semibold text-bone">
                <span className="absolute -translate-x-1/2 -translate-y-1/2 text-center leading-tight" style={{ left: CX - 120, top: CY }}>
                  Websites
                  <br />& apps
                </span>
                <span className="absolute -translate-x-1/2 -translate-y-1/2 text-center leading-tight" style={{ left: CX, top: CY }}>
                  RS
                  <br />
                  Digitech
                </span>
                <span className="absolute -translate-x-1/2 -translate-y-1/2 text-center leading-tight" style={{ left: CX + 120, top: CY }}>
                  ERP
                  <br />
                  products
                </span>
              </motion.div>

              {/* end labels + centre title */}
              <motion.span style={{ opacity: endLabel, top: CY, left: 1062 }} className="absolute -translate-y-1/2 text-[24px] font-semibold whitespace-nowrap">
                ERP products
              </motion.span>
              <motion.span style={{ opacity: endLabel, top: CY, right: W - 138 }} className="absolute -translate-y-1/2 text-[24px] font-semibold whitespace-nowrap">
                Websites & apps
              </motion.span>
              <motion.span
                style={{ opacity: centreTop, top: 60, left: CX }}
                className="absolute -translate-x-1/2 text-center text-[22px] leading-tight font-semibold"
              >
                RS Digitech
              </motion.span>

              {/* pills */}
              {pills.map((pl) => (
                <PillChip key={pl.t} pill={pl} p={p} />
              ))}
              <Dot x={545} y={500} color="#7fb2ff" p={p} at={0.74} />
              <Dot x={665} y={500} color="#2bd3a0" p={p} at={0.76} />
            </div>
          </div>
        </div>

        {/* phones: the stage is too small to read, so list the same pills */}
        <ul className="wrap flex flex-wrap justify-center gap-1.5 md:hidden">
          {pills.map((pl) => (
            <li
              key={pl.t}
              className={`rounded-full px-3 py-1.5 text-[12px] ${pl.dark ? "bg-ink text-bone" : "border border-ink/15 text-ink/60"}`}
            >
              {pl.t}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function PillChip({ pill, p }: { pill: Pill; p: MotionValue<number> }) {
  const o = useTransform(p, [pill.at, pill.at + 0.06], [0, 1]);
  const s = useTransform(p, [pill.at, pill.at + 0.06], [0.6, 1]);
  const [hide, setHide] = useState(true);
  useMotionValueEvent(o, "change", (v) => setHide(v < 0.02));
  return (
    <motion.span
      aria-hidden={hide}
      style={{ left: pill.x, top: pill.y, opacity: o, scale: s }}
      className={`absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2.5 rounded-full px-4 py-2 text-[17px] font-medium whitespace-nowrap ${
        pill.dark ? "bg-ink text-bone" : "border border-ink/15 text-ink/40"
      }`}
    >
      {pill.icon && <span className="size-3 rounded-[4px]" style={{ background: pill.icon }} />}
      {pill.t}
    </motion.span>
  );
}

function Dot({ x, y, color, p, at }: { x: number; y: number; color: string; p: MotionValue<number>; at: number }) {
  const o = useTransform(p, [at, at + 0.05], [0, 1]);
  const s = useTransform(p, [at, at + 0.05], [0, 1]);
  return (
    <motion.span
      aria-hidden
      style={{ left: x, top: y, opacity: o, scale: s }}
      className="absolute grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-ink"
    >
      <span className="size-4 rounded-[5px]" style={{ background: color }} />
    </motion.span>
  );
}
