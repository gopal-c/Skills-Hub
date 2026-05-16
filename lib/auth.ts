/** Role-switcher state. No password, no user table — a plain cookie. */

export type Role = "hr" | "employee";

export const ROLES: Role[] = ["hr", "employee"];

export const ROLE_COOKIE = "skillshub_role";

export const ROLE_HOME: Record<Role, string> = {
  hr:       "/search",
  employee: "/upload",
};

export function isValidRole(value: unknown): value is Role {
  return value === "hr" || value === "employee";
}
