"use client";

import { Suspense, useState, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/reset-password", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ token, password, confirmPassword }),
        });
        const data = await res.json();
        if (!data.ok) {
          setError(data.error ?? "Couldn't reset your password.");
          return;
        }
        toast.success("Password updated. Sign in with your new password.");
        router.push("/");
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
        <h1 className="page-title">Set a new password.</h1>
        <p className="page-sub">Choose something you haven&rsquo;t used before.</p>

        <section className="form-card">
          {!token ? (
            <p className="lede">
              This link is missing its token. Request a new one from{" "}
              <Link href="/forgot-password" className="underline">forgot password</Link>.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-s-4">
              <div className="space-y-s-2">
                <Label htmlFor="rp-password">New password</Label>
                <Input
                  id="rp-password"
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  autoFocus
                />
              </div>
              <div className="space-y-s-2">
                <Label htmlFor="rp-confirm">Confirm new password</Label>
                <Input
                  id="rp-confirm"
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
                  {isPending ? "Saving…" : "Reset password →"}
                </button>
              </div>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}
