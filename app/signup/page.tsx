"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WORK_EMAIL_DOMAIN } from "@/lib/domain";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ emailSent: boolean } | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/signup", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ name, email, password, confirmPassword }),
        });
        const data = await res.json();
        if (!data.ok) {
          setError(data.error ?? "Couldn't sign up.");
          return;
        }
        setDone({ emailSent: data.emailSent });
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

      <main className="upload-v2 relative z-[1] mx-auto max-w-[520px] px-s-8 pb-s-20 pt-s-8">
        {done ? (
          <section className="form-card text-center">
            <h2>Check your inbox</h2>
            <p className="lede">
              If <span style={{ color: "var(--ink-800)" }}>{email}</span> can sign up, we&rsquo;ve sent a
              verification link. It expires in 24 hours.
            </p>
            {!done.emailSent && (
              <p className="lede" style={{ color: "var(--brand-coral-press)" }}>
                We couldn&rsquo;t confirm the email sent — if nothing arrives in a few minutes, try
                the <Link href="/verify-email" className="underline">resend link</Link>.
              </p>
            )}
            <div className="form-actions">
              <Link href="/" className="btn-primary">Back to home</Link>
            </div>
          </section>
        ) : (
          <>
            <h1 className="page-title">Create your account.</h1>
            <p className="page-sub">
              Work email only ({WORK_EMAIL_DOMAIN}). We&rsquo;ll verify it, then HR reviews your account
              before it goes live.
            </p>

            <section className="form-card">
              <form onSubmit={handleSubmit} className="space-y-s-4">
                <div className="space-y-s-2">
                  <Label htmlFor="signup-name">Name</Label>
                  <Input id="signup-name" required value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
                </div>
                <div className="space-y-s-2">
                  <Label htmlFor="signup-email">Work email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={`you${WORK_EMAIL_DOMAIN}`}
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-s-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                </div>
                <div className="space-y-s-2">
                  <Label htmlFor="signup-confirm">Confirm password</Label>
                  <Input
                    id="signup-confirm"
                    type="password"
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
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
                    {isPending ? "Creating account…" : "Create account →"}
                  </button>
                </div>
              </form>
            </section>

            <p className="mt-s-4 text-[13px]" style={{ color: "var(--t-fg-2)" }}>
              Already have an account? <Link href="/" className="underline">Sign in</Link>
            </p>
          </>
        )}
      </main>
    </div>
  );
}
