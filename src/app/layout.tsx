import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter, Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/ui";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ChatWidget } from "@/components/ChatWidget";
import { CookieBanner } from "@/components/CookieBanner";
import { site } from "@/lib/site";

const display = Inter_Tight({ variable: "--font-display-src", subsets: ["latin"], weight: ["500", "600", "700"] });
const body = Inter({ variable: "--font-body-src", subsets: ["latin"] });
const serif = Instrument_Serif({ variable: "--font-serif-src", subsets: ["latin"], weight: "400", style: ["normal", "italic"] });
const mono = JetBrains_Mono({ variable: "--font-mono-src", subsets: ["latin"], weight: ["400", "500"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "RS Digitech — Websites, apps and ERP software for growing businesses",
    template: "%s · RS Digitech",
  },
  description:
    "RS Digitech builds websites and mobile apps, and runs six ERP products on subscription: School, Healthcare, Coaching, Garage, Distribution and Restaurant ERP.",
  openGraph: {
    title: "RS Digitech — Websites, apps and ERP software",
    description:
      "Custom websites and apps, plus ready-made ERP software for schools, hospitals, coaching centres, garages, distributors and restaurants.",
    type: "website",
    siteName: "RS Digitech",
  },
};

export const viewport: Viewport = {
  themeColor: "#0e1a2b",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable} ${serif.variable}`}>
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-bone"
        >
          Skip to content
        </a>
        <Providers>
          <Nav />
          <main id="main">{children}</main>
          <Footer />
          <ChatWidget />
          <CookieBanner />
        </Providers>
      </body>
    </html>
  );
}
