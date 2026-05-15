import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json(
      { ok: false, error: "GROQ_API_KEY is not set" },
      { status: 503 }
    );
  }

  const groq = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
  });

  const started = Date.now();
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: "You are a terse engineer. Reply in one sentence." },
      { role: "user", content: "Say hello so we can confirm Groq is wired up." },
    ],
    max_tokens: 64,
  });

  return NextResponse.json({
    ok: true,
    model: completion.model,
    latencyMs: Date.now() - started,
    reply: completion.choices[0]?.message?.content ?? "",
    usage: completion.usage,
  });
}
