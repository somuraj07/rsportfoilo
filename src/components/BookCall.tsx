"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState, useSyncExternalStore } from "react";
import { bookingFlow, products } from "@/lib/data";
import { site, whatsappLink } from "@/lib/site";
import { Icon } from "./ui";

const interests = [
  { value: "website", label: "Website" },
  { value: "app", label: "Mobile app" },
  ...products.map((p) => ({ value: p.slug, label: p.name })),
  { value: "other", label: "Something else" },
];

const slots = ["10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"];

const noop = () => () => {};
const todayKey = () => new Date().toDateString();
const urlInterest = () => new URLSearchParams(window.location.search).get("interest") ?? "";

function nextDays(n: number, from: string) {
  const out: Date[] = [];
  const d = new Date(from);
  d.setHours(0, 0, 0, 0);
  while (out.length < n) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0) out.push(new Date(d));
  }
  return out;
}

type Errors = Partial<Record<"name" | "email" | "phone" | "date" | "slot" | "consent" | "form", string>>;

export function BookCall() {
  const today = useSyncExternalStore(noop, todayKey, () => "");
  const days = useMemo(() => (today ? nextDays(10, today) : []), [today]);
  const fromUrl = useSyncExternalStore(noop, urlInterest, () => "");
  const [picked, setInterest] = useState<string | null>(null);
  const interest = picked ?? (interests.some((i) => i.value === fromUrl) ? fromUrl : "website");
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [summary, setSummary] = useState<{ when: string; wa: string } | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const body = {
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim(),
      company: String(fd.get("company") ?? "").trim(),
      message: String(fd.get("message") ?? "").trim(),
      interest,
      date,
      slot,
      consent: fd.get("consent") === "on",
      website: String(fd.get("website") ?? ""), // honeypot
    };
    const errs: Errors = {};
    if (body.name.length < 2) errs.name = "Please enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(body.email)) errs.email = "Please enter a valid email.";
    if (body.phone.replace(/\D/g, "").length < 8) errs.phone = "Please enter a phone or WhatsApp number.";
    if (!date) errs.date = "Pick a day.";
    if (!slot) errs.slot = "Pick a time.";
    if (!body.consent) errs.consent = "Please tick this box so we can contact you about the call.";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setState("sending");
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      const when = new Date(date + "T00:00:00").toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
      setSummary({
        when: `${when}, ${slot}`,
        wa: whatsappLink(`Hi RS Digitech, I just booked a call for ${when} at ${slot}. My name is ${body.name}.`),
      });
      setState("done");
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : "Something went wrong." });
      setState("idle");
    }
  }

  const field =
    "mt-2 block min-h-12 w-full rounded-xl border border-line-dark bg-ink-2 px-4 text-[16px] text-bone placeholder:text-bone/35 transition-colors focus:border-signal focus:outline-none";

  return (
    <section id="book" className="bg-ink py-24 text-bone md:py-32">
      <div className="wrap grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 className="font-display text-[clamp(2.4rem,5.4vw,4.6rem)] font-semibold leading-[1.0] tracking-[-0.04em]">
            Tell us what you want to build.
          </h2>
          <p className="mt-6 max-w-md text-[17px] leading-relaxed text-bone/65">
            Pick a time for a free call. We will talk through your idea or walk you through an ERP product.
          </p>
          <ol className="mt-10 space-y-3">
            {bookingFlow.map((b, i) => (
              <motion.li
                key={b.title}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
                className="flex items-start gap-4 rounded-2xl border border-line-dark p-4"
              >
                <FlowIcon i={i} />
                <span>
                  <span className="block text-[15px] font-medium">{b.title}</span>
                  <span className="mt-0.5 block text-[14px] leading-relaxed text-bone/60">{b.body}</span>
                </span>
              </motion.li>
            ))}
          </ol>
          {(site.whatsapp || site.email) && (
            <div className="mt-10 space-y-3">
              {site.whatsapp && (
                <a
                  href={whatsappLink("Hi RS Digitech, I'd like to talk about a project.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex min-h-12 items-center gap-3 text-[16px]"
                >
                  <WhatsAppIcon />
                  <span className="border-b border-transparent transition-colors group-hover:border-bone">Chat on WhatsApp</span>
                </a>
              )}
              {site.email && (
                <a href={`mailto:${site.email}`} className="group flex min-h-12 items-center gap-3 text-[16px]">
                  <span className="grid size-9 place-items-center rounded-full bg-bone text-[13px] font-bold text-ink">@</span>
                  <span className="border-b border-transparent transition-colors group-hover:border-bone">{site.email}</span>
                </a>
              )}
            </div>
          )}
        </div>

        <div className="min-w-0 lg:col-span-7">
          <AnimatePresence mode="wait">
            {state === "done" && summary ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex min-h-[520px] flex-col justify-center rounded-[24px] bg-bone p-8 text-ink md:p-12"
              >
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 18, delay: 0.1 }}
                  className="grid size-14 place-items-center rounded-full bg-signal text-2xl"
                  aria-hidden
                >
                  <Icon name="check" className="size-6" />
                </motion.span>
                <h3 className="mt-6 font-display text-4xl font-semibold tracking-tight">Your call is booked.</h3>
                <p className="mt-3 text-[17px] text-muted">
                  {summary.when}. A confirmation is on its way to your inbox, and our team has your details.
                </p>
                {summary.wa && (
                  <a
                    href={summary.wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 inline-flex min-h-12 w-fit items-center gap-3 rounded-full bg-ink px-6 text-[15px] font-medium text-bone transition-transform active:scale-[0.97]"
                  >
                    <WhatsAppIcon small /> Also message us on WhatsApp
                  </a>
                )}
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={onSubmit} noValidate className="rounded-[24px] border border-line-dark p-6 md:p-8">
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block text-[14px] text-bone/80">
                    Your name
                    <input name="name" autoComplete="name" className={field} aria-invalid={!!errors.name} />
                    {errors.name && <span className="mt-1.5 block text-[13px] text-signal">{errors.name}</span>}
                  </label>
                  <label className="block text-[14px] text-bone/80">
                    Business or school name <span className="text-bone/60">(optional)</span>
                    <input name="company" autoComplete="organization" className={field} />
                  </label>
                  <label className="block text-[14px] text-bone/80">
                    Email
                    <input name="email" type="email" autoComplete="email" className={field} aria-invalid={!!errors.email} />
                    {errors.email && <span className="mt-1.5 block text-[13px] text-signal">{errors.email}</span>}
                  </label>
                  <label className="block text-[14px] text-bone/80">
                    Phone / WhatsApp
                    <input name="phone" type="tel" autoComplete="tel" className={field} aria-invalid={!!errors.phone} />
                    {errors.phone && <span className="mt-1.5 block text-[13px] text-signal">{errors.phone}</span>}
                  </label>
                </div>

                <fieldset className="mt-6 min-w-0">
                  <legend className="text-[14px] text-bone/80">I am interested in</legend>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {interests.map((i) => (
                      <button
                        type="button"
                        key={i.value}
                        aria-pressed={interest === i.value}
                        onClick={() => setInterest(i.value)}
                        className={`min-h-10 rounded-full border px-4 text-[14px] transition-colors ${
                          interest === i.value ? "border-signal bg-signal text-ink" : "border-line-dark text-bone/80 hover:border-bone/50"
                        }`}
                      >
                        {i.label}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="mt-6 min-w-0">
                  <legend className="text-[14px] text-bone/80">Day</legend>
                  <div className="mt-2.5 flex min-h-16 gap-2 overflow-x-auto pb-1">
                    {days.map((d) => {
                      const v = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
                      const on = date === v;
                      return (
                        <button
                          type="button"
                          key={v}
                          aria-pressed={on}
                          onClick={() => setDate(v)}
                          className={`flex min-h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl border transition-colors ${
                            on ? "border-signal bg-signal text-ink" : "border-line-dark hover:border-bone/50"
                          }`}
                        >
                          <span className="text-[11px] uppercase opacity-70">{d.toLocaleDateString("en-IN", { weekday: "short" })}</span>
                          <span className="font-display text-xl font-semibold">{d.getDate()}</span>
                        </button>
                      );
                    })}
                  </div>
                  {errors.date && <span className="mt-1.5 block text-[13px] text-signal">{errors.date}</span>}
                </fieldset>

                <fieldset className="mt-5 min-w-0">
                  <legend className="text-[14px] text-bone/80">Time (IST)</legend>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {slots.map((s) => (
                      <button
                        type="button"
                        key={s}
                        aria-pressed={slot === s}
                        onClick={() => setSlot(s)}
                        className={`min-h-10 rounded-full border px-4 font-mono text-[13px] transition-colors ${
                          slot === s ? "border-signal bg-signal text-ink" : "border-line-dark text-bone/80 hover:border-bone/50"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  {errors.slot && <span className="mt-1.5 block text-[13px] text-signal">{errors.slot}</span>}
                </fieldset>

                <label className="mt-6 block text-[14px] text-bone/80">
                  About your project <span className="text-bone/60">(optional)</span>
                  <textarea name="message" rows={3} className={`${field} py-3`} />
                </label>

                <label className="mt-6 flex items-start gap-3 text-[14px] leading-relaxed text-bone/80">
                  <input
                    type="checkbox"
                    name="consent"
                    aria-invalid={!!errors.consent}
                    className="mt-1 size-5 shrink-0 accent-[#2bd3a0]"
                  />
                  <span>
                    I agree that RS Digitech can use these details to arrange this call and contact me about it by email
                    and WhatsApp, as described in the{" "}
                    <Link href="/privacy" className="text-bone underline underline-offset-2">
                      privacy policy
                    </Link>
                    . I am 18 or older.
                  </span>
                </label>
                {errors.consent && <span className="mt-1.5 block pl-8 text-[13px] text-signal">{errors.consent}</span>}

                <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

                {errors.form && (
                  <p role="alert" className="mt-5 rounded-xl border border-signal/50 px-4 py-3 text-[14px] text-signal">
                    {errors.form}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={state === "sending"}
                  className="mt-7 inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-signal px-7 py-3.5 text-[16px] font-medium text-ink transition-[background-color,transform] hover:bg-[#5fe0b8] active:scale-[0.98] disabled:opacity-60 sm:w-auto"
                >
                  {state === "sending" ? "Booking…" : "Book my call"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function FlowIcon({ i }: { i: number }) {
  if (i === 1)
    return (
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-paper" aria-hidden>
        <svg viewBox="0 0 24 24" className="size-5">
          <path fill="#4285F4" d="M2 6.5V18a1.5 1.5 0 0 0 1.5 1.5H6V10l-4-3.5Z" />
          <path fill="#34A853" d="M18 19.5h2.5A1.5 1.5 0 0 0 22 18V6.5L18 10v9.5Z" />
          <path fill="#EA4335" d="M6 10V5.5l6 4.5 6-4.5V10l-6 4.5L6 10Z" />
          <path fill="#FBBC04" d="M18 5.5V10l4-3.5V5a1.5 1.5 0 0 0-2.4-1.2L18 5.5Z" />
          <path fill="#C5221F" d="M2 5v1.5L6 10V5.5L4.4 3.8A1.5 1.5 0 0 0 2 5Z" />
        </svg>
      </span>
    );
  if (i === 2) return <span className="shrink-0"><WhatsAppIcon /></span>;
  return (
    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-signal font-mono text-[13px] font-medium text-ink" aria-hidden>
      1
    </span>
  );
}

export function WhatsAppIcon({ small }: { small?: boolean }) {
  return (
    <svg viewBox="0 0 32 32" className={small ? "size-5" : "size-9"} aria-hidden>
      <circle cx="16" cy="16" r="16" fill="#25D366" />
      <path
        fill="#fff"
        d="M23.3 8.7A10.3 10.3 0 0 0 7 21.1L5.7 26l5-1.3a10.3 10.3 0 0 0 4.9 1.3h.1A10.3 10.3 0 0 0 23.3 8.7ZM15.7 24.5h-.1a8.5 8.5 0 0 1-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3a8.5 8.5 0 1 1 7.1 3.8Zm4.7-6.4c-.3-.1-1.5-.7-1.8-.8-.2-.1-.4-.1-.6.1l-.8 1c-.2.2-.3.2-.6.1a7 7 0 0 1-3.5-3c-.3-.5.3-.4.7-1.4.1-.2 0-.3 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.6-.4Z"
      />
    </svg>
  );
}
