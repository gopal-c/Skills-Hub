import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verifySession, type Session, type Role } from "./auth";

/** Read + verify the session in a server component or route handler. Returns null if unauth. */
export async function getSession(): Promise<Session | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  return verifySession(token);
}

/** Throws (redirects to /login) if no session, or session role doesn't match. */
export async function requireRole(role: Role): Promise<Session> {
  const s = await getSession();
  if (!s) redirect("/login");
  if (s.role !== role) redirect("/login");
  return s;
}
