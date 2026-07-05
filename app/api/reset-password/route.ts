import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getUserByPasswordResetToken, resetUserPassword } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let token: string, password: string, confirmPassword: string;
  try {
    const body = (await req.json()) as Record<string, unknown>;
    token           = typeof body.token === "string" ? body.token : "";
    password        = typeof body.password === "string" ? body.password : "";
    confirmPassword = typeof body.confirmPassword === "string" ? body.confirmPassword : "";
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }

  if (!token) {
    return NextResponse.json({ ok: false, error: "Missing reset token." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ ok: false, error: "Password must be at least 8 characters." }, { status: 400 });
  }
  if (password !== confirmPassword) {
    return NextResponse.json({ ok: false, error: "Passwords don't match." }, { status: 400 });
  }

  const user = await getUserByPasswordResetToken(token);
  if (!user) {
    return NextResponse.json({ ok: false, error: "That reset link is invalid or has expired." }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await resetUserPassword(user.id, passwordHash);

  return NextResponse.json({ ok: true });
}
