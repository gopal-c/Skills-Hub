/**
 * Client-safe constant — kept separate from lib/store.ts so client
 * components (signup form, etc.) don't accidentally pull in the
 * @vercel/postgres server-only module.
 */
export const WORK_EMAIL_DOMAIN = "@valueaddsofttech.com";

export function isAllowedWorkEmail(email: string): boolean {
  return email.trim().toLowerCase().endsWith(WORK_EMAIL_DOMAIN);
}
