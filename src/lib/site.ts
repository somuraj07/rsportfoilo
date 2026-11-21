/**
 * Public contact details. Everything here comes from environment variables so
 * nothing invented ever ships. Set them in `.env.local` (see `.env.example`).
 * Anything left empty is simply hidden on the site.
 */
export const site = {
  name: "RS Digital",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  /** WhatsApp number in international format, digits only, e.g. 919876543210 */
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",
  city: process.env.NEXT_PUBLIC_CITY ?? "",
};

export function whatsappLink(text: string) {
  if (!site.whatsapp) return "";
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
}

/** "919908864288" -> "+91 99088 64288" */
export function whatsappDisplay() {
  const d = site.whatsapp;
  if (d.length === 12 && d.startsWith("91")) return `+91 ${d.slice(2, 7)} ${d.slice(7)}`;
  return d ? `+${d}` : "";
}
