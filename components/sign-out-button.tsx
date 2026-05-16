"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function signOut() {
    startTransition(async () => {
      try {
        await fetch("/api/logout", { method: "POST" });
      } catch {
        // best-effort; cookie maxAge=0 from server is the goal
      }
      router.push("/");
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={isPending}
      data-signout
      className="rounded-md px-s-2 py-s-1 text-[13px] text-fg-2 transition-colors hover:bg-bg-sunken hover:text-fg-1 disabled:opacity-50"
    >
      {isPending ? "Signing out…" : "Sign out"}
    </button>
  );
}
