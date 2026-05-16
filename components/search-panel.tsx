"use client";

import { useState, useTransition, useRef } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { avatarPalette, initials } from "@/lib/avatar-gradient";
import type { Profile } from "@/lib/store";

const EXAMPLE_QUERIES = [
  "Who knows React AND has worked on payment integrations?",
  "Senior backend engineers in Bangalore with Kafka experience",
  "Anyone with HIPAA / healthcare background?",
  "Mid-level full-stack with TypeScript and AWS",
];

type Result = { profile: Profile; score: number; reason: string };

type State =
  | { kind: "idle" }
  | { kind: "loading"; query: string }
  | { kind: "results"; query: string; results: Result[] }
  | { kind: "error"; query: string; error: string };

export function SearchPanel({ approvedCount }: { approvedCount: number }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [state, setState] = useState<State>({ kind: "idle" });
  const [isPending, startTransition] = useTransition();

  function runSearch(q: string) {
    const trimmed = q.trim();
    if (!trimmed) return;
    setState({ kind: "loading", query: trimmed });
    startTransition(async () => {
      try {
        const res = await fetch("/api/search", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ query: trimmed }),
        });
        const data = await res.json();
        if (!data.ok) {
          toast.error(data.error ?? "Search failed.");
          setState({ kind: "error", query: trimmed, error: data.error ?? "Search failed." });
          return;
        }
        setState({ kind: "results", query: trimmed, results: data.results });
      } catch {
        toast.error("Network error — try again.");
        setState({ kind: "error", query: trimmed, error: "Network error" });
      }
    });
  }

  function applyExample(q: string) {
    setQuery(q);
    inputRef.current?.focus();
    runSearch(q);
  }

  return (
    <div>
      <form
        onSubmit={(e) => { e.preventDefault(); runSearch(query); }}
        className="qbar"
      >
        <Search className="ic size-5" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask in plain English — who knows X and has shipped Y?"
          disabled={isPending}
        />
        <button type="submit" className="go" disabled={isPending || !query.trim()}>
          {isPending ? "Searching…" : "Search →"}
        </button>
      </form>

      {state.kind === "idle" && (
        <>
          <div className="suggested">
            <span className="lbl">Try</span>
            {EXAMPLE_QUERIES.map((q) => (
              <button key={q} type="button" className="chip" onClick={() => applyExample(q)}>
                {q}
              </button>
            ))}
          </div>
          <div className="empty">
            <div className="ey">Ready</div>
            <h3>Ask your <em>first question.</em></h3>
            <p>
              {approvedCount} approved {approvedCount === 1 ? "profile" : "profiles"} indexed.
              Each result comes with a one-line reason you can trust.
            </p>
          </div>
        </>
      )}

      {state.kind === "loading" && (
        <div>
          <div className="results-meta">
            <span className="count">Asking the model…</span>
          </div>
          <div className="results">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="result-card">
                <div className="result-head">
                  <Skeleton className="size-[52px] rounded-full" />
                  <div className="flex-1 space-y-s-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                  <Skeleton className="h-9 w-24 rounded-md" />
                </div>
                <Skeleton className="h-10 w-full rounded-md" />
                <div className="flex gap-s-1">
                  <Skeleton className="h-5 w-16 rounded-pill" />
                  <Skeleton className="h-5 w-20 rounded-pill" />
                  <Skeleton className="h-5 w-14 rounded-pill" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {state.kind === "error" && (
        <div className="empty" style={{ borderColor: "rgba(255,154,130,0.35)" }}>
          <div className="ey" style={{ color: "var(--brand-coral-deep)" }}>Error</div>
          <h3>Something broke.</h3>
          <p>{state.error}</p>
          <button
            type="button"
            onClick={() => runSearch(state.query)}
            className="chip"
            style={{ marginTop: 16 }}
          >
            Try again
          </button>
        </div>
      )}

      {state.kind === "results" && state.results.length === 0 && (
        <div className="empty">
          <div className="ey">No matches</div>
          <h3>Nobody matches yet. <em>Try fewer constraints?</em></h3>
          <p>You asked: <span className="serif-italic">&ldquo;{state.query}&rdquo;</span></p>
        </div>
      )}

      {state.kind === "results" && state.results.length > 0 && (
        <div>
          <div className="results-meta">
            <span className="count">
              <b>{state.results.length}</b> {state.results.length === 1 ? "match" : "matches"}
            </span>
            <span className="sort">ranked by relevance</span>
          </div>
          <div className="results">
            {state.results.map((r) => (
              <SearchResultCard key={r.profile.id} profile={r.profile} score={r.score} reason={r.reason} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SearchResultCard({ profile, score, reason }: Result) {
  const palette = avatarPalette(profile.name);
  const strong  = score >= 70;
  const reasonLower = reason.toLowerCase();
  const shownSkills = profile.skills.slice(0, 8);

  return (
    <Link
      href={`/employees/${profile.id}`}
      className="result-card"
    >
      <div className="result-head">
        <div className="result-avatar-wrap" style={{ "--halo": palette.halo } as React.CSSProperties}>
          {profile.avatarUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={profile.avatarUrl} alt={profile.name} className="result-avatar" />
          ) : (
            <div
              className="result-avatar"
              style={{ background: `linear-gradient(135deg, ${palette.grad[0]}, ${palette.grad[1]})` }}
            >
              {initials(profile.name)}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="result-name">{profile.name}</div>
          <div className="result-meta">
            <span className="lvl">{profile.seniority}</span> · {profile.city} · {profile.yearsExperience} yrs
          </div>
        </div>
        <span className={`score ${strong ? "" : "warm"}`}>
          <b>{score}</b>
          <span> / 100</span>
        </span>
      </div>

      <div className="reason">
        <b>Why</b>
        {reason}
      </div>

      {shownSkills.length > 0 && (
        <div className="result-skills">
          {shownSkills.map((s) => {
            const matched = reasonLower.includes(s.name.toLowerCase());
            return (
              <span key={s.name} className={`result-skill ${matched ? "match" : ""}`}>{s.name}</span>
            );
          })}
          {profile.skills.length > shownSkills.length && (
            <span className="result-skill">+{profile.skills.length - shownSkills.length}</span>
          )}
        </div>
      )}
    </Link>
  );
}
