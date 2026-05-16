import { requireRole } from "@/lib/session";
import { RoleHeader } from "@/components/role-header";
import { UploadForm } from "./upload-form";

export default async function UploadPage() {
  const session = await requireRole("employee");

  return (
    <div data-theme="dark" className="theme-shell">
      <div className="theme-glow g1" aria-hidden />
      <div className="theme-glow g2" aria-hidden />
      <div className="theme-glow g3" aria-hidden />

      <RoleHeader session={session} eyebrow="Employee · Upload" />

      <main className="upload-v2 relative z-[1] mx-auto max-w-[820px] px-s-8 pb-s-20 pt-s-16">
        <div className="steps">
          <span className="step active"><span className="dot" />Step 1 · Upload</span>
          <span className="step-line" />
          <span className="step"><span className="dot" />Step 2 · Extract</span>
          <span className="step-line" />
          <span className="step"><span className="dot" />Step 3 · Review</span>
        </div>

        <h1 className="page-title">
          Drop a resume. <em>We&rsquo;ll handle the rest.</em>
        </h1>
        <p className="page-sub">
          We&rsquo;ll extract your skills, projects, and proficiency. A reviewer takes a
          quick look before your profile goes live.
        </p>

        <UploadForm />

        <div className="next-trail">
          <b>What happens next</b>
          <span className="arrow">→</span>
          <span className="pill">AI extracts skills, projects, proficiency</span>
          <span className="arrow">→</span>
          <span className="pill">HR reviews your profile</span>
          <span className="arrow">→</span>
          <span className="pill">You&rsquo;re searchable</span>
        </div>
      </main>
    </div>
  );
}
