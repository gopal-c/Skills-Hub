/**
 * Edge-safe profile-status lookup, used only by middleware.
 *
 * Deliberately NOT importing lib/store.ts here — that module pulls in
 * node:fs/node:path (seed-file reads) which the Edge Runtime can't bundle.
 * @vercel/postgres itself is fetch-based and edge-compatible, so a narrow,
 * single-purpose query file is safe to import from middleware.
 */
import { sql } from "@vercel/postgres";

/**
 * Returns whether the most recent profile for this email is approved.
 * Fails "open" (treats a DB error as approved) on purpose — a transient DB
 * hiccup in middleware shouldn't lock every employee out of the app; the
 * page-level guards (RSC redirects) are the actual security boundary.
 */
export async function isEmployeeApproved(email: string): Promise<boolean> {
  try {
    const { rows } = await sql<{ status: string }>`
      SELECT status FROM profiles
      WHERE lower(email) = ${email.toLowerCase()}
      ORDER BY created_at DESC
      LIMIT 1
    `;
    if (!rows[0]) return false; // no profile yet — definitely not approved
    return rows[0].status === "approved";
  } catch {
    return true;
  }
}
