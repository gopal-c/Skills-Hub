import Link from "next/link";
import { requireRole } from "@/lib/session";
import { RoleHeader } from "@/components/role-header";
import { getApprovedProfiles } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function EmployeesDirectoryPage() {
  const role = requireRole("any");
  const profiles = await getApprovedProfiles();

  return (
    <main className="min-h-screen bg-bg-page">
      <RoleHeader role={role} eyebrow="Directory" />
      <section className="mx-auto max-w-6xl px-s-8 py-s-12">
        <span className="eyebrow">Directory</span>
        <h1 className="mt-s-2">
          {profiles.length} {profiles.length === 1 ? "person" : "people"}
        </h1>
        <p className="mt-s-3 max-w-xl text-[15px] text-fg-2">
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
          <ul className="mt-s-8 grid gap-s-4 sm:grid-cols-2 lg:grid-cols-3">
            {profiles.map((p) => (
              <li key={p.id}>
                <Link href={`/employees/${p.id}`} className="block">
                  <Card className="h-full transition-all duration-base ease-out hover:-translate-y-px hover:shadow-2">
                    <CardHeader>
                      <CardTitle className="text-[17px]">{p.name}</CardTitle>
                      <p className="text-[13px] text-fg-2">
                        {p.seniority} &middot; {p.city} &middot; {p.yearsExperience} yrs
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-s-1">
                        {p.skills.slice(0, 5).map((s) => (
                          <Badge key={s.name} variant="secondary" className="font-mono text-[11px]">
                            {s.name}
                          </Badge>
                        ))}
                        {p.skills.length > 5 && (
                          <Badge variant="outline" className="font-mono text-[11px]">
                            +{p.skills.length - 5}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
