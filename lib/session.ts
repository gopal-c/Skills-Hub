import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ROLE_COOKIE, ROLE_HOME, isValidRole, type Role } from "./auth";

/** Current role from the cookie, or null. */
export function getRole(): Role | null {
  const value = cookies().get(ROLE_COOKIE)?.value;
  return isValidRole(value) ? value : null;
}

/**
 * Enforce a role on the current request from a server component or route.
 * Pass `"any"` to require *some* role without caring which.
 */
export function requireRole(required: Role | "any"): Role {
  const current = getRole();
  if (!current) redirect("/");
  if (required !== "any" && current !== required) redirect(ROLE_HOME[current]);
  return current;
}
