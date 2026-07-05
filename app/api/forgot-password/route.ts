import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { getUserByEmail, setPasswordResetToken } from "@/lib/store";
import { sendPasswordResetEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RESET_TTL_MS = 60 * 60 * 1000; // 1h
const GENERIC_MESSAGE = "If an account exists for that email, we've sent a reset link.";

export async function POST(req: Request) {
  let email: string;
  try {
    const body = (await req.json()) as { email?: unknown };
    email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }
  if (!email) {
    return NextResponse.json({ ok: false, error: "Email is required." }, { status: 400 });
  }

  const user = await getUserByEmail(email);
  if (!user) {
    // Same response either way — don't reveal whether the account exists.
    return NextResponse.json({ ok: true, message: GENERIC_MESSAGE });
  }

  const token     = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + RESET_TTL_MS).toISOString();
  await setPasswordResetToken(email, token, expiresAt);
  await sendPasswordResetEmail(email, user.name, token);

  return NextResponse.json({ ok: true, message: GENERIC_MESSAGE });
}
