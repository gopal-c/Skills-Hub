import Link from "next/link";
import { redirect } from "next/navigation";
import { UserCircle2 } from "lucide-react";
import { requireRole } from "@/lib/session";
import { RoleHeader } from "@/components/role-header";
import { getProfileByEmail } from "@/lib/store";
import { MePanel } from "@/components/me-panel";
import { buttonVariants } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function MePage() {
  const session = await requireRole("employee");
  const profile = await getProfileByEmail(session.email);

  // Self-signup accounts stay off the dashboard until verified + HR-approved.
  if (profile?.workEmail && (!profile.workEmailVerified || profile.status !== "approved")) {
    redirect("/pending-approval");
  }

  return (
    <div data-theme="dark" className="theme-shell">
      <div className="theme-glow g1" aria-hidden />
      <div className="theme-glow g2" aria-hidden />
      <div className="theme-glow g3" aria-hidden />
      <RoleHeader session={session} eyebrow="My profile" />

      <section className="relative z-[1] mx-auto max-w-4xl px-s-8 py-s-10">
        {profile ? <MePanel profile={profile} /> : <EmptyProfileState />}
      </section>
    </div>
  );
}

function EmptyProfileState() {
  return (
    <div className="flex flex-col items-center px-s-4 py-s-16 text-center">
      <div
        className="mb-s-8 flex h-32 w-32 items-center justify-center rounded-pill"
        style={{
          background: "linear-gradient(135deg, var(--brand-indigo-soft), var(--brand-coral-soft))",
        }}
      >
        <UserCircle2 className="size-16 text-indigo-deep" strokeWidth={1.5} />
      </div>

      <span className="eyebrow eyebrow-coral">Empty</span>
      <h1 className="mt-s-2">Your profile is empty</h1>
      <p className="mt-s-3 max-w-md text-[15px] text-fg-2">
        Upload your resume to get started &mdash; we&rsquo;ll extract your skills automatically.
      </p>

      <Link
        href="/upload"
        className={buttonVariants({ variant: "default" }) + " mt-s-6 h-11 rounded-lg px-s-6 text-[14px]"}
      >
        Upload resume &rarr;
      </Link>
    </div>
  );
}
