"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

/**
 * Working miniatures of three ERP screens. Everything here is clickable UI,
 * not a claim: names and items are on-screen examples of how the product works.
 */

const tabs = [
  { id: "school", label: "School ERP" },
  { id: "hospital", label: "Healthcare ERP" },
  { id: "restaurant", label: "Restaurant ERP" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function HeroScreens() {
  const [tab, setTab] = useState<TabId>("school");

  return (
    <div className="relative overflow-hidden rounded-[20px] border border-ink/10 bg-paper shadow-[0_1px_0_rgba(0,0,0,0.04),0_30px_60px_-30px_rgba(14,26,43,0.35)]">
      {/* window bar */}
      <div className="flex items-center gap-3 border-b border-line px-4 py-3">
        <div className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-line" />
          <span className="size-2.5 rounded-full bg-line" />
          <span className="size-2.5 rounded-full bg-line" />
        </div>
        <div role="tablist" aria-label="Product preview" className="flex gap-1 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`relative min-h-11 shrink-0 rounded-full px-3.5 text-[13px] font-medium transition-colors ${
                tab === t.id ? "text-bone" : "text-muted hover:text-ink"
              }`}
            >
              {tab === t.id && (
                <motion.span
                  layoutId="hero-tab"
                  className="absolute inset-0 rounded-full bg-ink"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <span className="relative">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="relative h-[400px] sm:h-[430px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}
            className="absolute inset-0 p-4 sm:p-5"
          >
            {tab === "school" && <SchoolScreen />}
            {tab === "hospital" && <HospitalScreen />}
            {tab === "restaurant" && <RestaurantScreen />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function ScreenTitle({ title, meta }: { title: string; meta: string }) {
  return (
    <div className="mb-4 flex items-baseline justify-between gap-3">
      <p className="font-display text-lg font-semibold tracking-tight">{title}</p>
      <p className="font-mono text-[12px] text-muted">{meta}</p>
    </div>
  );
}

const students = ["Aarav", "Diya", "Ishaan", "Meera", "Rohan", "Sana"];

function SchoolScreen() {
  const [present, setPresent] = useState<Record<string, boolean>>(
    Object.fromEntries(students.map((s, i) => [s, i !== 3])),
  );
  const count = Object.values(present).filter(Boolean).length;
  return (
    <div className="flex h-full flex-col">
      <ScreenTitle title="Attendance · Class 8 B" meta="Period 1" />
      <ul className="flex-1 divide-y divide-line rounded-xl border border-line">
        {students.map((s) => (
          <li key={s} className="flex items-center justify-between px-3.5 py-2.5">
            <span className="flex items-center gap-3 text-[14px]">
              <span className="grid size-7 place-items-center rounded-full bg-bone font-mono text-[11px]">{s[0]}</span>
              {s}
            </span>
            <button
              onClick={() => setPresent((p) => ({ ...p, [s]: !p[s] }))}
              aria-label={`Mark ${s} ${present[s] ? "absent" : "present"}`}
              className={`min-h-10 w-20 rounded-full text-[12px] font-medium transition-colors ${
                present[s] ? "bg-ink text-bone" : "bg-bone text-muted"
              }`}
            >
              {present[s] ? "Present" : "Absent"}
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex items-center justify-between text-[13px]">
        <span className="text-muted">
          {count} of {students.length} present
        </span>
        <span className="flex items-center gap-2 font-medium">
          <span className="size-1.5 animate-pulse-dot rounded-full bg-signal" />
          Saved to the class register
        </span>
      </div>
    </div>
  );
}

function HospitalScreen() {
  const [current, setCurrent] = useState(14);
  const steps = ["Token", "Consultation", "X-ray", "Surgery", "Discharge"];
  const [step, setStep] = useState(1);
  return (
    <div className="flex h-full flex-col">
      <ScreenTitle title="OPD queue" meta="Dept. Orthopaedics" />
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-ink p-4 text-bone">
          <p className="font-mono text-[12px] text-bone/60">Now serving</p>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.p
              key={current}
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              className="mt-1 font-display text-5xl font-semibold tracking-tight"
            >
              {String(current).padStart(3, "0")}
            </motion.p>
          </AnimatePresence>
        </div>
        <div className="flex flex-col justify-between rounded-xl border border-line p-4">
          <p className="font-mono text-[12px] text-muted">Next token</p>
          <button
            onClick={() => setCurrent((c) => c + 1)}
            className="min-h-10 rounded-full bg-signal text-[14px] font-medium text-ink transition-transform active:scale-[0.97]"
          >
            Call {String(current + 1).padStart(3, "0")}
          </button>
        </div>
      </div>
      <p className="mt-5 mb-2 text-[13px] text-muted">Patient journey</p>
      <ol className="grid grid-cols-5 gap-1.5">
        {steps.map((s, i) => (
          <li key={s}>
            <button
              onClick={() => setStep(i)}
              className="group w-full text-left"
              aria-label={`Move patient to ${s}`}
            >
              <span
                className={`block h-1.5 rounded-full transition-colors ${i <= step ? "bg-ink" : "bg-line group-hover:bg-muted/40"}`}
              />
              <span className={`mt-2 block text-[11px] sm:text-[12px] ${i === step ? "font-medium text-ink" : "text-muted"}`}>
                {s}
              </span>
            </button>
          </li>
        ))}
      </ol>
      <div className="mt-auto rounded-xl border border-line p-3.5 text-[13px]">
        <p className="font-medium">Record follows the patient</p>
        <p className="mt-1 text-muted">Notes, reports and X-ray images stay attached at every step, no notebook needed.</p>
      </div>
    </div>
  );
}

const menu = [
  { name: "Masala dosa", price: 90 },
  { name: "Paneer tikka", price: 220 },
  { name: "Veg biryani", price: 180 },
  { name: "Filter coffee", price: 40 },
];

function RestaurantScreen() {
  const [qty, setQty] = useState<Record<string, number>>({ "Masala dosa": 2, "Filter coffee": 2 });
  const total = menu.reduce((t, m) => t + (qty[m.name] ?? 0) * m.price, 0);
  return (
    <div className="flex h-full flex-col">
      <ScreenTitle title="Table 6 · New order" meta="Today's special: Veg biryani" />
      <ul className="flex-1 space-y-2">
        {menu.map((m) => {
          const q = qty[m.name] ?? 0;
          return (
            <li key={m.name} className="flex items-center justify-between rounded-xl border border-line px-3.5 py-2.5">
              <span className="text-[14px]">
                {m.name}
                <span className="ml-2 font-mono text-[12px] text-muted">₹{m.price}</span>
              </span>
              <span className="flex items-center gap-1">
                <button
                  aria-label={`Remove one ${m.name}`}
                  onClick={() => setQty((s) => ({ ...s, [m.name]: Math.max(0, q - 1) }))}
                  className="grid size-8 place-items-center rounded-full bg-bone text-[16px] transition-colors hover:bg-line"
                >
                  −
                </button>
                <span className="w-6 text-center font-mono text-[13px]">{q}</span>
                <button
                  aria-label={`Add one ${m.name}`}
                  onClick={() => setQty((s) => ({ ...s, [m.name]: q + 1 }))}
                  className="grid size-8 place-items-center rounded-full bg-ink text-[16px] text-bone transition-colors hover:bg-ink-3"
                >
                  +
                </button>
              </span>
            </li>
          );
        })}
      </ul>
      <div className="mt-3 flex items-center justify-between rounded-xl bg-ink px-4 py-3 text-bone">
        <span className="text-[13px] text-bone/70">Bill total</span>
        <motion.span key={total} initial={{ scale: 0.92 }} animate={{ scale: 1 }} className="font-display text-xl font-semibold">
          ₹{total}
        </motion.span>
      </div>
    </div>
  );
}
