import nodemailer from "nodemailer";

/** Shared Gmail sender for every form. Returns null when Gmail is not configured. */
export function getMailer() {
  const { GMAIL_USER, GMAIL_APP_PASSWORD } = process.env;
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) return null;
  const transporter = nodemailer.createTransport({ service: "gmail", auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD } });
  return { transporter, from: GMAIL_USER, notify: process.env.BOOKING_NOTIFY_EMAIL || GMAIL_USER };
}

export const esc = (s = "") => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/**
 * Footer for every email sent to a visitor: why they got it, how to stop more,
 * and where the privacy policy is. Pair it with `unsubscribeHeaders` below.
 */
export function visitorFooter(from: string, reason: string) {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const unsub = `mailto:${from}?subject=${encodeURIComponent("Unsubscribe")}`;
  return `<hr style="border:none;border-top:1px solid #d9dce1;margin:24px 0" />
  <p style="font-size:12px;line-height:1.6;color:#566174">
    You are receiving this because ${esc(reason)}. We only email you about this request.
    To stop receiving emails from us, <a href="${unsub}" style="color:#566174">unsubscribe</a>.
    ${site ? `Read our <a href="${site}/privacy" style="color:#566174">privacy policy</a>.` : ""}
    <br />RS Digital
  </p>`;
}

export function unsubscribeHeaders(from: string) {
  return { list: { unsubscribe: { url: `mailto:${from}?subject=Unsubscribe`, comment: "Unsubscribe" } } };
}
