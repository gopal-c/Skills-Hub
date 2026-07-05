import { Clock3 } from "lucide-react";
import { requireRole } from "@/lib/session";
import { RoleHeader } from "@/components/role-header";
import { getProfileByEmail } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function PendingApprovalPage() {
  const session = await requireRole("employee");
  const profile = await getProfileByEmail(session.email);
  const needsVerification = profile?.workEmail && !profile.workEmailVerified;

  return (
    <div data-theme="dark" className="theme-shell">
      <div className="theme-glow g1" aria-hidden />
      <div className="theme-glow g2" aria-hidden />
      <div className="theme-glow g3" aria-hidden />
      <RoleHeader session={session} eyebrow="Pending approval" />

      <main className="relative z-[1] mx-auto flex max-w-2xl flex-col items-center px-s-8 py-s-20 text-center">
        <div
          className="mb-s-8 flex h-32 w-32 items-center justify-center rounded-pill"
          style={{ background: "linear-gradient(135deg, var(--brand-amber-soft), var(--brand-coral-soft))" }}
        >
          <Clock3 className="size-16" style={{ color: "var(--brand-amber-deep)" }} strokeWidth={1.5} />
        </div>

        <span className="eyebrow eyebrow-coral">Almost there</span>
        <h1 className="mt-s-2" style={{ color: "var(--t-fg-1)" }}>
          {needsVerification ? "Verify your work email first." : "Your account is pending approval."}
        </h1>
        <p className="mt-s-3 max-w-md text-[15px]" style={{ color: "var(--t-fg-2)" }}>
          {needsVerification
            ? "Check your inbox for the verification link we sent. Once confirmed, HR reviews your account before you can sign in."
            : "HR has been notified and is reviewing your account. You'll be able to sign in as soon as it's approved."}
        </p>
      </main>
    </div>
  );
}
