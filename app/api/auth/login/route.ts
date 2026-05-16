import { NextResponse } from "next/server";
import { authenticate, signSession, SESSION_COOKIE, ROLE_HOME } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { email, password } = (await req.json()) as { email?: string; password?: string };
  if (!email || !password) {
    return NextResponse.json({ ok: false, error: "Email and password required." }, { status: 400 });
  }

  const user = authenticate(email.trim().toLowerCase(), password);
  if (!user) {
    return NextResponse.json({ ok: false, error: "Wrong email or password." }, { status: 401 });
  }

  const token = await signSession({
    email: user.email,
    role:  user.role,
    iat:   Date.now(),
  });

  const res = NextResponse.json({ ok: true, role: user.role, redirectTo: ROLE_HOME[user.role] });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure:   process.env.NODE_ENV === "production",
    path:     "/",
    maxAge:   60 * 60 * 24 * 7, // 7 days
  });
  return res;
}
