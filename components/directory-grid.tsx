"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { X, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ProfileAvatar } from "@/components/profile-avatar";
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

export function DirectoryGrid({ profiles }: { profiles: Profile[] }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => profiles.filter((p) => matches(p, query.trim())), [profiles, query]);

  return (
    <div>
      <div className="sticky top-0 z-10 -mx-s-8 mt-s-6 bg-bg-page/95 px-s-8 pb-s-3 pt-s-3 backdrop-blur">
        <div className="flex items-center gap-s-3 rounded-xl border border-border-strong bg-bg-surface px-s-4 py-s-2 shadow-1 transition-all duration-base focus-within:border-border-focus focus-within:shadow-focus">
          <Search className="size-4 flex-shrink-0 text-fg-3" aria-hidden />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by name, skill, city, or role…"
            className="h-auto flex-1 border-0 bg-transparent px-0 text-[15px] shadow-none focus-visible:ring-0"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear filter"
              className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-pill text-fg-3 transition-colors hover:bg-bg-sunken hover:text-fg-1"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
        <p className="mt-s-2 font-mono text-[11px] uppercase tracking-eyebrow text-fg-2">
          Showing {filtered.length} of {profiles.length} {profiles.length === 1 ? "employee" : "employees"}
        </p>
      </div>

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
        <ul className="mt-s-4 grid gap-s-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <li key={p.id}>
              <Link href={`/employees/${p.id}`} className="block">
                <Card className="h-full transition-all duration-base ease-out hover:-translate-y-px hover:shadow-2">
                  <CardHeader>
                    <div className="flex items-center gap-s-3">
                      <ProfileAvatar name={p.name} email={p.email} className="size-10 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <CardTitle className="truncate text-[17px]">{p.name}</CardTitle>
                        <p className="text-[13px] text-fg-2">
                          {p.seniority} &middot; {p.city} &middot; {p.yearsExperience} yrs
                        </p>
                      </div>
                    </div>
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
