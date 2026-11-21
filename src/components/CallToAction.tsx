"use client";

import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { MotionValue } from "framer-motion";
import { Arrow, Icon } from "./ui";

/**
 * Real screenshots of our own shipped work (Saathyaki and this site), captured
 * from the running projects. Replace or add files in /public/work to update.
 */
const shots = [
  { src: "/work/saathyaki-home.jpg", alt: "Saathyaki home page" },
  { src: "/work/rs-school.jpg", alt: "RS Digital School ERP page" },
  { src: "/work/saathyaki-modes.jpg", alt: "Saathyaki video and chat section" },
  { src: "/work/rs-products.jpg", alt: "RS Digital ERP products section" },
  { src: "/work/saathyaki-how.jpg", alt: "Saathyaki how it works section" },
  { src: "/work/rs-hero.jpg", alt: "RS Digital home page" },
  { src: "/work/saathyaki-pricing.jpg", alt: "Saathyaki pricing section" },
  { src: "/work/rs-restaurant.jpg", alt: "RS Digital Restaurant ERP page" },
  { src: "/work/saathyaki-mentors.jpg", alt: "Saathyaki mentors section" },
  { src: "/work/rs-services.jpg", alt: "RS Digital services section" },
  { src: "/work/saathyaki-join.jpg", alt: "Saathyaki waitlist section" },
  { src: "/work/rs-work.jpg", alt: "RS Digital work section" },
];

export function CallToAction() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const hovering = useRef(false);
  const textRef = useRef<HTMLDivElement>(null);
  const [geo, setGeo] = useState<Geo>(() => buildGeo(720, 640, 800, 550));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const w = e.contentRect.width;
      const h = e.contentRect.height;
      const t = textRef.current;
      const textMid = t ? t.offsetTop + t.offsetHeight * 0.45 : h * 0.65;
      const phone = w < 768;
      // a wide, flattened arc: from off-screen bottom-left, over the top, to off-screen bottom-right
      const cx = w / 2;
      const cy = Math.round(textMid + (phone ? 10 : 40));
      const rx = Math.round(w * (phone ? 0.78 : 0.56));
      // first pass sizes the cards, second pass drops the arc so the top row clears the nav
      const draft = buildGeo(cx, cy, rx, Math.round(cy - 100));
      const top = (draft.card * 10) / 32 + (phone ? 84 : 100);
      setGeo(buildGeo(cx, cy, rx, Math.round(cy - top)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // continuous drift: one full lap every two minutes (phase is in degrees of a lap)
  const drift = useMotionValue(0);
  useAnimationFrame((_, delta) => {
    if (reduce || paused || hovering.current) return;
    drift.set(drift.get() + delta * 0.003);
  });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scrollTurn = useTransform(scrollYProgress, [0, 1], [-20, 20]);
  const phase = useTransform(() => drift.get() + (reduce ? 0 : scrollTurn.get()));

  return (
    <section
      ref={ref}
      onMouseEnter={() => (hovering.current = true)}
      onMouseLeave={() => (hovering.current = false)}
      className="relative isolate flex min-h-[100dvh] items-end overflow-hidden bg-bone pb-[8vh] md:min-h-[112dvh] md:pb-[10vh]"
    >
      {/* arc of real website screenshots */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {shots.map((s, i) => (
          <RingCard key={s.src} src={s.src} alt={s.alt} slot={i / shots.length} index={i} phase={phase} geo={geo} />
        ))}
      </div>

      <div ref={textRef} className="wrap relative text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
          className="mx-auto max-w-[14ch] font-display text-[clamp(2.6rem,6.4vw,5.6rem)] leading-[0.98] font-semibold tracking-[-0.045em]"
        >
          Ready to talk about your project?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mx-auto mt-6 max-w-xl text-[18px] leading-relaxed text-muted md:text-[20px]"
        >
          Tell us what you want to build, or pick one of our ERP products, and we will take it from there.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-10"
        >
          <Link
            href="/#book"
            className="group inline-flex min-h-14 items-center gap-2 rounded-full bg-ink px-8 text-[16px] font-medium text-bone transition-[background-color,transform] hover:bg-ink-3 active:scale-[0.97]"
          >
            Book a free call <Arrow />
          </Link>
        </motion.div>
      </div>

      {!reduce && (
        <button
          type="button"
          onClick={() => setPaused((v) => !v)}
          aria-pressed={paused}
          className="absolute bottom-5 left-5 inline-flex min-h-11 items-center gap-2 rounded-full border border-ink/15 bg-bone/80 px-4 text-[13px] text-ink/70 backdrop-blur transition-colors hover:text-ink md:left-8"
        >
          <Icon name={paused ? "play" : "pause"} className="size-3.5" />
          {paused ? "Play motion" : "Pause motion"}
        </button>
      )}
    </section>
  );
}

type Geo = { cx: number; cy: number; rx: number; ry: number; card: number; table: Float64Array };

/**
 * Builds the arc. Cards are spaced by equal distance along the ellipse (not equal
 * angle), so the gap between neighbours is the same everywhere and nothing overlaps.
 * `table[m]` is the angle at which m/M of the perimeter has been travelled.
 */
function buildGeo(cx: number, cy: number, rx: number, ry: number): Geo {
  const K = 2000;
  const M = 720;
  const lens = new Float64Array(K + 1);
  let px = 0;
  let py = -ry;
  for (let k = 1; k <= K; k++) {
    const t = (k / K) * Math.PI * 2;
    const x = rx * Math.sin(t);
    const y = -ry * Math.cos(t);
    lens[k] = lens[k - 1] + Math.hypot(x - px, y - py);
    px = x;
    py = y;
  }
  const P = lens[K];
  const table = new Float64Array(M);
  let k = 0;
  for (let m = 0; m < M; m++) {
    const target = (m / M) * P;
    while (k < K && lens[k + 1] < target) k++;
    const span = lens[k + 1] - lens[k] || 1;
    table[m] = ((k + (target - lens[k]) / span) / K) * Math.PI * 2;
  }
  // card length along the curve, leaving a clear gap between neighbours
  const card = Math.round(Math.min(420, Math.max(130, (P / shots.length) * 0.84)));
  return { cx, cy, rx, ry, card, table };
}

function thetaAt(table: Float64Array, frac: number) {
  const M = table.length;
  const f = ((frac % 1) + 1) % 1;
  const i = f * M;
  const i0 = Math.floor(i) % M;
  const i1 = (i0 + 1) % M;
  let t1 = table[i1];
  if (i1 === 0) t1 += Math.PI * 2;
  return table[i0] + (t1 - table[i0]) * (i - Math.floor(i));
}

/** One card on the elliptical arc: position and tilt follow the curve; it fades out low down. */
function RingCard({
  src,
  alt,
  slot,
  index,
  phase,
  geo,
}: {
  src: string;
  alt: string;
  slot: number;
  index: number;
  phase: MotionValue<number>;
  geo: Geo;
}) {
  const { cx, cy, rx, ry, card, table } = geo;
  const theta = useTransform(phase, (p) => thetaAt(table, slot + p / 360));
  const x = useTransform(theta, (t) => cx + rx * Math.sin(t) - card / 2);
  const y = useTransform(theta, (t) => cy - ry * Math.cos(t) - (card * 10) / 32);
  const rotate = useTransform(theta, (t) => (Math.atan2(ry * Math.sin(t), rx * Math.cos(t)) * 180) / Math.PI);
  const opacity = useTransform(theta, (t) => {
    const deg = Math.abs(((((t * 180) / Math.PI) % 360) + 540) % 360 - 180); // 0 = top
    if (deg <= 112) return 1;
    if (deg >= 132) return 0;
    return 1 - (deg - 112) / 20;
  });
  return (
    <motion.div className="absolute top-0 left-0" style={{ x, y, rotate, opacity, width: card }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: (index % 6) * 0.06, ease: [0.25, 1, 0.5, 1] }}
        className="relative overflow-hidden rounded-[14px] border border-ink/10 bg-paper shadow-[0_30px_60px_-28px_rgba(14,26,43,0.5)] md:rounded-[18px]"
        style={{ width: card, aspectRatio: "16 / 10" }}
      >
        <Image src={src} alt={alt} fill sizes="440px" className="object-cover object-top" />
      </motion.div>
    </motion.div>
  );
}
