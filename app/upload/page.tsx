import { requireRole } from "@/lib/session";
import { SignOutButton } from "@/components/sign-out-button";

export default async function UploadHomePage() {
  const session = await requireRole("employee");

  return (
    <main className="min-h-screen bg-bg-page">
      <header className="border-b border-border-hairline bg-bg-surface">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-s-8 py-s-4">
          <div className="flex items-center gap-s-3">
            <span className="eyebrow">Employee · Upload</span>
          </div>
          <div className="flex items-center gap-s-4 text-[13px] text-fg-2">
            <span className="font-mono">{session.email}</span>
            <SignOutButton />
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-s-8 py-s-16">
        <span className="eyebrow eyebrow-coral">Phase 2 lands here</span>
        <h1 className="mt-s-2">
          Drop a resume. <span className="serif-italic" style={{ color: "var(--brand-coral-deep)" }}>We&rsquo;ll handle the rest.</span>
        </h1>
        <p className="mt-s-4 max-w-xl text-[15px] text-fg-2">
          Resume upload + AI extraction will live here. For now you&rsquo;re
          logged in as an employee.
        </p>
      </section>
    </main>
  );
}
