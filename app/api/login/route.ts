import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "@/lib/store";
import { signSession, SESSION_COOKIE } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GENERIC_FAIL = "Invalid email or password";

export async function POST(req: Request) {
  let email: string;
  let password: string;
  try {
    const body = (await req.json()) as { email?: unknown; password?: unknown };
    if (typeof body.email !== "string" || typeof body.password !== "string") {
      return NextResponse.json({ ok: false, error: "Email and password required." }, { status: 400 });
    }
    email    = body.email.trim().toLowerCase();
    password = body.password;
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }

  if (!email || !password) {
    return NextResponse.json({ ok: false, error: GENERIC_FAIL }, { status: 401 });
  }

  let user: Awaited<ReturnType<typeof getUserByEmail>>;
  try {
    user = await getUserByEmail(email);
  } catch (err) {
    const message = err instanceof Error ? err.message : "DB error";
    return NextResponse.json({ ok: false, error: `Couldn't reach the database: ${message}` }, { status: 500 });
  }

  if (!user) {
    return NextResponse.json({ ok: false, error: GENERIC_FAIL }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ ok: false, error: GENERIC_FAIL }, { status: 401 });
  }

  const token = await signSession({
    userId: user.id,
    email:  user.email,
    role:   user.role,
    name:   user.name,
  });

  const res = NextResponse.json({ ok: true, role: user.role });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure:   process.env.NODE_ENV === "production",
    path:     "/",
    maxAge:   60 * 60 * 24, // 24h
  });
  return res;
}
