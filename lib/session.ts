import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, ROLE_HOME, verifySession, type Role, type SessionPayload } from "./auth";

/** Read + verify the JWT session cookie from a server component or route handler. */
export async function getSession(): Promise<SessionPayload | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  return verifySession(token);
}

/** Require any authenticated session — redirects to / if absent or invalid. */
export async function requireSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) redirect("/");
  return session;
}

/**
 * Require a specific role (or "any" authenticated user).
 * Returns the full session payload — consumers can pull role/name/userId off it.
 * Mismatched role redirects to the user's own home.
 */
export async function requireRole(role: Role | "any"): Promise<SessionPayload> {
  const session = await requireSession();
  if (role !== "any" && session.role !== role) redirect(ROLE_HOME[session.role]);
  return session;
}
