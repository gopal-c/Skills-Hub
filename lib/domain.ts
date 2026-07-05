/**
 * Client-safe constant — kept separate from lib/store.ts so client
 * components (signup form, etc.) don't accidentally pull in the
 * @vercel/postgres server-only module.
 */
export const WORK_EMAIL_DOMAIN = "@valueaddsofttech.com";

export function isAllowedWorkEmail(email: string): boolean {
  return email.trim().toLowerCase().endsWith(WORK_EMAIL_DOMAIN);
}

/**
 * Heuristic for "has this profile ever had a resume extracted into it?" —
 * there's no separate resume/file record, so we treat any populated
 * skills/projects as evidence extraction has run at least once. Lives here
 * (not lib/store.ts) so client components can import it without pulling in
 * the server-only @vercel/postgres module.
 */
export function hasResumeData(profile: { skills: unknown[]; projects: unknown[] }): boolean {
  return profile.skills.length > 0 || profile.projects.length > 0;
}

/** Latest allowed date of birth — must be at least 16 years before today. */
export function maxDateOfBirth(): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 16);
  return d.toISOString().slice(0, 10);
}

export function isValidDateOfBirth(dob: string): boolean {
  if (!dob) return true; // optional field
  return dob <= maxDateOfBirth();
}

/** "2023-01-15" → "15 Jan 2023". Never renders a raw ISO string to users. */
export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr.length <= 10 ? `${dateStr}T00:00:00` : dateStr);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
