import { redirect } from "next/navigation";

/**
 * Superseded by /home, which now handles every approval state for every
 * employee (self-signup or HR-onboarded). Kept as a redirect so any old
 * bookmarks/emails pointing here still land somewhere useful.
 */
export default function PendingApprovalPage() {
  redirect("/home");
}
