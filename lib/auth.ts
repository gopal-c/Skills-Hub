/**
 * Tiny demo auth — hardcoded users, HMAC-signed cookie session.
 * Uses Web Crypto only so it runs in Edge middleware *and* Node route handlers.
 * Not for production: password comparison is a plain ===.
 */

export type Role = "hr" | "employee";

export type Session = {
  email: string;
  role: Role;
  iat: number;
};

export type DemoUser = {
  email: string;
  password: string;
  role: Role;
};

export const DEMO_USERS: DemoUser[] = [
  { email: "hr@demo.com",       password: "demo", role: "hr" },
  { email: "employee@demo.com", password: "demo", role: "employee" },
];

export const SESSION_COOKIE = "skillshub_session";

/** Where each role lands after login. */
export const ROLE_HOME: Record<Role, string> = {
  hr:       "/search",
  employee: "/upload",
};

/* ─────────── crypto helpers (Web Crypto only) ─────────── */

const enc = new TextEncoder();

function b64urlEncode(bytes: Uint8Array | string): string {
  const s = typeof bytes === "string"
    ? btoa(unescape(encodeURIComponent(bytes)))
    : btoa(String.fromCharCode(...bytes));
  return s.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlDecode(s: string): string {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  return decodeURIComponent(escape(atob(s)));
}

async function hmacHex(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Constant-time string compare to avoid timing attacks on the HMAC check. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set");
  return secret;
}

/* ─────────── sign / verify ─────────── */

export async function signSession(payload: Session): Promise<string> {
  const data = b64urlEncode(JSON.stringify(payload));
  const sig  = await hmacHex(getSecret(), data);
  return `${data}.${sig}`;
}

export async function verifySession(token: string | undefined | null): Promise<Session | null> {
  if (!token) return null;
  const [data, sig] = token.split(".");
  if (!data || !sig) return null;
  const expected = await hmacHex(getSecret(), data);
  if (!safeEqual(sig, expected)) return null;
  try {
    const parsed = JSON.parse(b64urlDecode(data)) as Session;
    if (parsed.role !== "hr" && parsed.role !== "employee") return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Find a demo user by email + password. Returns null on mismatch. */
export function authenticate(email: string, password: string): DemoUser | null {
  const u = DEMO_USERS.find((u) => u.email === email);
  if (!u || u.password !== password) return null;
  return u;
}
