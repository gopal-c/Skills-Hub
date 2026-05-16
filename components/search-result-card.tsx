import Link from "next/link";
import { ProfileAvatar } from "@/components/profile-avatar";
import type { Profile } from "@/lib/store";

type Props = {
  profile: Profile;
  score: number;
  reason: string;
};

export function SearchResultCard({ profile, score, reason }: Props) {
  const strong = score >= 70;
  const scoreColor = strong ? "var(--brand-teal)" : "var(--brand-amber)";

  const reasonLower = reason.toLowerCase();
  const shownSkills = profile.skills.slice(0, 8);

  return (
    <Link
      href={`/employees/${profile.id}`}
      className="group block rounded-lg border border-border-hairline bg-bg-surface p-s-5 shadow-1 transition-all duration-base ease-out hover:-translate-y-px hover:border-border-strong hover:shadow-3"
    >
      {/* Head */}
      <div className="flex items-center gap-s-3">
        <ProfileAvatar name={profile.name} email={profile.email} className="size-10 flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[17px] font-semibold text-fg-1">{profile.name}</p>
          <p className="text-[13px] text-fg-2">
            {profile.seniority} &middot; {profile.city} &middot; {profile.yearsExperience} yrs
          </p>
        </div>
        <div
          className="inline-flex items-baseline gap-s-1 rounded-md bg-ink-900 px-s-3 py-s-1 font-mono text-[13px] text-white"
          aria-label={`Match score ${score}`}
        >
          <span className="text-[18px] font-semibold" style={{ color: scoreColor }}>{score}</span>
          <span className="text-ink-400">/ 100</span>
        </div>
      </div>

      {/* Reason */}
      <p
        className="mt-s-3 rounded-md px-s-3 py-s-2 text-[14px] leading-[1.55]"
        style={{ background: "var(--brand-indigo-soft)", color: "var(--fg-1)" }}
      >
        {reason}
      </p>

      {/* Skills */}
      {shownSkills.length > 0 && (
        <div className="mt-s-3 flex flex-wrap gap-s-1">
          {shownSkills.map((s) => {
            const matched = reasonLower.includes(s.name.toLowerCase());
            return (
              <span
                key={s.name}
                className={
                  matched
                    ? "rounded-pill bg-teal-soft px-s-2 py-[2px] font-mono text-[11px] text-teal-deep"
                    : "rounded-pill bg-ink-100 px-s-2 py-[2px] font-mono text-[11px] text-fg-1"
                }
              >
                {s.name}
              </span>
            );
          })}
          {profile.skills.length > shownSkills.length && (
            <span className="rounded-pill border border-border-hairline px-s-2 py-[2px] font-mono text-[11px] text-fg-2">
              +{profile.skills.length - shownSkills.length}
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
