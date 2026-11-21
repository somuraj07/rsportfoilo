import { esc, getMailer, unsubscribeHeaders, visitorFooter } from "@/lib/mail";

const types: Record<string, string> = {
  access: "See the data you hold about me",
  correct: "Correct my data",
  delete: "Delete my data",
  stop: "Stop contacting me",
};

export async function POST(req: Request) {
  let b: { email?: string; type?: string; details?: string; website?: string };
  try {
    b = await req.json();
  } catch {
    return Response.json({ error: "Bad request." }, { status: 400 });
  }
  if (b.website) return Response.json({ ok: true }); // honeypot

  const email = (b.email ?? "").trim();
  const type = b.type ?? "";
  if (!/^\S+@\S+\.\S+$/.test(email) || !types[type]) {
    return Response.json({ error: "Please enter a valid email and choose a request type." }, { status: 422 });
  }

  const mailer = getMailer();
  if (!mailer) {
    return Response.json(
      { error: "Online requests aren't connected yet. Please email us directly and we will handle it." },
      { status: 503 },
    );
  }

  const details = (b.details ?? "").slice(0, 2000);
  try {
    await Promise.all([
      mailer.transporter.sendMail({
        from: `"RS Digital website" <${mailer.from}>`,
        to: mailer.notify,
        replyTo: email,
        subject: `Privacy request: ${types[type]} (${email})`,
        html: `<div style="font-family:sans-serif;font-size:14px;line-height:1.6">
          <h2>Privacy request</h2>
          <p><b>From:</b> ${esc(email)}<br /><b>Request:</b> ${esc(types[type])}<br /><b>Received:</b> ${new Date().toISOString()}</p>
          <p><b>Details:</b><br />${esc(details) || "-"}</p>
          <p>Verify the requester owns this email before acting. Reply within 30 days.</p></div>`,
      }),
      mailer.transporter.sendMail({
        from: `"RS Digital" <${mailer.from}>`,
        to: email,
        subject: "We received your privacy request",
        ...unsubscribeHeaders(mailer.from),
        html: `<div style="font-family:sans-serif;font-size:15px;line-height:1.6;color:#0e1a2b">
          <p>Hello,</p>
          <p>We received your request: <b>${esc(types[type])}</b>.</p>
          <p>We may reply to this email to confirm it is you, and we aim to complete your request within 30 days.</p>
          <p>Team RS Digital</p>
          ${visitorFooter(mailer.from, "you sent a privacy request on the RS Digital website")}</div>`,
      }),
    ]);
  } catch (err) {
    console.error("data request email failed", err);
    return Response.json({ error: "We couldn't send your request. Please try again or email us." }, { status: 502 });
  }
  return Response.json({ ok: true });
}
