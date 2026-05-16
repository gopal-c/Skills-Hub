"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error ?? "Login failed.");
        return;
      }
      router.push(nextPath ?? data.redirectTo);
      router.refresh();
    });
  }

  function fillDemo(role: "hr" | "employee") {
    setEmail(role === "hr" ? "hr@demo.com" : "employee@demo.com");
    setPassword("demo");
    setError(null);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-bg-dark">
      {/* Single brand glow per spec */}
      <Image
        src="/assets/glow-indigo.png"
        alt=""
        aria-hidden
        width={720}
        height={720}
        priority
        className="pointer-events-none absolute -top-32 -left-40 h-[720px] w-[720px] opacity-60 mix-blend-screen"
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-md flex-col justify-center px-s-6 py-s-12">
        <Link href="/" className="mb-s-10 inline-block">
          <Image src="/assets/logo-wordmark-dark.svg" alt="SkillsHub" width={140} height={32} />
        </Link>

        <span className="eyebrow text-fg-on-dark-2">Sign in</span>
        <h1 className="mt-s-2 text-fg-on-dark">
          Welcome back. <span className="serif-italic" style={{ color: "var(--brand-indigo)" }}>Let&rsquo;s find them.</span>
        </h1>
        <p className="mt-s-3 text-[15px] text-fg-on-dark-2">
          Sign in to search your skills directory or upload your resume.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-s-8 rounded-lg border border-border-hairline bg-bg-surface p-s-6 shadow-3"
        >
          <label className="block">
            <span className="eyebrow">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@demo.com"
              autoComplete="email"
              autoFocus
              className="mt-s-2 block w-full rounded-md border border-border-strong bg-bg-surface px-s-3 py-s-3 text-[15px] text-fg-1 outline-none transition-all duration-base focus:border-border-focus focus:shadow-focus"
            />
          </label>

          <label className="mt-s-5 block">
            <span className="eyebrow">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="demo"
              autoComplete="current-password"
              className="mt-s-2 block w-full rounded-md border border-border-strong bg-bg-surface px-s-3 py-s-3 text-[15px] text-fg-1 outline-none transition-all duration-base focus:border-border-focus focus:shadow-focus"
            />
          </label>

          {error && (
            <p
              role="alert"
              className="mt-s-4 rounded-md px-s-3 py-s-2 text-[13px]"
              style={{ background: "var(--brand-coral-soft)", color: "var(--brand-coral-press)" }}
            >
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={isPending}
            className="mt-s-6 h-11 w-full rounded-lg text-[14px]"
          >
            {isPending ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <div className="mt-s-6 rounded-md border border-border-hairline bg-bg-surface/95 p-s-4 backdrop-blur">
          <p className="eyebrow mb-s-2">Demo accounts</p>
          <div className="flex flex-col gap-s-2 text-[13px] text-fg-2">
            <button
              type="button"
              onClick={() => fillDemo("hr")}
              className="flex items-center justify-between rounded-sm px-s-2 py-s-1 text-left transition-colors hover:bg-bg-sunken"
            >
              <span><span className="font-mono text-fg-1">hr@demo.com</span> &middot; password <span className="font-mono">demo</span></span>
              <span className="text-fg-3">use &rarr;</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemo("employee")}
              className="flex items-center justify-between rounded-sm px-s-2 py-s-1 text-left transition-colors hover:bg-bg-sunken"
            >
              <span><span className="font-mono text-fg-1">employee@demo.com</span> &middot; password <span className="font-mono">demo</span></span>
              <span className="text-fg-3">use &rarr;</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
