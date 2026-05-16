import { requireRole } from "@/lib/session";
import { RoleHeader } from "@/components/role-header";
import { getPendingProfiles } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { ProfileCard } from "@/components/profile-card";

export const dynamic = "force-dynamic";

export default async function ReviewQueuePage() {
  const session = await requireRole("hr");
  const pending = await getPendingProfiles();

  return (
    <div data-theme="light" className="theme-shell">
      <RoleHeader session={session} eyebrow="HR · Review queue" />

      <main className="directory-v2 relative z-[1] mx-auto max-w-[1240px] px-s-8 pb-s-16 pt-s-12">
        <div className="eyebrow eyebrow-coral">Review queue</div>
        <h1 className="page-title">
          {pending.length} pending {pending.length === 1 ? "profile" : "profiles"}
        </h1>
        <p className="page-sub">
          Newly uploaded resumes land here. Approve, reject, or edit before they go live in the directory.
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
          <div className="grid mt-s-8">
            {pending.map((p, i) => (
              <ProfileCard
                key={p.id}
                profile={p}
                index={i}
                href={`/review/${p.id}`}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
