"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/forgot-password", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (!data.ok) {
          setError(data.error ?? "Something went wrong.");
          return;
        }
        setSent(true);
      } catch {
        setError("Network error — try again.");
      }
    });
  }

  return (
    <div data-theme="dark" className="theme-shell">
      <div className="theme-glow g1" aria-hidden />
      <div className="theme-glow g2" aria-hidden />
      <div className="theme-glow g3" aria-hidden />

      <header className="relative z-[1] mx-auto flex max-w-6xl items-center px-s-8 py-s-6">
        <Link href="/" className="flex items-center">
          <Image src="/assets/logo-wordmark-dark.svg" alt="SkillsHub" width={140} height={32} />
        </Link>
      </header>

      <main className="upload-v2 relative z-[1] mx-auto max-w-[480px] px-s-8 pb-s-20 pt-s-8">
        {sent ? (
          <section className="form-card text-center">
            <h2>Check your inbox</h2>
            <p className="lede">If an account exists for that email, a reset link is on its way. It expires in 1 hour.</p>
            <div className="form-actions">
              <Link href="/" className="btn-primary">Back to home</Link>
            </div>
          </section>
        ) : (
          <>
            <h1 className="page-title">Forgot your password?</h1>
            <p className="page-sub">Enter your email and we&rsquo;ll send you a reset link.</p>

            <section className="form-card">
              <form onSubmit={handleSubmit} className="space-y-s-4">
                <div className="space-y-s-2">
                  <Label htmlFor="fp-email">Email</Label>
                  <Input
                    id="fp-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    autoFocus
                  />
                </div>

                {error && (
                  <p
                    role="alert"
                    className="rounded-md px-s-3 py-s-2 text-[13px]"
                    style={{ background: "var(--brand-coral-soft)", color: "var(--brand-coral-press)" }}
                  >
                    {error}
                  </p>
                )}

                <div className="form-actions">
                  <button type="submit" className="btn-primary" disabled={isPending}>
                    {isPending ? "Sending…" : "Send reset link →"}
                  </button>
                </div>
              </form>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
