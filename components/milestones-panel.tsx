"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Milestone, MilestoneCategory } from "@/lib/store";

const CATEGORY_OPTIONS: { value: MilestoneCategory; label: string }[] = [
  { value: "achievement", label: "Achievement" },
  { value: "promotion", label: "Promotion" },
  { value: "milestone", label: "Milestone" },
  { value: "other", label: "Other" },
];

type Props = {
  profileId: string;
  initialMilestones: Milestone[];
  viewerRole: "hr" | "employee";
};

export function MilestonesPanel({ profileId, initialMilestones, viewerRole }: Props) {
  const [milestones, setMilestones] = useState<Milestone[]>(initialMilestones);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<MilestoneCategory>("achievement");
  const [newDate, setNewDate] = useState("");
  const [isAdding, startAdding] = useTransition();

  function canDelete(m: Milestone): boolean {
    if (viewerRole === "hr") return true;
    return m.createdBy === "employee";
  }

  function handleAdd() {
    if (!newTitle.trim() || !newDate) return;
    startAdding(async () => {
      try {
        const res = await fetch("/api/milestones", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ profileId, title: newTitle.trim(), milestoneDate: newDate, category: newCategory }),
        });
        const data = await res.json();
        if (!data.ok) { toast.error(data.error ?? "Couldn't add milestone."); return; }
        setMilestones((prev) =>
          [...prev, data.milestone as Milestone].sort((a, b) => (a.milestoneDate < b.milestoneDate ? 1 : -1)),
        );
        setNewTitle("");
        setNewCategory("achievement");
        setNewDate("");
      } catch { toast.error("Network error — try again."); }
    });
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/milestones/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.ok) { toast.error(data.error ?? "Couldn't delete milestone."); return; }
      setMilestones((prev) => prev.filter((m) => m.id !== id));
    } catch { toast.error("Network error — try again."); }
  }

  return (
    <Card>
      <CardHeader><CardTitle>Milestones &amp; Achievements ({milestones.length})</CardTitle></CardHeader>
      <CardContent className="space-y-s-3">
        {milestones.length === 0 && (
          <p className="text-[13px] text-fg-2">No milestones yet. Add one below.</p>
        )}
        {milestones.map((m) => (
          <div key={m.id} className="grid grid-cols-1 items-end gap-s-2 sm:grid-cols-[1fr_130px_140px_auto]">
            <Input value={m.title} disabled />
            <Input value={m.category} disabled className="capitalize" />
            <Input type="date" value={m.milestoneDate} disabled />
            {canDelete(m) ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(m.id)}
                aria-label={`Remove ${m.title}`}
              >
                ×
              </Button>
            ) : (
              <span className="flex h-9 items-center justify-center text-[11px] text-fg-3" title="Added by HR">🔒</span>
            )}
          </div>
        ))}
        {/* Add row — same inline layout as existing items */}
        <div className="grid grid-cols-1 items-end gap-s-2 sm:grid-cols-[1fr_130px_140px_auto]">
          <Input
            placeholder="Achievement or milestone title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <select
            aria-label="Category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value as MilestoneCategory)}
            className="h-9 rounded-md border border-border-hairline bg-bg-card px-s-2 text-[13px] text-fg-1"
          >
            {CATEGORY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <Input
            type="date"
            aria-label="Date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            max={new Date().toISOString().slice(0, 10)}
          />
          <Button
            type="button"
            size="sm"
            disabled={isAdding || !newTitle.trim() || !newDate}
            onClick={handleAdd}
          >
            {isAdding ? "…" : "+"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
