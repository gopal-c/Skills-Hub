import Link from "next/link";
import { Hourglass, CheckCircle2, User, FileText, Lock } from "lucide-react";
import { requireRole } from "@/lib/session";
import { RoleHeader } from "@/components/role-header";
import { getProfileByEmail } from "@/lib/store";
import { hasResumeData } from "@/lib/domain";

export const dynamic = "force-dynamic";

export default async function EmployeeHomePage() {
  const session = await requireRole("employee");
  const profile = await getProfileByEmail(session.email);

  const approved = profile?.status === "approved";
  const hasData  = profile ? hasResumeData(profile) : false;

  return (
    <div data-theme="dark" className="theme-shell">
      <div className="theme-glow g1" aria-hidden />
      <div className="theme-glow g2" aria-hidden />
      <div className="theme-glow g3" aria-hidden />
      <RoleHeader session={session} eyebrow="Home" employeeApproved={approved} />

      <section className="relative z-[1] mx-auto max-w-4xl px-s-8 py-s-10">
        <span className="eyebrow eyebrow-coral">Employee home</span>
        <h1 className="mt-s-2" style={{ color: "var(--t-fg-1)" }}>
          Welcome, <span className="serif-italic" style={{ color: "var(--brand-coral-deep)" }}>{session.name}.</span>
        </h1>

        {/* Section 1 — status banner */}
        <div
          className="mt-s-6 flex items-start gap-s-3 rounded-lg p-s-4"
          style={{
            background: "var(--ink-0)",
            borderLeft: approved ? "4px solid var(--brand-teal-deep)" : "4px solid var(--brand-amber-deep)",
            boxShadow: "var(--shadow-1)",
          }}
        >
          {approved ? (
            <CheckCircle2 className="mt-[2px] size-5 flex-shrink-0" style={{ color: "var(--brand-teal-deep)" }} />
          ) : (
            <Hourglass className="mt-[2px] size-5 flex-shrink-0" style={{ color: "var(--brand-amber-deep)" }} />
          )}
          <div>
            <p className="text-[15px] font-medium" style={{ color: "var(--ink-800)" }}>
              {approved ? "You're all set" : "Your account is pending approval"}
            </p>
            <p className="mt-s-1 text-[13px]" style={{ color: "var(--ink-600)" }}>
              {approved
                ? "Your profile is approved. Use the menu to view or update your profile."
                : hasData
                  ? "HR has your profile on file and will approve your account shortly."
                  : "HR will review and approve your account shortly. You'll get access to your profile once approved."}
            </p>
          </div>
        </div>

        {/* Section 2 — nav cards */}
        <div className="mt-s-6 grid gap-s-4 sm:grid-cols-2">
          <HomeCard
            href="/me"
            enabled={approved}
            icon={<User className="size-5" />}
            title="My Profile"
            description="View your skills, experience, and profile details."
          />
          <HomeCard
            href="/upload"
            enabled={approved}
            icon={<FileText className="size-5" />}
            title="Update Profile"
            description="Upload a new resume to refresh your profile."
          />
        </div>

        {/* Section 3 — placeholder, next iteration */}
        <div className="mt-s-8 min-h-48">
          {/* TODO: Employee Home — additional content goes here (next iteration) */}
        </div>
      </section>
    </div>
  );
}

function HomeCard({
  href,
  enabled,
  icon,
  title,
  description,
}: {
  href: string;
  enabled: boolean;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  const body = (
    <>
      <span
        className="flex size-9 flex-shrink-0 items-center justify-center rounded-md"
        style={{ background: "var(--brand-indigo-soft)", color: "var(--brand-indigo-deep)" }}
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[15px] font-medium" style={{ color: "var(--ink-800)" }}>{title}</p>
        <p className="mt-s-1 text-[13px]" style={{ color: "var(--ink-600)" }}>{description}</p>
      </div>
    </>
  );

  if (!enabled) {
    return (
      <div
        className="relative flex cursor-not-allowed items-start gap-s-3 rounded-lg p-s-4 opacity-50"
        style={{ background: "var(--ink-0)", border: "1px solid var(--border-hairline)" }}
        title="Available once your account is approved"
      >
        <Lock className="absolute right-s-3 top-s-3 size-4" style={{ color: "var(--ink-400)" }} />
        {body}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className="flex items-start gap-s-3 rounded-lg p-s-4 transition-all duration-base ease-out hover:-translate-y-px"
      style={{ background: "var(--ink-0)", border: "1px solid var(--border-hairline)", boxShadow: "var(--shadow-1)" }}
    >
      {body}
    </Link>
  );
}
