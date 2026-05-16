import { requireRole } from "@/lib/session";
import { RoleHeader } from "@/components/role-header";
import { OnboardForm } from "./onboard-form";

export const dynamic = "force-dynamic";

export default async function OnboardPage() {
  const session = await requireRole("hr");

  return (
    <div data-theme="light" className="theme-shell">
      <RoleHeader session={session} eyebrow="HR · Onboard" />

      <main className="upload-v2 relative z-[1] mx-auto max-w-[820px] px-s-8 pb-s-20 pt-s-16">
        <div className="steps">
          <span className="step active"><span className="dot" />Step 1 · Upload</span>
          <span className="step-line" />
          <span className="step"><span className="dot" />Step 2 · Extract</span>
          <span className="step-line" />
          <span className="step"><span className="dot" />Step 3 · Review</span>
        </div>

        <h1 className="page-title">
          Onboard new employee.
        </h1>
        <p className="page-sub">
          Upload their resume. We&rsquo;ll extract skills, projects, and experience.
          You&rsquo;ll review before it goes live.
        </p>

        <OnboardForm />

        <div className="next-trail">
          <b>What happens next</b>
          <span className="arrow">→</span>
          <span className="pill">AI extracts the profile</span>
          <span className="arrow">→</span>
          <span className="pill">You review in the queue</span>
          <span className="arrow">→</span>
          <span className="pill">Approved &amp; searchable</span>
        </div>
      </main>
    </div>
  );
}
