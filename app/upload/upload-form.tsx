"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ResumeUploadForm } from "@/components/resume-upload-form";

export function UploadForm() {
  const router = useRouter();

  return (
    <ResumeUploadForm
      endpoint="/api/me/upload-resume"
      heading="Refresh your profile from a resume"
      lede="PDF only, please. We'll re-extract everything and send it for re-approval."
      submitIdleLabel="Update my profile →"
      submitBusyLabel="Updating…"
      onSuccess={() => {
        toast.success("Profile updated. Awaiting re-approval.");
        router.push("/me");
        router.refresh();
      }}
    />
  );
}
