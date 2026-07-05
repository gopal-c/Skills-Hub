"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { ResumeUploadForm } from "@/components/resume-upload-form";

export function VerifyUploadPanel({
  token,
  alreadyUploaded,
}: {
  token: string;
  alreadyUploaded: boolean;
}) {
  const [uploaded, setUploaded] = useState(alreadyUploaded);

  if (uploaded) {
    return (
      <section className="form-card mt-s-6 flex items-center gap-s-3">
        <CheckCircle2 className="size-5 flex-shrink-0" style={{ color: "var(--brand-teal-deep)" }} />
        <p className="lede" style={{ margin: 0 }}>
          {alreadyUploaded ? "Resume already uploaded." : "Resume uploaded! HR will review your profile shortly."}
        </p>
      </section>
    );
  }

  return (
    <div className="mt-s-8">
      <h2 className="page-title" style={{ fontSize: 22, marginBottom: 4 }}>
        While you wait — upload your resume <span style={{ opacity: 0.6 }}>(optional)</span>
      </h2>
      <p className="page-sub" style={{ marginBottom: 0 }}>
        Uploading now gives HR more context to review your profile sooner. You can also do
        this after you&rsquo;re approved.
      </p>

      <ResumeUploadForm
        endpoint="/api/verify-upload"
        extraFields={{ token }}
        heading="Upload your resume"
        lede="PDF only, please."
        submitIdleLabel="Upload resume →"
        submitBusyLabel="Extracting…"
        onSuccess={() => {
          toast.success("Resume uploaded! HR will review your profile shortly.");
          setUploaded(true);
        }}
      />
    </div>
  );
}
