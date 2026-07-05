"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Trash2, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/domain";
import type { Milestone, MilestoneCreator } from "@/lib/store";

type Props = {
  profileId: string;
  initialMilestones: Milestone[];
  /** Who's viewing/adding from this panel — sets created_by server-side and the delete rule. */
  viewerRole: MilestoneCreator;
  heading?: string;
  emptyText?: string;
};

export function MilestonesPanel({
  profileId,
  initialMilestones,
  viewerRole,
  heading = "Milestones & Achievements",
  emptyText = "No milestones recorded yet.",
}: Props) {
  const [milestones, setMilestones] = useState<Milestone[]>(initialMilestones);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isAdding, startAdding] = useTransition();

  function canDelete(m: Milestone): boolean {
    if (viewerRole === "hr") return true;
    return m.createdBy === "employee";
  }

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !date) return;
    startAdding(async () => {
      try {
        const res = await fetch("/api/milestones", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ profileId, title: title.trim(), milestoneDate: date }),
        });
        const data = await res.json();
        if (!data.ok) {
          toast.error(data.error ?? "Couldn't add that milestone.");
          return;
        }
        setMilestones((prev) =>
          [...prev, data.milestone as Milestone].sort((a, b) => (a.milestoneDate < b.milestoneDate ? 1 : -1)),
        );
        setTitle("");
        setDate("");
      } catch {
        toast.error("Network error — try again.");
      }
    });
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/milestones/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.ok) {
        toast.error(data.error ?? "Couldn't delete that milestone.");
        return;
      }
      setMilestones((prev) => prev.filter((m) => m.id !== id));
    } catch {
      toast.error("Network error — try again.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <Card>
      <CardHeader><CardTitle>{heading} ({milestones.length})</CardTitle></CardHeader>
      <CardContent className="space-y-s-4">
        {milestones.length === 0 ? (
          <p className="text-[13px] text-fg-2">{emptyText}</p>
        ) : (
          <ul className="space-y-s-2">
            {milestones.map((m) => (
              <li
                key={m.id}
                className="flex items-center gap-s-3 rounded-md border border-border-hairline px-s-3 py-s-2"
              >
                <span className="flex-1 truncate text-[14px] text-fg-1">{m.title}</span>
                <span className="rounded-pill bg-bg-sunken px-s-2 py-[2px] font-mono text-[10px] uppercase tracking-eyebrow text-fg-2">
                  {m.createdBy === "hr" ? "HR" : "Employee"}
                </span>
                <span className="font-mono text-[12px] text-fg-2">{formatDate(m.milestoneDate)}</span>
                {canDelete(m) ? (
                  <button
                    type="button"
                    onClick={() => handleDelete(m.id)}
                    disabled={deletingId === m.id}
                    aria-label={`Delete ${m.title}`}
                    className="flex size-7 flex-shrink-0 items-center justify-center rounded-md text-fg-3 transition-colors hover:bg-coral-soft hover:text-coral-press disabled:opacity-50"
                  >
                    <Trash2 size={14} />
                  </button>
                ) : (
                  <span className="flex size-7 flex-shrink-0 items-center justify-center text-fg-3" title="Added by HR">
                    <Lock size={13} />
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}

        <form onSubmit={handleAdd} className="grid grid-cols-1 items-end gap-s-2 sm:grid-cols-[1fr_160px_auto]">
          <Input
            placeholder="Achievement or milestone title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            type="date"
            aria-label="Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={new Date().toISOString().slice(0, 10)}
          />
          <Button type="submit" size="sm" disabled={isAdding || !title.trim() || !date}>
            {isAdding ? "Adding…" : "Add"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
