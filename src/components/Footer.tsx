import Image from "next/image";
import Link from "next/link";
import { products, services } from "@/lib/data";
import { site, whatsappDisplay, whatsappLink } from "@/lib/site";
import { CookieSettingsButton } from "./CookieBanner";
import { legalLinks } from "./Legal";
import { Year } from "./ui";

export function Footer() {
  return (
    <footer className="border-t border-line-dark bg-ink text-bone">
      <div className="wrap py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <span className="flex items-center gap-4" aria-label="RS Digital" role="img">
              <Image src="/brand/mark-white.png" alt="" width={1266} height={555} className="h-12 w-auto" />
              <span className="font-display text-[22px] font-semibold tracking-[0.22em] uppercase">Digital</span>
            </span>
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-bone/70">
              Websites, mobile apps and ready-made ERP software on subscription.
            </p>
            <address className="mt-6 space-y-1 text-[15px] not-italic text-bone/80">
              {site.email && (
                <a href={`mailto:${site.email}`} className="flex min-h-10 items-center transition-colors hover:text-signal">
                  {site.email}
                </a>
              )}
              {site.whatsapp && (
                <a
                  href={whatsappLink("Hi RS Digital, I have a question.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-10 items-center transition-colors hover:text-signal"
                >
                  WhatsApp {whatsappDisplay()}
                </a>
              )}
              {process.env.NEXT_PUBLIC_BUSINESS_ADDRESS && <p>{process.env.NEXT_PUBLIC_BUSINESS_ADDRESS}</p>}
            </address>
          </div>
          <FooterCol className="md:col-start-7" title="Services" links={services.map((s) => ({ href: "/#services", label: s.title }))} />
          <FooterCol title="Products" links={products.map((p) => ({ href: `/products/${p.slug}`, label: p.name }))} />
          <FooterCol
            title="Company"
            links={[
              { href: "/#work", label: "Our work" },
              { href: "/#process", label: "How we work" },
              { href: "/#book", label: "Book a call" },
              { href: "/privacy#data-request", label: "Delete my data" },
            ]}
          />
        </div>
        <Image src="/brand/mark-white.png" alt="" aria-hidden width={1266} height={555} className="mt-20 h-auto w-full max-w-[720px] opacity-[0.06]" />
        <div className="mt-8 flex flex-col gap-4 border-t border-line-dark pt-6 text-[14px] text-bone/70 lg:flex-row lg:items-center lg:justify-between">
          <span>
            © <Year /> RS Digital{site.city ? ` · ${site.city}` : ""}
          </span>
          <nav aria-label="Legal">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-1">
              {legalLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="inline-flex min-h-10 items-center transition-colors hover:text-signal">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <CookieSettingsButton className="inline-flex min-h-10 items-center transition-colors hover:text-signal" />
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links, className = "" }: { title: string; links: { href: string; label: string }[]; className?: string }) {
  return (
    <div className={`md:col-span-2 ${className}`}>
      <p className="text-[13px] font-medium text-bone/60">{title}</p>
      <ul className="mt-4 space-y-1">
        {links.map((l) => (
          <li key={l.label}>
            <Link href={l.href} className="inline-flex min-h-10 items-center text-[15px] text-bone/80 transition-colors hover:text-signal">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
