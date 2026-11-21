import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT } from "@/lib/knowledge";
import { localAnswer } from "@/lib/answers";


const MODEL = process.env.CHAT_MODEL ?? "claude-opus-5-5";

/* Small in-memory rate limit: 20 messages per IP per 10 minutes. */
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 20;
}

type Incoming = { role: "user" | "assistant"; content: string };

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (limited(ip)) {
    return Response.json({ error: "You're sending messages quickly. Please wait a few minutes." }, { status: 429 });
  }

  let messages: Anthropic.MessageParam[];
  try {
    const body = (await req.json()) as { messages?: Incoming[] };
    messages = (body.messages ?? [])
      .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
      .slice(-12)
      .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));
    while (messages.length && messages[0].role !== "user") messages.shift();
    if (!messages.length || messages[messages.length - 1].role !== "user") throw new Error();
  } catch {
    return Response.json({ error: "Bad request." }, { status: 400 });
  }

  const encoder = new TextEncoder();
  const question = String(messages[messages.length - 1].content);
  const headers = { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" };

  // No API key: answer from the site's own data with the built-in engine.
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(typeStream(localAnswer(question)), { headers });
  }

  const client = new Anthropic();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const s = client.beta.messages.stream({
          model: MODEL,
          max_tokens: 2048,
          betas: ["server-side-fallback-2026-07-01"],
          fallbacks: "default",
          output_config: { effort: "low" },
          system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
          messages,
        });
        let wrote = false;
        s.on("text", (t) => {
          wrote = true;
          controller.enqueue(encoder.encode(t));
        });
        const final = await s.finalMessage();
        if (final.stop_reason === "refusal" && !wrote) {
          controller.enqueue(encoder.encode("I can't help with that one. For anything about our services, please book a call."));
        }
        if (!wrote && final.stop_reason !== "refusal") controller.enqueue(encoder.encode(localAnswer(question)));
      } catch (err) {
        console.error("chat error", err);
        // Claude unreachable: still give a real answer from the site's data.
        controller.enqueue(encoder.encode(localAnswer(question)));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, { headers });
}

/** Streams a ready answer in small chunks so it types out like the live model. */
function typeStream(text: string) {
  const encoder = new TextEncoder();
  const chunks = text.match(/\S+\s*/g) ?? [text];
  return new ReadableStream<Uint8Array>({
    async start(controller) {
      for (const c of chunks) {
        controller.enqueue(encoder.encode(c));
        await new Promise((r) => setTimeout(r, 12));
      }
      controller.close();
    },
  });
}
