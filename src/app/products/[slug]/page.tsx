import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { products } from "@/lib/data";
import { BookCall } from "@/components/BookCall";
import { Button, Icon } from "@/components/ui";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = products.find((x) => x.slug === slug);
  if (!p) return {};
  return { title: p.name, description: `${p.line} ${p.problem}` };
}

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<div className="min-h-dvh" />}>
      <ProductContent params={params} />
    </Suspense>
  );
}

async function ProductContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = products.find((x) => x.slug === slug);
  if (!p) notFound();
  const others = products.filter((x) => x.slug !== p.slug);

  return (
    <>
      <section className="flex min-h-[88dvh] items-end pt-32 pb-16">
        <div className="wrap">
          <Link href="/#products" className="group inline-flex min-h-11 items-center gap-2 text-[15px] text-muted hover:text-ink">
            <span className="transition-transform group-hover:-translate-x-0.5"><Icon name="back" /></span> All ERP products
          </Link>
          <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <h1 className="font-display text-[clamp(3rem,8vw,7.5rem)] font-semibold leading-[0.92] tracking-[-0.05em]">
                {p.name}
              </h1>
              <p className="mt-6 max-w-2xl font-display text-[clamp(1.4rem,2.4vw,2rem)] font-medium leading-snug tracking-tight">
                {p.line}
              </p>
            </div>
            <div className="lg:col-span-4">
              <p className="text-[17px] leading-relaxed text-muted">{p.problem}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <Button href={`/products/${p.slug}?interest=${p.slug}#book`}>Book a demo</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-paper py-24">
        <div className="wrap">
          <h2 className="font-display text-[clamp(2rem,4vw,3.4rem)] font-semibold tracking-[-0.035em]">What&apos;s inside</h2>
          <div className="mt-12 grid gap-px overflow-hidden rounded-[24px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {p.groups.map((g) => (
              <div key={g.name} className="bg-paper p-7">
                <p className="font-mono text-[13px] text-muted">{g.name}</p>
                <ul className="mt-6 space-y-3">
                  {g.modules.map((m) => (
                    <li key={m} className="flex items-start gap-3 text-[17px]">
                      <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-signal" />
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-10 max-w-2xl text-[16px] leading-relaxed text-muted">
            Every {p.name} customer gets a separate tenant on the RS platform with their own name, logo and data, and pays a
            monthly subscription.
          </p>
        </div>
      </section>

      <BookCall />

      <section className="py-24">
        <div className="wrap">
          <h2 className="font-display text-3xl font-semibold tracking-tight">Other ERP products</h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {others.map((o) => (
              <li key={o.slug}>
                <Link
                  href={`/products/${o.slug}`}
                  className="group flex min-h-36 flex-col justify-between rounded-[20px] border border-line bg-paper p-5 transition-[transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-ink"
                >
                  <span className="font-mono text-[12px] text-muted">{o.code}</span>
                  <span className="flex items-center justify-between font-display text-xl font-semibold tracking-tight">
                    {o.name}
                    <span className="transition-transform group-hover:translate-x-0.5"><Icon name="arrow" /></span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
