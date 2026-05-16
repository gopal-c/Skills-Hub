import Link from "next/link";
import { requireRole } from "@/lib/session";
import { RoleHeader } from "@/components/role-header";
import { getPendingProfiles } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function ReviewQueuePage() {
  const session = await requireRole("hr");
  const pending = await getPendingProfiles();

  return (
    <main className="min-h-screen bg-bg-page">
      <RoleHeader session={session} eyebrow="HR · Review queue" />
      <section className="mx-auto max-w-5xl px-s-8 py-s-12">
        <span className="eyebrow eyebrow-coral">Review queue</span>
        <h1 className="mt-s-2">
          {pending.length} pending {pending.length === 1 ? "profile" : "profiles"}
        </h1>
        <p className="mt-s-3 max-w-xl text-[15px] text-fg-2">
          Newly uploaded resumes land here. Approve, reject, or edit before they
          go live in the directory.
        </p>

        {pending.length === 0 ? (
          <Card className="mt-s-8">
            <CardContent className="py-s-10 text-center">
              <p className="font-mono text-[11px] uppercase tracking-eyebrow text-fg-3">Empty</p>
              <h3 className="mt-s-2">Nothing pending. Drop by later.</h3>
              <p className="mt-s-2 text-[14px] text-fg-2">
                When someone uploads a resume, you&rsquo;ll see it here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <ul className="mt-s-8 grid gap-s-3 sm:grid-cols-2 lg:grid-cols-3">
            {pending.map((p) => (
              <li key={p.id}>
                <Link href={`/review/${p.id}`} className="block">
                  <Card className="transition-all duration-base ease-out hover:-translate-y-px hover:shadow-2">
                    <CardHeader>
                      <CardTitle className="text-[17px]">{p.name || "Unnamed candidate"}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-s-3">
                      <p className="text-[13px] text-fg-2">
                        {p.seniority} &middot; {p.city || "—"} &middot; {p.yearsExperience} yrs
                      </p>
                      <div className="flex flex-wrap gap-s-1">
                        {p.skills.slice(0, 4).map((s) => (
                          <Badge key={s.name} variant="secondary" className="font-mono text-[11px]">
                            {s.name}
                          </Badge>
                        ))}
                        {p.skills.length > 4 && (
                          <Badge variant="outline" className="font-mono text-[11px]">
                            +{p.skills.length - 4}
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
