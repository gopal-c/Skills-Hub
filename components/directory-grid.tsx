"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { avatarPalette, initials } from "@/lib/avatar-gradient";
import type { Profile } from "@/lib/store";

function matches(p: Profile, q: string): boolean {
  if (!q) return true;
  const ql = q.toLowerCase();
  if (p.name.toLowerCase().includes(ql))      return true;
  if (p.city.toLowerCase().includes(ql))      return true;
  if (p.seniority.toLowerCase().includes(ql)) return true;
  if (p.skills.some((s) => s.name.toLowerCase().includes(ql))) return true;
  return false;
}

function empId(i: number): string {
  return `SH-25${String(i + 1).padStart(3, "0")}`;
}

export function DirectoryGrid({ profiles }: { profiles: Profile[] }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => profiles.filter((p) => matches(p, query.trim())), [profiles, query]);

  return (
    <div>
      <div className="toolbar">
        <div className="search">
          <Search className="icon size-4" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find anyone — name, skill, location, or role…"
          />
          {query && (
            <button
              type="button"
              className="clear-btn"
              onClick={() => setQuery("")}
              aria-label="Clear filter"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      <p className="count-strip">
        Showing {filtered.length} of {profiles.length} {profiles.length === 1 ? "employee" : "employees"}
      </p>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-s-10 text-center">
            <p className="font-mono text-[11px] uppercase tracking-eyebrow text-fg-3">No matches</p>
            <h3 className="mt-s-2">Nobody matches yet. Try fewer constraints?</h3>
            <p className="mt-s-2 text-[14px] text-fg-2">
              Filtered by: <span className="serif-italic">&ldquo;{query}&rdquo;</span>
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid">
          {filtered.map((p, i) => {
            const palette = avatarPalette(p.name);
            const visibleSkills = p.skills.slice(0, 3);
            const more = p.skills.length - visibleSkills.length;
            return (
              <Link
                href={`/employees/${p.id}`}
                key={p.id}
                className="id-card"
                style={{ "--halo": palette.halo } as React.CSSProperties}
              >
                <div className="id-avatar-wrap">
                  {p.avatarUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={p.avatarUrl} alt={p.name} className="id-avatar" />
                  ) : (
                    <div
                      className="id-avatar"
                      style={{ background: `linear-gradient(135deg, ${palette.grad[0]}, ${palette.grad[1]})` }}
                    >
                      {initials(p.name)}
                    </div>
                  )}
                  <span className="id-status" title="Approved" />
                </div>

                <div className="id-name">{p.name}</div>
                <span className={`level-pill ${p.seniority}`}>{p.seniority}</span>
                <div className="id-loc">{p.city}</div>

                <div className="id-skills">
                  {visibleSkills.map((s) => (
                    <span key={s.name} className="id-skill">{s.name}</span>
                  ))}
                  {more > 0 && <span className="id-skill more">+{more}</span>}
                </div>

                <div className="id-row">
                  <span>{empId(i)}</span>
                  <span className="yrs">{p.yearsExperience} yrs</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
