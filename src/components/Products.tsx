"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { products } from "@/lib/data";
import { Arrow, SectionHead } from "./ui";

export function Products() {
  const [active, setActive] = useState(0);
  const p = products[active];

  return (
    <section id="products" className="bg-ink py-24 text-bone md:py-32">
      <div className="wrap">
        <SectionHead
          dark
          eyebrow="ERP products · SaaS"
          title={
            <>
              Ready-made ERP software, <span className="text-bone/50">one for each kind of business.</span>
            </>
          }
          aside="Each product runs on our multi-tenant platform. You subscribe, we set it up with your brand, and your team starts using it."
        />

        <div className="mt-16 grid gap-6 lg:grid-cols-12">
          <div role="tablist" aria-label="ERP products" aria-orientation="vertical" className="flex flex-col lg:col-span-5">
            {products.map((item, i) => (
              <button
                key={item.slug}
                role="tab"
                id={`tab-${item.slug}`}
                aria-selected={active === i}
                aria-controls="product-panel"
                tabIndex={active === i ? 0 : -1}
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                onKeyDown={(e) => {
                  if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
                  e.preventDefault();
                  const next = (i + (e.key === "ArrowDown" ? 1 : -1) + products.length) % products.length;
                  setActive(next);
                  document.getElementById(`tab-${products[next].slug}`)?.focus();
                }}
                className="group relative flex min-h-[72px] items-center justify-between border-b border-line-dark text-left"
              >
                <span className="flex items-baseline gap-4">
                  <span
                    className={`font-display text-[clamp(1.5rem,2.6vw,2.2rem)] font-semibold tracking-[-0.03em] transition-colors duration-200 ${
                      active === i ? "text-bone" : "text-bone/55 group-hover:text-bone/80"
                    }`}
                  >
                    {item.name}
                  </span>
                </span>
                {active === i && (
                  <motion.span layoutId="product-dot" className="size-2.5 rounded-full bg-signal" transition={{ type: "spring", stiffness: 500, damping: 36 }} />
                )}
              </button>
            ))}
          </div>

          <div className="lg:col-span-7">
            <div id="product-panel" role="tabpanel" aria-labelledby={`tab-${p.slug}`} className="relative min-h-[520px] overflow-hidden rounded-[24px] bg-bone p-7 text-ink md:p-10">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={p.slug}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
                  className="flex h-full flex-col"
                >
                  <p className="font-mono text-[13px] text-muted">For {p.for.toLowerCase()}</p>
                  <h3 className="mt-3 font-display text-[clamp(1.6rem,2.8vw,2.4rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-balance">
                    {p.line}
                  </h3>
                  <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-muted">{p.problem}</p>

                  <div className="mt-8 grid gap-x-6 gap-y-6 sm:grid-cols-2">
                    {p.groups.map((g, gi) => (
                      <div key={g.name}>
                        <p className="mb-2.5 text-[13px] font-medium">{g.name}</p>
                        <ul className="flex flex-wrap gap-1.5">
                          {g.modules.map((m, mi) => (
                            <motion.li
                              key={m}
                              initial={{ opacity: 0, scale: 0.94 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.08 + gi * 0.05 + mi * 0.025, duration: 0.25 }}
                              className="rounded-full border border-line bg-paper px-3 py-1.5 text-[13px]"
                            >
                              {m}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto flex flex-wrap gap-3 pt-10">
                    <Link
                      href={`/products/${p.slug}`}
                      className="group inline-flex min-h-12 items-center gap-2 rounded-full bg-ink px-6 text-[15px] font-medium text-bone transition-[background-color,transform] hover:bg-ink-3 active:scale-[0.97]"
                    >
                      See {p.name} <Arrow />
                    </Link>
                    <Link
                      href={`/?interest=${p.slug}#book`}
                      className="group inline-flex min-h-12 items-center gap-2 rounded-full border border-ink/20 px-6 text-[15px] font-medium transition-colors hover:border-ink"
                    >
                      Book a demo
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
