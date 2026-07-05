import { redirect } from "next/navigation";
import { requireRole } from "@/lib/session";
import { RoleHeader } from "@/components/role-header";
import { getProfileByEmail } from "@/lib/store";
import { UploadForm } from "./upload-form";

export const dynamic = "force-dynamic";

export default async function UploadPage() {
  const session = await requireRole("employee");
  const profile = await getProfileByEmail(session.email);

  // Same gate as /me — unapproved employees (no profile yet, or not yet
  // approved) get routed through /home instead.
  if (!profile || profile.status !== "approved") {
    redirect("/home");
  }

  return (
    <div data-theme="dark" className="theme-shell">
      <div className="theme-glow g1" aria-hidden />
      <div className="theme-glow g2" aria-hidden />
      <div className="theme-glow g3" aria-hidden />

      <RoleHeader session={session} eyebrow="Employee · Update" employeeApproved />

      <main className="upload-v2 relative z-[1] mx-auto max-w-[820px] px-s-8 pb-s-20 pt-s-16">
        <div className="steps">
          <span className="step active"><span className="dot" />Step 1 · Upload</span>
          <span className="step-line" />
          <span className="step"><span className="dot" />Step 2 · Extract</span>
          <span className="step-line" />
          <span className="step"><span className="dot" />Step 3 · Review</span>
        </div>

        <h1 className="page-title">
          Update your profile <em>from resume.</em>
        </h1>
        <p className="page-sub">
          Re-upload your resume to refresh your skills, projects, and experience.
          HR will re-approve the changes.
        </p>

        <UploadForm />

        <div className="next-trail">
          <b>What happens next</b>
          <span className="arrow">→</span>
          <span className="pill">AI re-extracts your profile</span>
          <span className="arrow">→</span>
          <span className="pill">HR re-reviews the changes</span>
          <span className="arrow">→</span>
          <span className="pill">Your live profile updates</span>
        </div>
      </main>
    </div>
  );
}
