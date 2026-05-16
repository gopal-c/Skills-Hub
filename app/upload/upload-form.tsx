"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function UploadForm() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      toast.error("Pick a PDF first.");
      return;
    }
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      toast.error("That doesn't look like a PDF.");
      return;
    }

    startTransition(async () => {
      const fd = new FormData();
      fd.append("file", file);
      try {
        const res = await fetch("/api/extract", { method: "POST", body: fd });
        const data = await res.json();
        if (!data.ok) {
          toast.error(data.error ?? "Couldn't read that resume.");
          return;
        }
        toast.success("Profile created. Pending review.");
        router.push(`/employees/${data.id}`);
        router.refresh();
      } catch {
        toast.error("Network error — try again.");
      }
    });
  }

  if (isPending) {
    return (
      <Card className="mt-s-8">
        <CardHeader>
          <CardTitle>Reading your resume…</CardTitle>
          <CardDescription>Extracting skills, projects, and proficiency. Usually 5–15 seconds.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-s-3">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-4 w-1/3" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-s-8">
      <CardHeader>
        <CardTitle>Upload a resume</CardTitle>
        <CardDescription>PDF only, please. We&rsquo;ll handle the rest.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-s-5">
          <div className="space-y-s-2">
            <Label htmlFor="resume">Resume PDF</Label>
            <Input
              id="resume"
              type="file"
              accept="application/pdf,.pdf"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              required
            />
            {file && (
              <p className="text-[12px] text-fg-2">
                <span className="font-mono">{file.name}</span> · {(file.size / 1024).toFixed(0)} KB
              </p>
            )}
          </div>

          <Button type="submit" disabled={!file} className="h-11 rounded-lg text-[14px]">
            Extract &amp; submit for review &rarr;
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
