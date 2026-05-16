import { requireRole } from "@/lib/session";
import { RoleHeader } from "@/components/role-header";
import { getApprovedProfiles } from "@/lib/store";
import { SearchPanel } from "@/components/search-panel";

export const dynamic = "force-dynamic";

export default async function SearchPage() {
  const session = await requireRole("hr");
  const profiles = await getApprovedProfiles();

  return (
    <div data-theme="light" className="theme-shell">
      <RoleHeader session={session} eyebrow="HR · Search" />
      <main className="search-v2 relative z-[1] mx-auto max-w-[820px] px-s-8 pb-s-20 pt-s-16">
        <div className="eyebrow eyebrow-indigo">Search</div>
        <h1 className="page-title">
          Find the right person, <em>in plain English.</em>
        </h1>
        <p className="page-sub">
          Ask a question the way you&rsquo;d ask a teammate. We&rsquo;ll rank candidates and
          tell you why each one matched.
        </p>

        <SearchPanel approvedCount={profiles.length} />
      </main>
    </div>
  );
}
