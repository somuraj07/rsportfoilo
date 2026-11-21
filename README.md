# RS Digitech website

Next.js 16 (App Router) · Tailwind CSS v4 · Framer Motion · Claude API · Nodemailer

## Run

```bash
cp .env.example .env.local   # fill in the values
npm install
npm run dev                  # http://localhost:3000
```

## Where things live

- `src/lib/data.ts` — every service, product, module list and client project. **The site and the AI assistant both read from this file**, so edit content here. Lines marked `REVIEW` need your confirmation.
- `src/lib/site.ts` — public contact details (from env vars; empty values are hidden).
- `src/app/api/chat/route.ts` — AI assistant (Claude, streamed, answers only from `data.ts`).
- `src/app/api/book/route.ts` — Book a call: Gmail confirmation to the client + alert to your team, optional WhatsApp Cloud API alert.

## Setup checklist

1. **AI assistant**: set `ANTHROPIC_API_KEY`. Model defaults to `claude-opus-5-5`; set `CHAT_MODEL=claude-haiku-5-5` for a much cheaper bot.
2. **Gmail automation**: turn on 2-step verification on the Google account, create an App Password, set `GMAIL_USER` and `GMAIL_APP_PASSWORD`.
3. **WhatsApp**: set `NEXT_PUBLIC_WHATSAPP_NUMBER` for the click-to-chat buttons. For automatic team alerts, add WhatsApp Cloud API credentials and an approved template (`WHATSAPP_TEMPLATE`).
