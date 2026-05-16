"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Upload as UploadIcon, FileText, X } from "lucide-react";

export function OnboardForm() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [isPending, startTransition] = useTransition();

  function pickFile(f: File | null) {
    if (!f) return;
    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
      toast.error("That doesn't look like a PDF.");
      return;
    }
    setFile(f);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    pickFile(e.dataTransfer.files?.[0] ?? null);
  }

  function clearFile() {
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    startTransition(async () => {
      const fd = new FormData();
      fd.append("file", file);
      try {
        const res = await fetch("/api/employees", { method: "POST", body: fd });
        const data = await res.json();
        if (!data.ok) {
          toast.error(data.error ?? "Couldn't onboard that resume.");
          return;
        }
        toast.success("Onboarded. Pending your review.");
        router.push("/review");
        router.refresh();
      } catch {
        toast.error("Network error — try again.");
      }
    });
  }

  return (
    <section className="form-card">
      <h2>Onboard from resume</h2>
      <p className="lede">PDF only, please. We&rsquo;ll extract the candidate&rsquo;s profile.</p>

      <label className="field-label">Resume PDF</label>

      <form onSubmit={handleSubmit}>
        <label
          className={`dropzone ${dragging ? "dragging" : ""}`}
          onDragEnter={(e) => { e.preventDefault(); setDragging(true); }}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
        >
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf,.pdf"
            onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
            disabled={isPending}
          />
          <span className="dz-icon">
            <UploadIcon />
          </span>
          <div className="dz-title">
            Drag &amp; drop their resume, or <b>click to choose</b>
          </div>
          <div className="dz-hint">A clean PDF works best. We support up to 10 MB.</div>
          <div className="dz-meta">
            <span>PDF only</span><span className="pip"></span>
            <span>10 MB max</span><span className="pip"></span>
            <span>Single file</span>
          </div>
        </label>

        {file && (
          <div className="file-row">
            <span className="file-icon">
              <FileText className="size-[18px]" />
            </span>
            <div>
              <div className="file-name">{file.name}</div>
              <div className="file-meta">
                {(file.size / (1024 * 1024)).toFixed(2)} MB · {isPending ? "Extracting…" : "Ready to extract"}
              </div>
            </div>
            <button
              type="button"
              className="file-clear"
              onClick={clearFile}
              aria-label="Remove file"
              disabled={isPending}
            >
              <X className="size-[14px]" />
            </button>
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={!file || isPending}>
            {isPending ? "Extracting…" : "Extract & send to review →"}
          </button>
        </div>
      </form>
    </section>
  );
}
