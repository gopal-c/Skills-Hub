import { requireRole } from "@/lib/session";
import { RoleHeader } from "@/components/role-header";
import { getApprovedProfiles } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { DirectoryGrid } from "@/components/directory-grid";

export const dynamic = "force-dynamic";

export default async function EmployeesDirectoryPage() {
  const session = await requireRole("any");
  const profiles = await getApprovedProfiles();

  return (
    <main className="min-h-screen bg-bg-page">
      <RoleHeader session={session} eyebrow="Directory" />
      <section className="mx-auto max-w-6xl px-s-8 py-s-12">
        <span className="eyebrow">Directory</span>
        <h1 className="mt-s-2">
          {profiles.length} {profiles.length === 1 ? "person" : "people"}
        </h1>
        <p className="mt-s-3 max-w-xl text-[15px] text-fg-2">
          Approved profiles, ready to be searched. Filter by name, skill, city,
          or seniority &mdash; or open one to see the full picture.
        </p>

        {profiles.length === 0 ? (
          <Card className="mt-s-8">
            <CardContent className="py-s-10 text-center">
              <p className="font-mono text-[11px] uppercase tracking-eyebrow text-fg-3">Empty</p>
              <h3 className="mt-s-2">Nobody live yet.</h3>
              <p className="mt-s-2 text-[14px] text-fg-2">
                Approve a profile in the review queue or hit
                <code className="mx-s-1 font-mono">/api/init</code>
                if the database is fresh.
              </p>
            </CardContent>
          </Card>
        ) : (
          <DirectoryGrid profiles={profiles} />
        )}
      </section>
    </main>
  );
}
