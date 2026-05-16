import { requireRole } from "@/lib/session";
import { RoleHeader } from "@/components/role-header";
import { getApprovedProfiles } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function EmployeesDirectoryPage() {
  const role = requireRole("any");
  const profiles = await getApprovedProfiles();

  return (
    <main className="min-h-screen bg-bg-page">
      <RoleHeader role={role} eyebrow="Directory" />
      <section className="mx-auto max-w-5xl px-s-8 py-s-12">
        <span className="eyebrow">Phase 3 lands here</span>
        <h1 className="mt-s-2">Directory</h1>
        <p className="mt-s-3 max-w-xl text-[15px] text-fg-2">
          {profiles.length} approved profiles loaded from the seed file.
          A filterable list and per-profile detail view land in Phase 3.
        </p>

        <ul className="mt-s-8 grid gap-s-3 sm:grid-cols-2 md:grid-cols-3">
          {profiles.map((p) => (
            <li
              key={p.id}
              className="rounded-lg border border-border-hairline bg-bg-surface p-s-4 shadow-1"
            >
              <p className="text-[15px] font-medium text-fg-1">{p.name}</p>
              <p className="mt-s-1 text-[13px] text-fg-2">
                {p.seniority} &middot; {p.city}
              </p>
              <p className="mt-s-2 font-mono text-[11px] uppercase tracking-eyebrow text-fg-3">
                {p.skills.length} skills &middot; {p.projects.length} projects
              </p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
