"use client";

import { useState } from "react";
import { Eye, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileView } from "@/components/profile-view";
import { ProfileForm } from "@/components/profile-form";
import type { Profile, Milestone } from "@/lib/store";

export function MePanel({ profile, milestones }: { profile: Profile; milestones: Milestone[] }) {
  const [editing, setEditing] = useState(false);

  return (
    <div>
      {!editing && (
        <div className="mb-s-6 flex flex-wrap items-center justify-between gap-s-3 rounded-md border border-border-hairline bg-indigo-soft px-s-4 py-s-3 text-[13px] text-indigo-press">
          <div className="flex items-center gap-s-3">
            <Eye className="size-4 flex-shrink-0" />
            <span>This is how others see your profile.</span>
          </div>
          <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
            <Pencil className="mr-s-1 size-3.5" /> Edit profile
          </Button>
        </div>
      )}

      {editing ? (
        <ProfileForm profile={profile} mode="self" onSaved={() => setEditing(false)} initialMilestones={milestones} />
      ) : (
        <ProfileView profile={profile} canManage={false} editableAvatar />
      )}
    </div>
  );
}
