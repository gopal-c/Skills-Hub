import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/session";
import { RoleHeader } from "@/components/role-header";
import { getProfile } from "@/lib/store";
import { ProfileView } from "@/components/profile-view";

export const dynamic = "force-dynamic";

export default async function EmployeeProfilePage({ params }: { params: { id: string } }) {
  const session = await requireRole("any");
  const profile = await getProfile(params.id);
  if (!profile) notFound();

  const theme = session.role === "hr" ? "light" : "dark";

  return (
    <div data-theme={theme} className="theme-shell">
      {theme === "dark" && (
        <>
          <div className="theme-glow g1" aria-hidden />
          <div className="theme-glow g2" aria-hidden />
          <div className="theme-glow g3" aria-hidden />
        </>
      )}
      <RoleHeader session={session} eyebrow="Directory · Profile" />
      <section className="relative z-[1] mx-auto max-w-4xl px-s-8 py-s-10">
        <Link href="/employees" className="text-[13px] text-fg-2 hover:text-fg-1">&larr; Back to directory</Link>
        <div className="mt-s-4">
          <ProfileView profile={profile} canManage={session.role === "hr"} />
        </div>
      </section>
    </div>
  );
}
