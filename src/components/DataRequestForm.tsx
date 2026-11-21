"use client";

import { useState } from "react";
import { site } from "@/lib/site";

const options = [
  { value: "delete", label: "Delete my data" },
  { value: "access", label: "See the data you hold about me" },
  { value: "correct", label: "Correct my data" },
  { value: "stop", label: "Stop contacting me" },
];

export function DataRequestForm() {
  const [type, setType] = useState("delete");
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "").trim();
    setError("");
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError("Enter the email address you used with us.");
      return;
    }
    setEmailError("");
    setState("sending");
    try {
      const res = await fetch("/api/data-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, type, details: fd.get("details"), website: fd.get("website") }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setState("idle");
    }
  }

  if (state === "done") {
    return (
      <p role="status" className="mt-4 rounded-2xl border border-line bg-paper p-5">
        Request sent. We emailed you a confirmation and will reply within 30 days.
      </p>
    );
  }

  const field = "mt-2 block min-h-12 w-full rounded-xl border border-line bg-paper px-4 text-[16px] focus:border-ink focus:outline-none";

  return (
    <form onSubmit={onSubmit} noValidate className="mt-4 rounded-[20px] border border-line bg-paper/60 p-5 md:p-6">
      <label className="block text-[15px] font-medium">
        Your email
        <input name="email" type="email" autoComplete="email" className={field} aria-invalid={!!emailError} aria-describedby={emailError ? "dr-email-err" : undefined} />
        {emailError && (
          <span id="dr-email-err" className="mt-1.5 block text-[14px] text-[#b42318]">
            {emailError}
          </span>
        )}
      </label>
      <fieldset className="mt-5">
        <legend className="text-[15px] font-medium">What would you like us to do?</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {options.map((o) => (
            <label
              key={o.value}
              className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-4 text-[15px] transition-colors ${
                type === o.value ? "border-ink bg-paper" : "border-line hover:border-ink/40"
              }`}
            >
              <input type="radio" name="type" value={o.value} checked={type === o.value} onChange={() => setType(o.value)} className="accent-ink" />
              {o.label}
            </label>
          ))}
        </div>
      </fieldset>
      <label className="mt-5 block text-[15px] font-medium">
        Details <span className="font-normal text-muted">(optional)</span>
        <textarea name="details" rows={3} className={`${field} py-3`} />
      </label>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      {error && (
        <p role="alert" className="mt-4 text-[15px] text-[#b42318]">
          {error}
          {site.email && (
            <>
              {" "}
              Email <a href={`mailto:${site.email}?subject=Privacy%20request`}>{site.email}</a>.
            </>
          )}
        </p>
      )}
      <button
        type="submit"
        disabled={state === "sending"}
        className="mt-5 inline-flex min-h-12 items-center rounded-full bg-ink px-6 text-[15px] font-medium text-bone transition-[background-color,transform] hover:bg-ink-3 active:scale-[0.97] disabled:opacity-60"
      >
        {state === "sending" ? "Sending…" : "Send request"}
      </button>
    </form>
  );
}
