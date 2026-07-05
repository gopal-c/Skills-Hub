"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";

export function ResendForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      try {
        await fetch("/api/resend-verification", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ email }),
        });
      } catch {
        // generic response regardless — still show "sent"
      }
      setSent(true);
    });
  }

  if (sent) {
    return <p className="lede">If that email needs verifying, check your inbox for a new link.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-s-3">
      <Input
        type="email"
        required
        placeholder="you@valueaddsofttech.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <div className="form-actions">
        <button type="submit" className="btn-primary" disabled={isPending}>
          {isPending ? "Sending…" : "Resend verification link →"}
        </button>
      </div>
    </form>
  );
}
