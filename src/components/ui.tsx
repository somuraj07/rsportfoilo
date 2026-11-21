"use client";

import Link from "next/link";
import { MotionConfig } from "framer-motion";
import { useSyncExternalStore, type ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

type BtnProps = {
  href: string;
  children: ReactNode;
  variant?: "solid" | "ghost" | "light" | "signal";
  className?: string;
  external?: boolean;
};

const styles: Record<NonNullable<BtnProps["variant"]>, string> = {
  solid: "bg-ink text-bone hover:bg-ink-3",
  signal: "bg-signal text-ink hover:bg-[#5fe0b8]",
  ghost: "border border-ink/20 text-ink hover:border-ink hover:bg-ink hover:text-bone",
  light: "bg-bone text-ink hover:bg-paper",
};

export function Button({ href, children, variant = "solid", className = "", external }: BtnProps) {
  const cls = `group inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-medium transition-[background-color,color,border-color,transform] duration-200 ease-out active:scale-[0.97] ${styles[variant]} ${className}`;
  const inner = (
    <>
      <span>{children}</span>
      <Arrow />
    </>
  );
  if (external || href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className={`size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Eyebrow({ children, dark }: { children: ReactNode; dark?: boolean }) {
  return (
    <p className={`flex items-center gap-2 font-mono text-[13px] ${dark ? "text-bone/60" : "text-muted"}`}>
      <span className="size-1.5 rounded-full bg-signal" aria-hidden />
      {children}
    </p>
  );
}

/** Section heading. Static on purpose: motion is kept for a few authored moments. */
export function SectionHead({
  title,
  aside,
  dark,
  compact,
}: {
  /** kept for call-site readability; not rendered (headings carry their own weight) */
  eyebrow?: string;
  title: ReactNode;
  aside?: ReactNode;
  dark?: boolean;
  compact?: boolean;
}) {
  return (
    <div className={compact ? "" : "grid gap-6 md:grid-cols-12 md:items-end"}>
      <div className={compact ? "" : "md:col-span-8"}>
        <h2
          className="font-display text-[clamp(2.2rem,5vw,4.25rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-balance"
        >
          {title}
        </h2>
      </div>
      {aside && (
        <div className={`md:col-span-4 text-[17px] leading-relaxed ${dark ? "text-bone/70" : "text-muted"}`}>{aside}</div>
      )}
    </div>
  );
}

const noop = () => () => {};

export function Year() {
  const y = useSyncExternalStore(noop, () => new Date().getFullYear(), () => null);
  return <span>{y ?? ""}</span>;
}

/** Small stroke icons, one weight, used instead of unicode glyphs. */
export function Icon({ name, className = "size-4" }: { name: "arrow" | "back" | "check" | "chevron" | "play" | "pause"; className?: string }) {
  const p = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg aria-hidden viewBox="0 0 16 16" className={className}>
      {name === "arrow" && <path {...p} d="M3 8h10M9 4l4 4-4 4" />}
      {name === "back" && <path {...p} d="M13 8H3M7 4 3 8l4 4" />}
      {name === "check" && <path {...p} strokeWidth={2} d="m3.5 8.5 3 3 6-7" />}
      {name === "chevron" && <path {...p} d="m6 4 4 4-4 4" />}
      {name === "play" && <path fill="currentColor" d="M5 3.5v9l7-4.5-7-4.5Z" />}
      {name === "pause" && <path fill="currentColor" d="M4.5 3.5h2.5v9H4.5zM9 3.5h2.5v9H9z" />}
    </svg>
  );
}
