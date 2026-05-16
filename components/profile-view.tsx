import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { DeleteProfileButton } from "@/components/delete-profile-button";
import { ProfileAvatar } from "@/components/profile-avatar";
import type { Profile, Skill } from "@/lib/store";

const CATEGORY_ORDER = ["language", "framework", "database", "cloud", "tool", "domain", "soft"];
const CATEGORY_LABEL: Record<string, string> = {
  language:  "Languages",
  framework: "Frameworks",
  database:  "Databases",
  cloud:     "Cloud & ops",
  tool:      "Tools",
  domain:    "Domain knowledge",
  soft:      "Soft skills",
};

function groupByCategory(skills: Skill[]): Array<[string, Skill[]]> {
  const buckets = new Map<string, Skill[]>();
  for (const s of skills) {
    const k = (s.category || "other").toLowerCase();
    if (!buckets.has(k)) buckets.set(k, []);
    buckets.get(k)!.push(s);
  }
  const sortedKeys = Array.from(buckets.keys()).sort((a, b) => {
    const ai = CATEGORY_ORDER.indexOf(a); const bi = CATEGORY_ORDER.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
  return sortedKeys.map((k) => [k, buckets.get(k)!]);
}

function proficiencyClass(p: string): string {
  switch (p) {
    case "expert":       return "bg-coral-soft text-coral-press border-transparent";
    case "advanced":     return "bg-indigo-soft text-indigo-press border-transparent";
    case "intermediate": return "bg-bg-sunken text-fg-1 border-transparent";
    default:             return "border-border-strong text-fg-2 bg-transparent";
  }
}

export function ProfileView({ profile, canManage }: { profile: Profile; canManage: boolean }) {
  const grouped = groupByCategory(profile.skills);

  return (
    <>
      <header className="flex flex-wrap items-end justify-between gap-s-4 border-b border-border-hairline pb-s-6">
        <div className="flex items-center gap-s-4">
          <ProfileAvatar name={profile.name} email={profile.email} className="size-16 flex-shrink-0" />
          <div>
            <span className="eyebrow eyebrow-indigo">{profile.seniority}</span>
            <h1 className="mt-s-2">{profile.name}</h1>
            <p className="mt-s-2 text-[14px] text-fg-2">
              <span className="font-mono">{profile.email}</span>
              <span className="mx-s-2 text-fg-3">·</span>
              {profile.city}
              <span className="mx-s-2 text-fg-3">·</span>
              {profile.yearsExperience} yrs experience
            </p>
          </div>
        </div>

        {canManage && (
          <div className="flex items-center gap-s-2">
            <Link
              href={`/review/${profile.id}`}
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              Edit
            </Link>
            <DeleteProfileButton id={profile.id} name={profile.name} />
          </div>
        )}
      </header>

      {/* Skills */}
      <section className="mt-s-8">
        <span className="eyebrow">Skills</span>
        <h2 className="mt-s-2">{profile.skills.length} {profile.skills.length === 1 ? "skill" : "skills"}</h2>

        {profile.skills.length === 0 ? (
          <p className="mt-s-4 text-[14px] text-fg-2">No skills on record.</p>
        ) : (
          <div className="mt-s-6 space-y-s-6">
            {grouped.map(([cat, items]) => (
              <div key={cat}>
                <p className="font-mono text-[11px] uppercase tracking-eyebrow text-fg-2">
                  {CATEGORY_LABEL[cat] ?? cat}
                </p>
                <ul className="mt-s-3 flex flex-wrap gap-s-2">
                  {items.map((s) => (
                    <li
                      key={s.name}
                      className="flex items-center gap-s-2 rounded-pill border border-border-hairline bg-bg-surface px-s-3 py-s-1"
                    >
                      <span className="text-[13px] font-medium text-fg-1">{s.name}</span>
                      <Badge className={`rounded-pill px-s-2 py-0 font-mono text-[10px] uppercase ${proficiencyClass(s.proficiency)}`}>
                        {s.proficiency}
                      </Badge>
                      <span className="font-mono text-[11px] text-fg-3">{s.yearsExperience} yr</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Projects */}
      <section className="mt-s-12">
        <span className="eyebrow">Projects</span>
        <h2 className="mt-s-2">{profile.projects.length} {profile.projects.length === 1 ? "project" : "projects"}</h2>

        {profile.projects.length === 0 ? (
          <p className="mt-s-4 text-[14px] text-fg-2">No projects on record.</p>
        ) : (
          <ul className="mt-s-6 space-y-s-4">
            {profile.projects.map((p, i) => (
              <li key={i}>
                <Card>
                  <CardHeader className="flex flex-row items-baseline justify-between gap-s-3">
                    <CardTitle className="text-[17px]">{p.name}</CardTitle>
                    <span className="font-mono text-[11px] text-fg-2">{p.duration}</span>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[14px] leading-[1.55] text-fg-1">{p.description}</p>
                    {p.skillsUsed.length > 0 && (
                      <div className="mt-s-3 flex flex-wrap gap-s-1">
                        {p.skillsUsed.map((s) => (
                          <Badge key={s} variant="secondary" className="font-mono text-[11px]">{s}</Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Education */}
      <section className="mt-s-12">
        <span className="eyebrow">Education</span>
        <h2 className="mt-s-2">{profile.education.length} {profile.education.length === 1 ? "entry" : "entries"}</h2>

        {profile.education.length === 0 ? (
          <p className="mt-s-4 text-[14px] text-fg-2">No education on record.</p>
        ) : (
          <ul className="mt-s-6 space-y-s-2">
            {profile.education.map((e, i) => (
              <li key={i} className="flex items-baseline justify-between border-b border-border-hairline pb-s-3 last:border-0">
                <div>
                  <p className="text-[15px] font-medium text-fg-1">{e.degree}</p>
                  <p className="text-[13px] text-fg-2">{e.institution}</p>
                </div>
                <span className="font-mono text-[12px] text-fg-2">{e.year}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
