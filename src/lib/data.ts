/**
 * Single source of truth for the site AND the AI assistant.
 * The chatbot answers only from what is written here, so keep it accurate.
 * Review every line marked REVIEW before going live.
 */

export type Service = {
  id: string;
  title: string;
  short: string;
  body: string;
  items: string[];
};

export const services: Service[] = [
  {
    id: "web",
    title: "Website development",
    short: "Websites",
    body: "From a one-page static site to a full-stack platform with accounts, payments and an admin panel. If it runs in a browser, we build it.",
    items: [
      "Static and marketing websites",
      "Full-stack web applications",
      "E-commerce stores",
      "Custom SaaS tools",
      "Admin panels and dashboards",
      "Redesigns of existing sites",
    ],
  },
  {
    id: "app",
    title: "App development",
    short: "Apps",
    body: "Mobile apps of any type, built around how your users actually work, and shipped to their phones.",
    items: [
      "Android and iOS apps",
      "Customer-facing apps",
      "Internal apps for staff",
      "Booking and marketplace apps",
      "Apps connected to your ERP",
      "Updates and maintenance",
    ],
  },
  {
    id: "saas",
    title: "SaaS products",
    short: "ERP products",
    body: "Ready-made ERP software for schools, hospitals, coaching centres, garages, distributors and restaurants. Each business gets its own space on our multi-tenant platform for a monthly subscription.",
    items: [
      "School ERP",
      "Healthcare ERP",
      "Coaching ERP",
      "Garage ERP",
      "Distribution ERP",
      "Restaurant ERP",
    ],
  },
];

export type ModuleGroup = { name: string; modules: string[] };

export type Product = {
  slug: string;
  name: string;
  for: string;
  line: string;
  problem: string;
  groups: ModuleGroup[];
  /** short code shown on the product tile */
  code: string;
};

export const products: Product[] = [
  {
    slug: "school-erp",
    code: "SC",
    name: "School ERP",
    for: "Schools",
    line: "Everything a school runs, and everything a student needs, in one place.",
    problem:
      "Admissions on paper, attendance in registers, fee receipts in a drawer and circulars lost in WhatsApp groups. The School ERP puts the whole school on one system that staff, parents and students can open.",
    groups: [
      {
        name: "Academics",
        modules: ["Academics", "Timetable", "Assignments", "Homework", "Workshops"],
      },
      {
        name: "Students and parents",
        modules: ["Admissions", "Attendance", "Newsfeed", "Circulars"],
      },
      {
        name: "Fees",
        modules: ["Fee records", "Online payments", "Offline payments"],
      },
      {
        name: "Campus",
        modules: ["Transport system", "Library management", "Teacher audit"],
      },
    ],
  },
  {
    slug: "healthcare-erp",
    code: "HC",
    name: "Healthcare ERP",
    for: "Hospitals and clinics",
    line: "From token to surgery to discharge, every step on screen instead of in a notebook.",
    problem:
      "Many hospitals still run on notebooks and manual registers. The Healthcare ERP takes a patient from the first token through consultation, X-ray, surgery and discharge in one digital record.",
    groups: [
      // REVIEW: module names condensed from the brief ("token to surgery to discharge, X-ray and everything").
      { name: "Front desk", modules: ["Tokens and queue", "Patient records"] },
      { name: "Care", modules: ["Consultations", "X-ray and imaging", "Surgery"] },
      { name: "Leaving", modules: ["Discharge"] },
    ],
  },
  {
    slug: "coaching-erp",
    code: "CO",
    name: "Coaching ERP",
    for: "Coaching centres",
    line: "Run your coaching centre on a platform that carries your own brand.",
    problem:
      "Starting or growing a coaching centre means juggling students, batches and fees. The Coaching ERP gives you the full system, rebranded to your name and adjusted to your requirements.",
    groups: [
      // REVIEW: the brief says "everything regarding coaching". Confirm the module list.
      { name: "Your brand", modules: ["Your logo, colours and name", "Changes to fit your requirements"] },
      { name: "Centre", modules: ["Students", "Batches", "Attendance", "Fees"] },
    ],
  },
  {
    slug: "garage-erp",
    code: "GA",
    name: "Garage ERP",
    for: "Garages and service centres",
    line: "Job cards, customers and the money side of a garage, kept straight.",
    problem:
      "A busy garage loses track of vehicles, parts and payments fast. The Garage ERP keeps the workshop and its financials in one place.",
    groups: [
      // REVIEW: the brief names "financials and everything". Confirm the module list.
      { name: "Workshop", modules: ["Vehicles and customers", "Service jobs"] },
      { name: "Money", modules: ["Financials", "Billing"] },
    ],
  },
  {
    slug: "distribution-erp",
    code: "DI",
    name: "Distribution ERP",
    for: "Distributors and wholesalers",
    line: "Stock, orders and accounts for distribution businesses.",
    problem:
      "Distribution runs on thin margins and a lot of moving stock. The Distribution ERP keeps orders, inventory and financials in one system.",
    groups: [
      // REVIEW: the brief names "the financials and everything". Confirm the module list.
      { name: "Operations", modules: ["Orders", "Inventory"] },
      { name: "Money", modules: ["Financials", "Billing"] },
    ],
  },
  {
    slug: "restaurant-erp",
    code: "RE",
    name: "Restaurant ERP",
    for: "Restaurants and cafes",
    line: "From taking the order to collecting the feedback.",
    problem:
      "Orders shouted across the kitchen, bills added up by hand and a menu that never says what is special today. The Restaurant ERP handles the whole service.",
    groups: [
      { name: "Service", modules: ["Order taking", "Billing"] },
      { name: "Menu", modules: ["Today's menu", "Today's specials"] },
      { name: "Guests", modules: ["Customer feedback"] },
    ],
  },
];

/** What happens automatically when someone books a call on this website. */
export const bookingFlow = [
  { title: "You pick a time", body: "Choose a day and a slot in the Book a call form." },
  { title: "Gmail confirmation", body: "A confirmation email with your booking details is sent to your inbox straight away." },
  { title: "WhatsApp message", body: "Our team is alerted on WhatsApp, and you can continue the conversation with us there." },
];

export type Work = {
  name: string;
  kind: string;
  line: string;
  points: string[];
};

export const work: Work[] = [
  {
    name: "Saathyaki",
    kind: "Mobile app",
    line: "One-on-one consoling and problem solving with real mentors, paid by the minute.",
    points: [
      "Video call or chat with a mentor",
      "Career, studies, money, startup and personal problems",
      "Per-minute billing, no subscription",
      "Private sessions",
    ],
  },
  {
    name: "Young CEO",
    kind: "Mobile app",
    line: "A finance app: financial coaching and mentoring, mutual fund calculators and analytics, all in one place.",
    points: [
      "Financial coaching and mentoring",
      "Mutual fund calculators",
      "Finance analytics",
      "Everything about personal finance in one app",
    ],
  },
  {
    // REVIEW: add the store's real name here (and its live link if you want one shown).
    name: "Saree e‑commerce store",
    kind: "E-commerce website",
    line: "A complete online store for sarees, with a CMS dashboard to run it, bookings and online payments.",
    points: [
      "Saree catalogue and online store",
      "CMS dashboard to manage products and content",
      "Bookings",
      "Online payments",
    ],
  },
];

// REVIEW: confirm these steps match how you actually run projects.
export const process = [
  { n: "01", title: "Call", body: "A free call to understand what you need and whether a ready product or a custom build fits." },
  { n: "02", title: "Plan", body: "A written scope with screens, features and timeline, agreed before any code." },
  { n: "03", title: "Build", body: "We build in short rounds and show you working software along the way." },
  { n: "04", title: "Launch and support", body: "We put it live, train your team and stay on for fixes and new features." },
];

export const tenancySteps = [
  { title: "Pick a product", body: "Choose the ERP built for your type of business." },
  { title: "Get your own space", body: "We open a separate tenant for you, with your name, logo and data kept apart from everyone else." },
  { title: "Pay monthly", body: "Use it on a subscription instead of paying for a custom build up front." },
];
