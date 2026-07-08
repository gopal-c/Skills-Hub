import Link from "next/link";
import { Hourglass, User, FileText, Lock } from "lucide-react";
import { requireRole } from "@/lib/session";
import { RoleHeader } from "@/components/role-header";
import { getProfileByEmail, getMilestonesByProfileId } from "@/lib/store";
import { hasResumeData } from "@/lib/domain";
import { buildHomeData } from "@/lib/timeline";
import { TenureProgressBar } from "@/components/progress-bar";
import { TimelineColumn } from "@/components/timeline-column";

export const dynamic = "force-dynamic";

export default async function EmployeeHomePage() {
  const session = await requireRole("employee");
  const profile = await getProfileByEmail(session.email);

  const approved = profile?.status === "approved";
  const hasData  = profile ? hasResumeData(profile) : false;

  const milestones = approved && profile ? await getMilestonesByProfileId(profile.id) : [];
  const home = approved && profile ? buildHomeData(profile, milestones) : null;

  return (
    <div data-theme="dark" className="theme-shell">
      <div className="theme-glow g1" aria-hidden />
      <div className="theme-glow g2" aria-hidden />
      <div className="theme-glow g3" aria-hidden />
      <RoleHeader session={session} eyebrow="Home" employeeApproved={approved} />

      <section className="relative z-[1] mx-auto max-w-5xl px-s-8 py-s-10">
        {/* Header */}
        <h1 className="home-timeline-heading">
          Welcome, <span className="serif-italic" style={{ color: "var(--brand-coral)" }}>{session.name}</span> ✨
        </h1>
        <p className="home-timeline-sub">Your journey with us — here&apos;s your story in milestones and moments.</p>

        {/* Pending state */}
        {!approved && (
          <>
            <div
              className="mt-s-6 flex items-start gap-s-3 rounded-lg p-s-4"
              style={{
                background: "var(--ink-0)",
                borderLeft: "4px solid var(--brand-amber-deep)",
                boxShadow: "var(--shadow-1)",
              }}
            >
              <Hourglass className="mt-[2px] size-5 flex-shrink-0" style={{ color: "var(--brand-amber-deep)" }} />
              <div>
                <p className="text-[15px] font-medium" style={{ color: "var(--ink-800)" }}>
                  Your account is pending approval
                </p>
                <p className="mt-s-1 text-[13px]" style={{ color: "var(--ink-600)" }}>
                  {hasData
                    ? "HR has your profile on file and will approve your account shortly."
                    : "HR will review and approve your account shortly. You'll get access to your profile once approved."}
                </p>
              </div>
            </div>

            <div className="mt-s-6 grid gap-s-4 sm:grid-cols-2">
              <HomeCard href="/me" enabled={false} icon={<User className="size-5" />} title="My Profile" description="View your skills, experience, and profile details." />
              <HomeCard href="/upload" enabled={false} icon={<FileText className="size-5" />} title="Update Profile" description="Upload a new resume to refresh your profile." />
            </div>
          </>
        )}

        {/* Approved: full timeline page */}
        {approved && home && (
          <>
            {/* Nav cards — hidden when timeline has content */}
            {home.leftColumn.length === 0 && home.rightColumn.length === 0 && (
              <div className="mt-s-6 grid gap-s-4 sm:grid-cols-2">
                <HomeCard href="/me" enabled icon={<User className="size-5" />} title="My Profile" description="View your skills, experience, and profile details." />
                <HomeCard href="/upload" enabled icon={<FileText className="size-5" />} title="Update Profile" description="Upload a new resume to refresh your profile." />
              </div>
            )}

            {/* Counter badges */}
            <div className="mt-s-8 flex flex-wrap gap-s-2">
              {home.tenureYears !== null && (
                <span className="milestone-badge">
                  <span className="milestone-badge-val">{home.tenureYears}</span>
                  {home.tenureYears === 1 ? "Year" : "Years"}
                </span>
              )}
              <span className="milestone-badge">
                <span className="milestone-badge-val">{home.promotions}</span>
                {home.promotions === 1 ? "Promotion" : "Promotions"}
              </span>
              <span className="milestone-badge">
                <span className="milestone-badge-val">{home.certifications}</span>
                {home.certifications === 1 ? "Certification" : "Certifications"}
              </span>
              <span className="milestone-badge">
                <span className="milestone-badge-val">{home.skillsCount}</span>
                {home.skillsCount === 1 ? "Skill" : "Skills"}
              </span>
            </div>

            {/* Progress bar */}
            {home.tenureYears !== null && (
              <TenureProgressBar percent={home.tenureProgressPercent} />
            )}

            {/* Stat cards */}
            <div className="mt-s-8 grid gap-s-4 sm:grid-cols-3">
              <div className="home-stat-card">
                <div className="stat-icon" style={{ background: "var(--brand-teal)" }}>⏱️</div>
                <div className="stat-body">
                  <span className="stat-value">
                    {home.tenureYears !== null ? `${home.tenureYears} ${home.tenureYears === 1 ? "Year" : "Years"}` : "—"}
                  </span>
                  <span className="stat-sub">
                    {home.tenureYears !== null ? `${home.tenureYears} ${home.tenureYears === 1 ? "anniversary" : "anniversaries"} celebrated` : "Joining date not set"}
                  </span>
                </div>
              </div>
              <div className="home-stat-card">
                <div className="stat-icon" style={{ background: "var(--brand-coral)" }}>↗️</div>
                <div className="stat-body">
                  <span className="stat-value">{home.promotions} {home.promotions === 1 ? "Promotion" : "Promotions"}</span>
                  <span className="stat-sub">Career progression milestones</span>
                </div>
              </div>
              <div className="home-stat-card">
                <div className="stat-icon" style={{ background: "var(--brand-amber)" }}>🏅</div>
                <div className="stat-body">
                  <span className="stat-value">{home.certifications} {home.certifications === 1 ? "Certification" : "Certifications"}</span>
                  <span className="stat-sub">Professional credentials</span>
                </div>
              </div>
            </div>

            {/* Two-column timeline */}
            <div className="mt-s-10 grid gap-s-8 lg:grid-cols-2">
              <div>
                <h2 className="timeline-section-heading">{"Your Journey 🚀"}</h2>
                <TimelineColumn items={home.leftColumn} emptyText="Your journey starts here — milestones will appear as you grow with the team." variant="journey" />
              </div>
              <div>
                <h2 className="timeline-section-heading">{"Professional Growth 📚"}</h2>
                <TimelineColumn
                  items={home.rightColumn}
                  emptyText={
                    home.rightEmptyReason === "no-education"
                      ? "Upload a resume to populate your professional growth timeline."
                      : "No certifications or courses recorded after your joining date. Upload an updated resume to add them."
                  }
                  variant="growth"
                />
              </div>
            </div>
          </>
        )}
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
      <span className="home-card-icon">{icon}</span>
      <div className="min-w-0">
        <p className="text-[15px] font-medium" style={{ color: "var(--ink-800)" }}>{title}</p>
        <p className="mt-s-1 text-[13px]" style={{ color: "var(--ink-600)" }}>{description}</p>
      </div>
    </>
  );

  if (!enabled) {
    return (
      <div className="home-nav-card home-nav-card-disabled" title="Available once your account is approved">
        <Lock className="absolute right-s-3 top-s-3 size-4" style={{ color: "var(--ink-400)" }} />
        {body}
      </div>
    );
  }

  return (
    <Link href={href} className="home-nav-card home-nav-card-active">
      {body}
    </Link>
  );
}
