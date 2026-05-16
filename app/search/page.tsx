import { requireRole } from "@/lib/session";
import { SignOutButton } from "@/components/sign-out-button";

export default async function SearchHomePage() {
  const session = await requireRole("hr");

  return (
    <main className="min-h-screen bg-bg-page">
      <header className="border-b border-border-hairline bg-bg-surface">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-s-8 py-s-4">
          <div className="flex items-center gap-s-3">
            <span className="eyebrow">HR · Search</span>
          </div>
          <div className="flex items-center gap-s-4 text-[13px] text-fg-2">
            <span className="font-mono">{session.email}</span>
            <SignOutButton />
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-s-8 py-s-16">
        <span className="eyebrow eyebrow-indigo">Phase 4 lands here</span>
        <h1 className="mt-s-2">
          Find the right person, <span className="serif-italic" style={{ color: "var(--brand-indigo-deep)" }}>in plain English.</span>
        </h1>
        <p className="mt-s-4 max-w-xl text-[15px] text-fg-2">
          Search will live here. For now you&rsquo;re logged in as HR.
          Review queue and directory are next on the build list.
        </p>
      </section>
    </main>
  );
}
