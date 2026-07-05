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
