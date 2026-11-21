import Link from "next/link";
import type { ReactNode } from "react";
import { site, whatsappDisplay } from "@/lib/site";

/** Date the policies were last changed. Update it whenever you edit one of them. */
export const POLICY_UPDATED = "21 November 2026";

export const legalLinks = [
  { href: "/privacy", label: "Privacy policy" },
  { href: "/terms", label: "Terms of service" },
  { href: "/refunds", label: "Refund policy" },
  { href: "/cookies", label: "Cookie policy" },
];

export function LegalPage({ title, intro, children }: { title: string; intro: string; children: ReactNode }) {
  return (
    <div className="pt-[72px]">
      <div className="wrap grid gap-12 py-16 md:py-24 lg:grid-cols-12">
        <aside className="lg:col-span-3">
          <nav aria-label="Policies" className="lg:sticky lg:top-28">
            <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-0">
              {legalLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="inline-flex min-h-11 items-center rounded-full border border-line px-4 text-[14px] text-ink/75 transition-colors hover:border-ink hover:text-ink lg:rounded-none lg:border-0 lg:px-0"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <article
          className="max-w-[72ch] lg:col-span-8 lg:col-start-5 [&_a]:underline [&_a]:decoration-1 [&_a]:underline-offset-[3px] [&_a:hover]:decoration-2 [&_code]:rounded [&_code]:bg-line/60 [&_code]:px-1.5 [&_code]:text-[15px] [&_h2]:mt-12 [&_h2]:mb-3 [&_h2]:font-display [&_h2]:text-[1.6rem] [&_h2]:leading-tight [&_h2]:font-semibold [&_h2]:tracking-[-0.02em] [&_h3]:mt-7 [&_h3]:mb-2 [&_h3]:text-[1.1rem] [&_h3]:font-semibold [&_li]:text-[17px] [&_li]:leading-[1.7] [&_li]:text-ink-3 [&_li+li]:mt-1.5 [&_p]:text-[17px] [&_p]:leading-[1.7] [&_p]:text-ink-3 [&_p+p]:mt-3.5 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5"
        >
          <h1 className="font-display text-[clamp(2.4rem,5vw,4rem)] leading-[1.02] font-semibold tracking-[-0.035em]">{title}</h1>
          <p className="mt-4 text-[14px]! text-muted!">Last updated {POLICY_UPDATED}</p>
          <p className="mt-8 text-[19px]! leading-relaxed! text-ink!">{intro}</p>
          {children}
        </article>
      </div>
    </div>
  );
}

/** The business details every policy points to. Address appears only when it is set. */
export function ContactBlock() {
  const address = process.env.NEXT_PUBLIC_BUSINESS_ADDRESS ?? "";
  return (
    <ul>
      <li>Business: {site.name}</li>
      {site.email && (
        <li>
          Email: <a href={`mailto:${site.email}`}>{site.email}</a>
        </li>
      )}
      {site.whatsapp && <li>WhatsApp: {whatsappDisplay()}</li>}
      {address && <li>Address: {address}</li>}
    </ul>
  );
}
