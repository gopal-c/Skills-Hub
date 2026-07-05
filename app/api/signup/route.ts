import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import {
  getProfileByEmail,
  createOrRefreshSelfSignupProfile,
  upsertSelfSignupUser,
} from "@/lib/store";
import { isAllowedWorkEmail, WORK_EMAIL_DOMAIN } from "@/lib/domain";
import { sendVerificationEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VERIFICATION_TTL_MS = 24 * 60 * 60 * 1000; // 24h
const GENERIC_MESSAGE = "If this email can sign up, check your inbox for a verification link.";

export async function POST(req: Request) {
  let name: string, email: string, password: string, confirmPassword: string;
  try {
    const body = (await req.json()) as Record<string, unknown>;
    name            = typeof body.name === "string" ? body.name.trim() : "";
    email           = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    password        = typeof body.password === "string" ? body.password : "";
    confirmPassword = typeof body.confirmPassword === "string" ? body.confirmPassword : "";
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }

  if (!name || !email || !password) {
    return NextResponse.json({ ok: false, error: "Name, work email, and password are required." }, { status: 400 });
  }
  if (!isAllowedWorkEmail(email)) {
    return NextResponse.json(
      { ok: false, error: `Sign-up is restricted to ${WORK_EMAIL_DOMAIN} email addresses.` },
      { status: 400 },
    );
  }
  if (password.length < 8) {
    return NextResponse.json({ ok: false, error: "Password must be at least 8 characters." }, { status: 400 });
  }
  if (password !== confirmPassword) {
    return NextResponse.json({ ok: false, error: "Passwords don't match." }, { status: 400 });
  }

  // Anti-enumeration: an already-verified, active account gets the same
  // generic response — we just skip the DB write and email send silently.
  const existing = await getProfileByEmail(email);
  if (existing?.workEmailVerified) {
    return NextResponse.json({ ok: true, message: GENERIC_MESSAGE, emailSent: false });
  }

  const token     = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + VERIFICATION_TTL_MS).toISOString();
  const passwordHash = await bcrypt.hash(password, 10);

  try {
    await createOrRefreshSelfSignupProfile(email, name, token, expiresAt);
    await upsertSelfSignupUser(email, name, passwordHash);
  } catch (err) {
    const message = err instanceof Error ? err.message : "DB error";
    return NextResponse.json({ ok: false, error: `Couldn't create your account: ${message}` }, { status: 500 });
  }

  const result = await sendVerificationEmail(email, name, token);
  return NextResponse.json({ ok: true, message: GENERIC_MESSAGE, emailSent: result.ok });
}
