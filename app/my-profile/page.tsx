import Link from "next/link";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/session";
import { RoleHeader } from "@/components/role-header";
import { getProfileByEmail } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function MyProfilePage() {
  const session = await requireRole("employee");
  const profile = await getProfileByEmail(session.email);

  if (profile) {
    redirect(`/employees/${profile.id}`);
  }

  return (
    <main className="min-h-screen bg-bg-page">
      <RoleHeader session={session} eyebrow="Employee · My profile" />
      <section className="mx-auto max-w-2xl px-s-8 py-s-16">
        <span className="eyebrow eyebrow-coral">No profile yet</span>
        <h1 className="mt-s-2">
          Welcome, <span className="serif-italic" style={{ color: "var(--brand-coral-deep)" }}>{session.name}.</span>
        </h1>
        <p className="mt-s-4 max-w-xl text-[15px] text-fg-2">
          You don&rsquo;t have a profile on SkillsHub yet. Upload your resume and
          we&rsquo;ll extract your skills, projects, and proficiency. A reviewer
          takes a quick look before it goes live.
        </p>

        <Card className="mt-s-8">
          <CardContent className="flex flex-col items-start gap-s-4 py-s-8">
            <p className="font-mono text-[11px] uppercase tracking-eyebrow text-fg-3">Next step</p>
            <h3>Upload your resume</h3>
            <p className="text-[14px] text-fg-2">
              PDF only. Takes about 10 seconds.
            </p>
            <Link
              href="/upload"
              className={buttonVariants({ variant: "default" }) + " mt-s-2 h-11 rounded-lg px-s-5"}
            >
              Upload now &rarr;
            </Link>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
