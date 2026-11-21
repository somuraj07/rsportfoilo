"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Realistic phone frame, matching the Saathyaki phone: 300 × 598 design size,
 * silver rim, 8px black glass bezel, Dynamic Island, status bar and optional
 * story-progress segments. Flat colours only. `scale` shrinks the whole device.
 */
export function PhoneFrame({
  children,
  scale = 1,
  progress,
  dark = false,
}: {
  children: ReactNode;
  scale?: number;
  /** story-progress segments: total and current index; current one fills over `ms` */
  progress?: { total: number; index: number; ms?: number; key?: string | number };
  dark?: boolean;
}) {
  const W = 300;
  const H = 598;
  return (
    <div className="relative" style={{ width: W * scale, height: H * scale }}>
      <div className="absolute top-0 left-0 origin-top-left" style={{ width: W, height: H, transform: `scale(${scale})` }}>
        {/* side buttons (silver) */}
        <span aria-hidden className="absolute top-[104px] -left-[3px] h-7 w-[4px] rounded-l-sm bg-[#8f939b] shadow-[inset_1px_0_0_#b4b7bd]" />
        <span aria-hidden className="absolute top-[150px] -left-[3px] h-12 w-[4px] rounded-l-sm bg-[#8f939b] shadow-[inset_1px_0_0_#b4b7bd]" />
        <span aria-hidden className="absolute top-[210px] -left-[3px] h-12 w-[4px] rounded-l-sm bg-[#8f939b] shadow-[inset_1px_0_0_#b4b7bd]" />
        <span aria-hidden className="absolute top-[170px] -right-[3px] h-20 w-[4px] rounded-r-sm bg-[#8f939b] shadow-[inset_-1px_0_0_#b4b7bd]" />

        {/* silver rim */}
        <div className="relative h-full rounded-[54px] bg-[#9a9ea6] p-[3px] shadow-[0_60px_120px_-40px_rgba(14,26,43,0.55),0_0_0_1px_rgba(0,0,0,0.35),inset_0_0_0_1px_rgba(255,255,255,0.35)]">
          {/* black glass bezel as the border, so the screen corners follow the frame */}
          <div
            className={`relative h-full overflow-hidden rounded-[51px] border-[8px] border-black [transform:translateZ(0)] ${
              dark ? "bg-night text-white" : "bg-paper text-ink"
            }`}
          >
            {/* status bar + island */}
            <div className={`relative z-20 flex items-center justify-between px-6 pt-3 text-[11px] font-semibold ${dark ? "text-white" : "text-ink"}`}>
              <span>9:41</span>
              <span className="absolute top-2 left-1/2 h-[26px] w-[92px] -translate-x-1/2 rounded-full bg-black" />
              <span className="flex items-center gap-1">
                <span className="relative h-2 w-3.5 rounded-[3px] border border-current">
                  <span className="absolute inset-[1px] right-[3px] rounded-[1px] bg-current" />
                </span>
              </span>
            </div>
            {/* story progress */}
            {progress && (
              <div className="relative z-20 mt-4 flex gap-1 px-4">
                {Array.from({ length: progress.total }).map((_, k) => (
                  <span key={k} className={`h-[3px] flex-1 overflow-hidden rounded-full ${dark ? "bg-white/20" : "bg-ink/10"}`}>
                    {k < progress.index && <span className={`block h-full w-full ${dark ? "bg-white" : "bg-ink"}`} />}
                    {k === progress.index && (
                      <motion.span
                        key={`${progress.key ?? ""}-${progress.index}`}
                        className={`block h-full ${dark ? "bg-white" : "bg-ink"}`}
                        initial={{ width: progress.ms ? "0%" : "100%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: (progress.ms ?? 0) / 1000, ease: "linear" }}
                      />
                    )}
                  </span>
                ))}
              </div>
            )}
            <div className="relative flex h-[calc(100%-44px)] flex-col">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Floating glass chip shown beside a phone, like the Saathyaki hero. */
export function PhoneChip({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`absolute z-10 hidden items-center gap-2 rounded-full border border-ink/10 bg-paper/90 px-3.5 py-2 text-[13px] font-medium text-ink shadow-[0_12px_30px_-12px_rgba(14,26,43,0.35)] backdrop-blur md:inline-flex ${className}`}
    >
      {children}
    </span>
  );
}
