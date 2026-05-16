import { requireRole } from "@/lib/session";
import { RoleHeader } from "@/components/role-header";
import { getApprovedProfiles } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { DirectoryGrid } from "@/components/directory-grid";

export const dynamic = "force-dynamic";

export default async function EmployeesDirectoryPage() {
  const session = await requireRole("any");
  const profiles = await getApprovedProfiles();
  const theme    = session.role === "hr" ? "light" : "dark";

  return (
    <div data-theme={theme} className="theme-shell">
      {theme === "dark" && (
        <>
          <div className="theme-glow g1" aria-hidden />
          <div className="theme-glow g2" aria-hidden />
          <div className="theme-glow g3" aria-hidden />
        </>
      )}
      <RoleHeader session={session} eyebrow="Directory" />

      <main className="directory-v2 relative z-[1] mx-auto max-w-[1240px] px-s-8 pb-s-16 pt-s-12">
        <div className="eyebrow">Directory</div>
        <h1 className="page-title">
          {profiles.length} {profiles.length === 1 ? "person" : "people"}
        </h1>
        <p className="page-sub">
          Approved profiles, ready to be searched. Click any card to see the full picture.
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
      </main>
    </div>
  );
}
