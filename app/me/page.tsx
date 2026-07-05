import { redirect } from "next/navigation";
import { requireRole } from "@/lib/session";
import { RoleHeader } from "@/components/role-header";
import { getProfileByEmail } from "@/lib/store";
import { MePanel } from "@/components/me-panel";

export const dynamic = "force-dynamic";

export default async function MePage() {
  const session = await requireRole("employee");
  const profile = await getProfileByEmail(session.email);

  // Any unapproved employee — self-signup or HR-onboarded-but-not-yet-approved
  // — stays off the dashboard until HR flips the profile to approved. This
  // mirrors the same check in middleware.ts; kept here too as the real
  // security boundary (middleware fails open on DB errors, this doesn't).
  if (!profile || profile.status !== "approved") {
    redirect("/home");
  }

  return (
    <div data-theme="dark" className="theme-shell">
      <div className="theme-glow g1" aria-hidden />
      <div className="theme-glow g2" aria-hidden />
      <div className="theme-glow g3" aria-hidden />
      <RoleHeader session={session} eyebrow="My profile" employeeApproved />

      <section className="relative z-[1] mx-auto max-w-4xl px-s-8 py-s-10">
        <MePanel profile={profile} />
      </section>
    </div>
  );
}
