"use client";

import { useState, useTransition, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchResultCard } from "@/components/search-result-card";
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
      {/* Search input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          runSearch(query);
        }}
        className="flex items-center gap-s-3 rounded-xl border border-border-strong bg-bg-surface p-s-2 pl-s-4 shadow-1 transition-all duration-base focus-within:border-border-focus focus-within:shadow-focus"
      >
        <span aria-hidden className="text-fg-3">⌕</span>
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask in plain English — who knows X and has shipped Y?"
          className="h-auto flex-1 border-0 bg-transparent px-0 text-[16px] shadow-none focus-visible:ring-0"
          disabled={isPending}
        />
        <Button type="submit" disabled={isPending || !query.trim()} className="h-11 rounded-lg px-s-5">
          {isPending ? "Searching…" : "Search →"}
        </Button>
      </form>

      {/* Example queries */}
      {state.kind === "idle" && (
        <div className="mt-s-4 flex flex-wrap items-center gap-s-2">
          <span className="font-mono text-[11px] uppercase tracking-eyebrow text-fg-2">
            Try
          </span>
          {EXAMPLE_QUERIES.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => applyExample(q)}
              className="rounded-pill border border-border-hairline bg-bg-surface px-s-3 py-s-1 text-[13px] text-fg-1 transition-colors duration-fast hover:border-indigo hover:text-indigo-deep"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Results / empty / loading */}
      <div className="mt-s-8">
        {state.kind === "idle" && (
          <Card>
            <CardContent className="py-s-10 text-center">
              <p className="font-mono text-[11px] uppercase tracking-eyebrow text-fg-3">Ready</p>
              <h3 className="mt-s-2">
                Ask your <span className="serif-italic text-indigo-deep">first question.</span>
              </h3>
              <p className="mt-s-2 text-[14px] text-fg-2">
                {approvedCount} approved {approvedCount === 1 ? "profile" : "profiles"} indexed.
                Each result comes with a one-line reason you can trust.
              </p>
            </CardContent>
          </Card>
        )}

        {state.kind === "loading" && (
          <div>
            <p className="mb-s-4 font-mono text-[11px] uppercase tracking-eyebrow text-fg-2">
              Asking the model…
            </p>
            <ul className="space-y-s-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <li key={i}>
                  <div className="rounded-lg border border-border-hairline bg-bg-surface p-s-5 shadow-1">
                    <div className="flex items-center gap-s-3">
                      <Skeleton className="h-10 w-10 rounded-pill" />
                      <div className="flex-1 space-y-s-2">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-3 w-1/4" />
                      </div>
                      <Skeleton className="h-7 w-20" />
                    </div>
                    <Skeleton className="mt-s-3 h-12 w-full" />
                    <div className="mt-s-3 flex gap-s-1">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-5 w-14" />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {state.kind === "error" && (
          <Card>
            <CardContent className="py-s-8 text-center">
              <p className="font-mono text-[11px] uppercase tracking-eyebrow text-coral-deep">Error</p>
              <h3 className="mt-s-2">Something broke.</h3>
              <p className="mt-s-2 text-[14px] text-fg-2">{state.error}</p>
              <Button type="button" variant="outline" className="mt-s-4" onClick={() => runSearch(state.query)}>
                Try again
              </Button>
            </CardContent>
          </Card>
        )}

        {state.kind === "results" && state.results.length === 0 && (
          <Card>
            <CardContent className="py-s-10 text-center">
              <p className="font-mono text-[11px] uppercase tracking-eyebrow text-fg-3">No matches</p>
              <h3 className="mt-s-2">Nobody matches yet. Try fewer constraints?</h3>
              <p className="mt-s-2 text-[14px] text-fg-2">
                You asked: <span className="serif-italic">&ldquo;{state.query}&rdquo;</span>
              </p>
            </CardContent>
          </Card>
        )}

        {state.kind === "results" && state.results.length > 0 && (
          <div>
            <div className="mb-s-4 flex items-baseline justify-between">
              <p className="font-mono text-[11px] uppercase tracking-eyebrow text-fg-2">
                {state.results.length} {state.results.length === 1 ? "match" : "matches"}
              </p>
              <p className="text-[12px] text-fg-3">
                ranked by relevance
              </p>
            </div>
            <ul className="space-y-s-3">
              {state.results.map((r) => (
                <li key={r.profile.id}>
                  <SearchResultCard profile={r.profile} score={r.score} reason={r.reason} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
