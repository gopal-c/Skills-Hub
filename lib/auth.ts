/**
 * Edge-safe auth primitives: types, constants, JWT sign/verify.
 * Anything that touches next/headers `cookies()` lives in lib/session.ts
 * so middleware (edge runtime) can import this file safely.
 */

import { SignJWT, jwtVerify } from "jose";

export type Role = "hr" | "employee";

export const ROLES: Role[] = ["hr", "employee"];

/** Where each role lands after login. */
export const ROLE_HOME: Record<Role, string> = {
  hr:       "/search",
  employee: "/home",
};

export function isValidRole(value: unknown): value is Role {
  return value === "hr" || value === "employee";
}

/* ─────────── JWT session ─────────── */

export const SESSION_COOKIE = "session";

export type SessionPayload = {
  userId: string;
  email: string;
  role: Role;
  name: string;
};

function getSecret(): Uint8Array {
  const s = process.env.JWT_SECRET;
  if (!s || s.length < 32) {
    throw new Error("JWT_SECRET must be set to a 32+ character string");
  }
  return new TextEncoder().encode(s);
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return await new SignJWT({ role: payload.role, name: payload.name, email: payload.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.userId)
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(getSecret());
}

export async function verifySession(token: string | undefined | null): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret(), { algorithms: ["HS256"] });
    const sub   = payload.sub;
    const role  = payload.role;
    const name  = payload.name;
    const email = payload.email;
    if (typeof sub   !== "string") return null;
    if (role !== "hr" && role !== "employee") return null;
    if (typeof name  !== "string") return null;
    if (typeof email !== "string") return null;
    return { userId: sub, email, role, name };
  } catch {
    return null;
  }
}

/**
 * Pre-approval upload token — issued once on the /verify-email success
 * screen so a verified-but-not-yet-approved employee can upload a resume
 * without a full login session.
 *
 * This is intentionally NOT a session: it carries no `role` claim, so
 * verifySession() above will reject it outright, and requireRole()/
 * requireSession() never accept it. It grants exactly one capability
 * (write a resume extraction to one specific profile via the
 * /api/verify-upload route) and nothing else — no access to /me, /upload,
 * or any authenticated page. 7-day expiry, matching the review-queue
 * window a new signup might sit in before HR gets to it.
 */
export type PreApprovalUploadPayload = { profileId: string };

export async function signPreApprovalUploadToken(profileId: string): Promise<string> {
  return await new SignJWT({ scope: "pre-approval-upload" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(profileId)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifyPreApprovalUploadToken(token: string | undefined | null): Promise<string | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret(), { algorithms: ["HS256"] });
    if (payload.scope !== "pre-approval-upload") return null;
    if (typeof payload.sub !== "string") return null;
    return payload.sub; // profileId
  } catch {
    return null;
  }
}
