import Link from "next/link";
import { requireRole } from "@/lib/session";
import { RoleHeader } from "@/components/role-header";
import { getProfileByEmail } from "@/lib/store";
import { UploadForm } from "./upload-form";

export const dynamic = "force-dynamic";

export default async function UploadPage() {
  const session = await requireRole("employee");
  const profile = await getProfileByEmail(session.email);

  return (
    <div data-theme="dark" className="theme-shell">
      <div className="theme-glow g1" aria-hidden />
      <div className="theme-glow g2" aria-hidden />
      <div className="theme-glow g3" aria-hidden />

      <RoleHeader session={session} eyebrow="Employee · Update" />

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

        {!profile ? (
          <section className="form-card mt-s-8">
            <h2>Profile not created yet</h2>
            <p className="lede">
              Your profile hasn&rsquo;t been created yet. Wait for HR to onboard you,
              then come back here to refresh it any time.
            </p>
            <div className="form-actions">
              <Link href="/me" className="btn-primary">
                Back to my profile
              </Link>
            </div>
          </section>
        ) : (
          <UploadForm />
        )}

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
