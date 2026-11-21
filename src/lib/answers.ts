import { bookingFlow, process, products, services, tenancySteps, work } from "./data";
import { site, whatsappDisplay } from "./site";

/**
 * Built-in answer engine. Used when no ANTHROPIC_API_KEY is set, or when the
 * Claude API is unreachable. It only ever repeats what is in data.ts.
 */

const BOOK = "If you'd like to go further, use the Book a call form on this page and our team will walk you through it.";

const productKeys: Record<string, RegExp> = {
  "school-erp": /school|student|admission|attendance|homework|assignment|timetable|library|transport|circular|fee|teacher|parent/,
  "healthcare-erp": /hospital|health|clinic|patient|doctor|x-?ray|surgery|discharge|token|opd|medical/,
  "coaching-erp": /coaching|tuition|institute|batch|academy/,
  "garage-erp": /garage|vehicle|workshop|service cent|mechanic|car|bike/,
  "distribution-erp": /distribut|wholesale|inventory|stock|dealer|supply/,
  "restaurant-erp": /restaurant|cafe|café|hotel|menu|kitchen|food|order|billing|special/,
};

function productAnswer(slug: string) {
  const p = products.find((x) => x.slug === slug)!;
  const mods = p.groups.map((g) => `• ${g.name}: ${g.modules.join(", ")}`).join("\n");
  return `${p.name} is built for ${p.for.toLowerCase()}. ${p.line}\n\n${p.problem}\n\nWhat's inside:\n${mods}\n\nIt runs on our multi-tenant platform: you get your own space with your brand, on a monthly subscription.`;
}

function serviceAnswer(id: string) {
  const s = services.find((x) => x.id === id)!;
  return `${s.title}: ${s.body}\n\nWe build:\n${s.items.map((i) => `• ${i}`).join("\n")}`;
}

const topics: { test: RegExp; answer: () => string }[] = [
  {
    test: /price|pricing|cost|how much|rent|charge|fee for|plan|rate/,
    answer: () =>
      "Pricing depends on the product and the size of your business, so we share it on a call rather than guess here. ERP products are on a monthly subscription; custom websites and apps are quoted after we understand the scope.",
  },
  {
    test: /subscri|tenant|multi|saas|white.?label|brand|own space|how does .*work/,
    answer: () =>
      `Our ERP products run on a multi-tenant platform:\n${tenancySteps.map((t, i) => `${i + 1}. ${t.title}: ${t.body}`).join("\n")}`,
  },
  {
    test: /whatsapp|gmail|email|mail|automat|confirm/,
    answer: () =>
      `When you book a call on this website, it's automated:\n${bookingFlow.map((b, i) => `${i + 1}. ${b.title}: ${b.body}`).join("\n")}`,
  },
  { test: /web|site|e-?commerce|shop|store|static|full.?stack|landing|portal/, answer: () => serviceAnswer("web") },
  { test: /\bapps?\b|android|ios|mobile|play ?store|app store/, answer: () => serviceAnswer("app") },
  {
    test: /work|client|portfolio|project|saathyaki|young ?ceo|built|case/,
    answer: () =>
      `Apps we have shipped so far:\n${work
        .map((w) => `• ${w.name} (${w.kind}): ${w.line}${w.points.length ? " " + w.points.join(", ") + "." : ""}`)
        .join("\n")}`,
  },
  {
    test: /process|step|timeline|how long|start|begin|support|maintain/,
    answer: () => `How a project runs:\n${process.map((p) => `${p.n}. ${p.title}: ${p.body}`).join("\n")}`,
  },
  {
    test: /contact|call|book|meet|demo|talk|phone|reach/,
    answer: () =>
      `You can book a free call with the Book a call form on this page. Pick a day and time and you'll get an email confirmation.${
        site.whatsapp ? ` You can also message us on WhatsApp at ${whatsappDisplay()}.` : ""
      }${site.email ? ` Or email ${site.email}.` : ""}`,
  },
  { test: /erp|product|software|tool/, answer: () => `Our ERP products:\n${products.map((p) => `• ${p.name}: ${p.line}`).join("\n")}` },
];

export function localAnswer(question: string): string {
  const q = question.toLowerCase();

  if (/^\s*(hi|hello|hey|namaste|hii+)\b/.test(q) && q.length < 20) {
    return "Hello! I can tell you about our websites, mobile apps, our six ERP products (School, Healthcare, Coaching, Garage, Distribution, Restaurant) and WhatsApp/Gmail automation. What are you looking for?";
  }

  const parts: string[] = [];
  const price = topics[0];
  if (price.test.test(q)) parts.push(price.answer());
  for (const [slug, re] of Object.entries(productKeys)) {
    if (parts.length && price.test.test(q) && slug === "school-erp" && !/school/.test(q)) continue;
    if (re.test(q) && parts.length < 2) parts.push(productAnswer(slug));
  }
  for (const t of topics.slice(1)) {
    if (parts.length >= 2) break;
    if (t.test.test(q)) parts.push(t.answer());
  }

  if (!parts.length) {
    return `RS Digitech builds websites and mobile apps, and runs six ready-made ERP products on subscription:\n${products
      .map((p) => `• ${p.name} for ${p.for.toLowerCase()}`)
      .join("\n")}\n\nAsk me about any of these. ${BOOK}`;
  }
  return `${parts.join("\n\n")}\n\n${BOOK}`;
}
