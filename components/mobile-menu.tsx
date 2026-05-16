"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { SignOutButton } from "@/components/sign-out-button";
import type { SessionPayload } from "@/lib/auth";

type NavItem = { href: string; label: string };

export function MobileMenu({
  session,
  items,
  roleLabel,
}: {
  session: SessionPayload;
  items: NavItem[];
  roleLabel: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close on route change.
  useEffect(() => { setOpen(false); }, [pathname]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function isActive(href: string): boolean {
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <>
      <button
        type="button"
        className="inline-flex h-9 w-9 items-center justify-center rounded-md md:hidden"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="role-mobile-menu"
        style={{ color: "var(--t-fg-1)" }}
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      {open && (
        <div
          id="role-mobile-menu"
          className="absolute left-0 right-0 top-full z-20 md:hidden"
          style={{
            background: "var(--t-bar-bg)",
            borderBottom: "var(--t-bar-border)",
            backdropFilter: "saturate(160%) blur(22px)",
            WebkitBackdropFilter: "saturate(160%) blur(22px)",
          }}
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-s-1 px-s-8 py-s-4">
            {items.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className="rounded-md px-s-3 py-s-2 text-[14px] transition-colors"
                  style={{
                    color: active ? "var(--t-accent-soft)" : "var(--t-fg-2)",
                    fontWeight: active ? 500 : 400,
                  }}
                >
                  {item.label}
                </Link>
              );
            })}

            <div
              className="mt-s-2 flex items-center justify-between gap-s-3 border-t pt-s-3"
              style={{ borderColor: "var(--t-bar-divider)" }}
            >
              <div className="flex flex-col px-s-3">
                <span className="text-[13px]" style={{ color: "var(--t-fg-1)" }}>
                  {session.name}
                </span>
                <span
                  className="font-mono text-[11px] uppercase"
                  style={{ letterSpacing: "var(--tracking-eyebrow)", color: "var(--t-fg-2)" }}
                >
                  {roleLabel}
                </span>
              </div>
              <SignOutButton />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
