import type { Metadata } from "next";
import { ContactBlock, LegalPage } from "@/components/Legal";
import { CookieSettingsButton } from "@/components/CookieBanner";

export const metadata: Metadata = {
  title: "Cookie policy",
  description: "RS Digital uses no tracking or advertising cookies. This page lists the small amount of browser storage the site does use.",
};

export default function CookiesPage() {
  return (
    <LegalPage
      title="Cookie policy"
      intro="This website uses no advertising, analytics or tracking cookies. It uses only a small amount of storage in your browser that the site needs to work."
    >
      <h2>What we store</h2>
      <ul>
        <li>
          <strong>Cookie notice choice</strong> (browser local storage, key <code>rs-cookie-choice</code>): remembers that
          you have seen the cookie notice so it does not appear on every page. It stays until you clear your browser data.
        </li>
      </ul>
      <p>This is essential storage, so it does not need your consent, but you can clear it at any time in your browser.</p>

      <h2>What we do not use</h2>
      <ul>
        <li>No analytics or measurement tools.</li>
        <li>No advertising or social media pixels.</li>
        <li>No third-party fonts loaded from other servers: our fonts are served from our own website.</li>
      </ul>
      <p>If we ever add optional cookies, we will ask for your permission first and update this page.</p>

      <h2>Other services</h2>
      <p>
        If you click a WhatsApp link, you leave this website, and WhatsApp&apos;s own cookie policy applies.
      </p>

      <h2>Your choice</h2>
      <p>You can show the cookie notice again here:</p>
      <CookieSettingsButton />

      <h2>Contact</h2>
      <ContactBlock />
    </LegalPage>
  );
}
