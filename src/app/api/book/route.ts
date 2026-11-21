import { products } from "@/lib/data";
import { esc, getMailer, unsubscribeHeaders, visitorFooter } from "@/lib/mail";


type Booking = {
  name: string;
  email: string;
  phone: string;
  company?: string;
  message?: string;
  interest: string;
  date: string;
  slot: string;
  consent?: boolean;
  website?: string;
};

const interestLabel = (v: string) =>
  products.find((p) => p.slug === v)?.name ??
  ({ website: "Website", app: "Mobile app", other: "Something else" } as Record<string, string>)[v] ??
  v;


export async function POST(req: Request) {
  let b: Booking;
  try {
    b = await req.json();
  } catch {
    return Response.json({ error: "Bad request." }, { status: 400 });
  }

  // Honeypot: bots fill hidden fields. Pretend success, send nothing.
  if (b.website) return Response.json({ ok: true });

  if (
    !b.name || b.name.length > 120 ||
    !/^\S+@\S+\.\S+$/.test(b.email ?? "") ||
    (b.phone ?? "").replace(/\D/g, "").length < 8 ||
    !/^\d{4}-\d{2}-\d{2}$/.test(b.date ?? "") ||
    !/^\d{2}:\d{2}$/.test(b.slot ?? "")
  ) {
    return Response.json({ error: "Please check the form and try again." }, { status: 422 });
  }
  // Consent is required and recorded. Never send anything without it.
  if (b.consent !== true) {
    return Response.json({ error: "Please tick the consent box so we can contact you about this call." }, { status: 422 });
  }
  const consentAt = new Date().toISOString();

  const mailer = getMailer();
  if (!mailer) {
    return Response.json(
      { error: "Online booking isn't connected yet. Please reach us on WhatsApp or email instead." },
      { status: 503 },
    );
  }

  const when = `${new Date(b.date + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })} at ${b.slot} IST`;
  const interest = interestLabel(b.interest);

  /* ---------- Gmail automation ---------- */
  const { transporter, from: GMAIL_USER, notify } = mailer;

  const rows: [string, string][] = [
    ["Name", b.name],
    ["Business", b.company || "-"],
    ["Email", b.email],
    ["Phone", b.phone],
    ["Interested in", interest],
    ["When", when],
    ["Message", b.message || "-"],
  ];
  const table = rows
    .map(([k, v]) => `<tr><td style="padding:6px 16px 6px 0;color:#566174">${k}</td><td style="padding:6px 0">${esc(v)}</td></tr>`)
    .join("");

  try {
    await Promise.all([
      transporter.sendMail({
        from: `"RS Digital website" <${GMAIL_USER}>`,
        to: notify,
        replyTo: b.email,
        subject: `New call booked: ${b.name} · ${interest} · ${when}`,
        html: `<h2 style="font-family:sans-serif">New call booking</h2><table style="font-family:sans-serif;font-size:14px">${table}</table>
          <p style="font-family:sans-serif;font-size:12px;color:#566174">Consent to be contacted about this call given at ${consentAt}. The visitor confirmed they are 18 or older.</p>`,
      }),
      transporter.sendMail({
        from: `"RS Digital" <${GMAIL_USER}>`,
        to: b.email,
        subject: `Your call with RS Digital is booked for ${when}`,
        ...unsubscribeHeaders(GMAIL_USER),
        html: `<div style="font-family:sans-serif;font-size:15px;line-height:1.6;color:#0e1a2b">
          <p>Hi ${esc(b.name)},</p>
          <p>Thanks for booking a call with RS Digital. Here are the details:</p>
          <table style="font-size:14px">${table}</table>
          <p>We will call you on <b>${esc(b.phone)}</b> at the chosen time. If you need to change it, just reply to this email.</p>
          <p>Team RS Digital</p>
          ${visitorFooter(GMAIL_USER, "you booked a call on the RS Digital website")}</div>`,
      }),
    ]);
  } catch (err) {
    console.error("booking email failed", err);
    return Response.json({ error: "We couldn't send the confirmation. Please try again in a moment." }, { status: 502 });
  }

  /* ---------- WhatsApp automation (optional, WhatsApp Cloud API) ---------- */
  const whatsapp = await notifyWhatsApp(
    `New call booked\n${b.name} (${b.phone})\n${interest}\n${when}${b.message ? `\n"${b.message.slice(0, 300)}"` : ""}`,
  );

  return Response.json({ ok: true, whatsapp });
}

/**
 * Sends the team a WhatsApp alert through the WhatsApp Cloud API when configured.
 * Business-initiated messages need an approved template; set WHATSAPP_TEMPLATE to
 * its name (with one body variable). Without a template, a plain text message is
 * sent, which WhatsApp only delivers inside a 24-hour customer-service window.
 */
async function notifyWhatsApp(text: string): Promise<boolean> {
  const { WHATSAPP_TOKEN, WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_NOTIFY_TO, WHATSAPP_TEMPLATE, WHATSAPP_TEMPLATE_LANG } = process.env;
  if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_NUMBER_ID || !WHATSAPP_NOTIFY_TO) return false;

  const payload = WHATSAPP_TEMPLATE
    ? {
        messaging_product: "whatsapp",
        to: WHATSAPP_NOTIFY_TO,
        type: "template",
        template: {
          name: WHATSAPP_TEMPLATE,
          language: { code: WHATSAPP_TEMPLATE_LANG || "en" },
          components: [{ type: "body", parameters: [{ type: "text", text: text.replace(/\n/g, " · ") }] }],
        },
      }
    : { messaging_product: "whatsapp", to: WHATSAPP_NOTIFY_TO, type: "text", text: { body: text } };

  try {
    const res = await fetch(`https://graph.facebook.com/v21.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) console.error("whatsapp notify failed", await res.text());
    return res.ok;
  } catch (err) {
    console.error("whatsapp notify error", err);
    return false;
  }
}
