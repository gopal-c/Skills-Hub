import { requireRole } from "@/lib/session";
import { RoleHeader } from "@/components/role-header";

export default function SearchHomePage() {
  const role = requireRole("hr");

  return (
    <main className="min-h-screen bg-bg-page">
      <RoleHeader role={role} eyebrow="HR · Search" />
      <section className="mx-auto max-w-3xl px-s-8 py-s-16">
        <span className="eyebrow eyebrow-indigo">Phase 4 lands here</span>
        <h1 className="mt-s-2">
          Find the right person, <span className="serif-italic" style={{ color: "var(--brand-indigo-deep)" }}>in plain English.</span>
        </h1>
        <p className="mt-s-4 max-w-xl text-[15px] text-fg-2">
          Search will live here. For now you&rsquo;re entered as HR.
          Review queue and directory are next on the build list.
        </p>
      </section>
    </main>
  );
}
