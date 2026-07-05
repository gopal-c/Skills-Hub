"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AiResumeUploadPanel } from "@/components/ai-resume-upload-panel";

export function OnboardForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleUpload(file: File) {
    setIsLoading(true);
    setIsSuccess(false);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/employees", { method: "POST", body: fd });
      const data = await res.json();
      if (!data.ok) {
        toast.error(data.error ?? "Couldn't onboard that resume.");
        return;
      }
      toast.success("Onboarded. Pending your review.");
      setIsSuccess(true);
      router.push("/review");
      router.refresh();
    } catch {
      toast.error("Network error — try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AiResumeUploadPanel
      existingResume={null}
      onUpload={handleUpload}
      isLoading={isLoading}
      isSuccess={isSuccess}
    />
  );
}
