"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { Profile } from "@/lib/store";

function matches(p: Profile, q: string): boolean {
  if (!q) return true;
  const ql = q.toLowerCase();
  if (p.name.toLowerCase().includes(ql))      return true;
  if (p.city.toLowerCase().includes(ql))      return true;
  if (p.seniority.toLowerCase().includes(ql)) return true;
  if (p.skills.some((s) => s.name.toLowerCase().includes(ql))) return true;
  if (p.projects.some((pr) => pr.skillsUsed.some((s) => s.toLowerCase().includes(ql)))) return true;
  return false;
}

export function DirectoryGrid({ profiles }: { profiles: Profile[] }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => profiles.filter((p) => matches(p, query.trim())), [profiles, query]);

  return (
    <div>
      <div className="mt-s-6 flex items-center gap-s-3 rounded-xl border border-border-strong bg-bg-surface px-s-4 py-s-2 shadow-1 transition-all duration-base focus-within:border-border-focus focus-within:shadow-focus">
        <span aria-hidden className="text-fg-3">⌕</span>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by name, skill, city, seniority…"
          className="h-auto flex-1 border-0 bg-transparent px-0 text-[15px] shadow-none focus-visible:ring-0"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="rounded-md px-s-2 py-s-1 text-[12px] text-fg-2 hover:bg-bg-sunken"
          >
            Clear
          </button>
        )}
      </div>

      <p className="mt-s-3 font-mono text-[11px] uppercase tracking-eyebrow text-fg-2">
        {filtered.length} of {profiles.length} {profiles.length === 1 ? "person" : "people"}
      </p>

      {filtered.length === 0 ? (
        <Card className="mt-s-6">
          <CardContent className="py-s-10 text-center">
            <p className="font-mono text-[11px] uppercase tracking-eyebrow text-fg-3">No matches</p>
            <h3 className="mt-s-2">Nobody matches yet. Try fewer constraints?</h3>
            <p className="mt-s-2 text-[14px] text-fg-2">
              Filtered by: <span className="serif-italic">&ldquo;{query}&rdquo;</span>
            </p>
          </CardContent>
        </Card>
      ) : (
        <ul className="mt-s-6 grid gap-s-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <li key={p.id}>
              <Link href={`/employees/${p.id}`} className="block">
                <Card className="h-full transition-all duration-base ease-out hover:-translate-y-px hover:shadow-2">
                  <CardHeader>
                    <CardTitle className="text-[17px]">{p.name}</CardTitle>
                    <p className="text-[13px] text-fg-2">
                      {p.seniority} &middot; {p.city} &middot; {p.yearsExperience} yrs
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-s-1">
                      {p.skills.slice(0, 5).map((s) => (
                        <Badge key={s.name} variant="secondary" className="font-mono text-[11px]">
                          {s.name}
                        </Badge>
                      ))}
                      {p.skills.length > 5 && (
                        <Badge variant="outline" className="font-mono text-[11px]">
                          +{p.skills.length - 5}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
