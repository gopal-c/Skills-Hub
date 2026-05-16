import Link from "next/link";
import { UserCircle2, Eye } from "lucide-react";
import { requireRole } from "@/lib/session";
import { RoleHeader } from "@/components/role-header";
import { getProfileByEmail } from "@/lib/store";
import { ProfileView } from "@/components/profile-view";
import { buttonVariants } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function MePage() {
  const session = await requireRole("employee");
  const profile = await getProfileByEmail(session.email);

  return (
    <main className="min-h-screen bg-bg-page">
      <RoleHeader session={session} eyebrow="My profile" />

      <section className="mx-auto max-w-4xl px-s-8 py-s-10">
        {profile ? (
          <>
            <div className="mb-s-6 flex items-center gap-s-3 rounded-md border border-border-hairline bg-indigo-soft px-s-4 py-s-3 text-[13px] text-indigo-press">
              <Eye className="size-4 flex-shrink-0" />
              <span>This is how others see your profile.</span>
            </div>
            <ProfileView profile={profile} canManage={false} editableAvatar />
          </>
        ) : (
          <EmptyProfileState />
        )}
      </section>
    </main>
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
