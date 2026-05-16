"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prefillEmail: string;
};

const ROLE_HOME: Record<"hr" | "employee", string> = {
  hr:       "/search",
  employee: "/upload",
};

export function LoginModal({ open, onOpenChange, prefillEmail }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState(prefillEmail);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Reset email + clear state whenever the modal is opened with a new pre-fill.
  useEffect(() => {
    if (open) {
      setEmail(prefillEmail);
      setPassword("");
      setError(null);
    }
  }, [open, prefillEmail]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/login", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!data.ok) {
          setError(data.error ?? "Login failed.");
          return;
        }
        toast.success("Welcome back.");
        onOpenChange(false);
        const target = ROLE_HOME[data.role as "hr" | "employee"];
        router.push(target);
        router.refresh();
      } catch {
        setError("Network error — try again.");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign in</DialogTitle>
          <DialogDescription>
            Use your SkillsHub account to continue.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-s-4">
          <div className="space-y-s-2">
            <Label htmlFor="login-email">Email</Label>
            <Input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@demo.com"
              autoComplete="email"
              autoFocus
            />
          </div>

          <div className="space-y-s-2">
            <Label htmlFor="login-password">Password</Label>
            <Input
              id="login-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              autoComplete="current-password"
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

          <p className="rounded-md border border-border-hairline bg-bg-sunken px-s-3 py-s-2 text-[12px] text-fg-2">
            <span className="font-mono">Demo creds:</span> hr@demo.com or employee@demo.com &middot; password <span className="font-mono">Demo@123</span>
          </p>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Signing in…" : "Sign in"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
