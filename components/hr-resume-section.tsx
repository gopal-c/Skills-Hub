"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ResumeUploadForm } from "@/components/resume-upload-form";
import { hasResumeData } from "@/lib/domain";
import type { Profile } from "@/lib/store";

export function HrResumeSection({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [updatedAt, setUpdatedAt] = useState(profile.updatedAt);
  const [hasResume, setHasResume] = useState(hasResumeData(profile));

  return (
    <Card>
      <CardHeader><CardTitle>Resume</CardTitle></CardHeader>
      <CardContent className="space-y-s-4">
        <div className="flex flex-wrap items-center justify-between gap-s-3">
          <p className="flex items-center gap-s-2 text-[13px] text-fg-2">
            <FileText className="size-4 flex-shrink-0" />
            {hasResume
              ? <>Resume on file &mdash; last updated {new Date(updatedAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}</>
              : "No resume on file yet."}
          </p>
          {!expanded && (
            <Button type="button" variant="outline" size="sm" onClick={() => setExpanded(true)}>
              {hasResume ? "Replace resume" : "Upload resume"}
            </Button>
          )}
        </div>

        {expanded && (
          <ResumeUploadForm
            endpoint={`/api/employees/${profile.id}/resume`}
            heading={hasResume ? "Replace resume" : "Upload resume"}
            lede="This fully replaces the extracted skills, projects, and education below, and sends the profile back to pending for re-review."
            submitIdleLabel="Extract & replace →"
            submitBusyLabel="Extracting…"
            onSuccess={(data) => {
              toast.success("Resume extracted — profile fields refreshed below.");
              setHasResume(true);
              if (typeof data.updatedAt === "string") setUpdatedAt(data.updatedAt);
              setExpanded(false);
              router.refresh();
            }}
          />
        )}
      </CardContent>
    </Card>
  );
}
