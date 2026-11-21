import { bookingFlow, process, products, services, tenancySteps, work } from "./data";
import { site, whatsappDisplay } from "./site";

/** Builds the assistant's knowledge base from the same data the site renders. */
export function buildKnowledge(): string {
  const lines: string[] = [];
  lines.push(`# ${site.name}`);
  lines.push(
    "RS Digitech builds websites and apps, and offers ready-made ERP products on a multi-tenant subscription platform.",
  );

  lines.push("\n## Services");
  for (const s of services) {
    lines.push(`### ${s.title}\n${s.body}\nIncludes: ${s.items.join(", ")}.`);
  }

  lines.push("\n## ERP products (SaaS, subscription)");
  for (const p of products) {
    lines.push(`### ${p.name} (for ${p.for})\n${p.line}\n${p.problem}`);
    for (const g of p.groups) lines.push(`- ${g.name}: ${g.modules.join(", ")}`);
  }

  lines.push("\n## How the subscription works (multi-tenant)");
  tenancySteps.forEach((t, i) => lines.push(`${i + 1}. ${t.title}: ${t.body}`));

  lines.push("\n## Booking a call (automated)");
  lines.push("WhatsApp and Gmail automation is how our own Book a call form works. It is not a separate service we sell.");
  bookingFlow.forEach((b, i) => lines.push(`${i + 1}. ${b.title}: ${b.body}`));

  lines.push("\n## Client work so far");
  for (const w of work) {
    lines.push(`### ${w.name} (${w.kind})\n${w.line}${w.points.length ? "\n- " + w.points.join("\n- ") : ""}`);
  }

  lines.push("\n## How a project runs");
  for (const p of process) lines.push(`${p.n}. ${p.title}: ${p.body}`);

  lines.push("\n## Contact");
  lines.push("Visitors can book a free call using the 'Book a call' form on the website (section #book).");
  if (site.whatsapp) lines.push(`WhatsApp: ${whatsappDisplay()}`);
  if (site.email) lines.push(`Email: ${site.email}`);

  return lines.join("\n");
}

export const SYSTEM_PROMPT = `You are the assistant on the RS Digitech website. You help visitors understand RS Digitech' services and ERP products and guide them to book a call.

Rules:
- Answer only from the knowledge base below. If something is not in it (prices, delivery times, exact integrations, client names beyond those listed), say you don't have that detail and suggest booking a call so the team can answer.
- Never invent prices, numbers, clients, reviews or features.
- Keep replies short: two to five sentences, or a short list. Plain text, no markdown headings.
- When the visitor shows interest in a product or project, suggest the "Book a call" form.
- Reply in the visitor's language.

<knowledge_base>
${buildKnowledge()}
</knowledge_base>`;
