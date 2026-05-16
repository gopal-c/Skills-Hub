import { requireRole } from "@/lib/session";
import { RoleHeader } from "@/components/role-header";
import { getApprovedProfiles } from "@/lib/store";
import { SearchPanel } from "@/components/search-panel";

export const dynamic = "force-dynamic";

export default async function SearchPage() {
  const role = requireRole("hr");
  const profiles = await getApprovedProfiles();

  return (
    <main className="min-h-screen bg-bg-page">
      <RoleHeader role={role} eyebrow="HR · Search" />
      <section className="mx-auto max-w-3xl px-s-8 py-s-12">
        <span className="eyebrow eyebrow-indigo">Search</span>
        <h1 className="mt-s-2">
          Find the right person, <span className="serif-italic" style={{ color: "var(--brand-indigo-deep)" }}>in plain English.</span>
        </h1>
        <p className="mt-s-3 max-w-xl text-[15px] text-fg-2">
          Ask a question the way you&rsquo;d ask a teammate. We&rsquo;ll rank candidates
          and tell you why each one matched.
        </p>

        <div className="mt-s-8">
          <SearchPanel approvedCount={profiles.length} />
        </div>
      </section>
    </main>
  );
}
