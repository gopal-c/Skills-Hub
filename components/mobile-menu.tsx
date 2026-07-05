"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { SignOutButton } from "@/components/sign-out-button";
import type { SessionPayload } from "@/lib/auth";
import type { NavItem } from "@/components/role-nav-links";

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
            background: "#FFFFFF",
            color: "var(--ink-800)",
            borderBottom: "1px solid rgba(232, 232, 240, 0.9)",
            boxShadow: "0 12px 30px -14px rgba(21, 22, 52, 0.18)",
            // Override theme fg/bg vars so descendants using text-fg-* render
            // correctly on a white drawer regardless of the page theme.
            ["--fg-1" as string]: "var(--ink-800)",
            ["--fg-2" as string]: "var(--ink-600)",
            ["--bg-sunken" as string]: "var(--ink-100)",
          } as React.CSSProperties}
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-s-1 px-s-8 py-s-4">
            {items.map((item) => {
              const active = isActive(item.href);

              if (item.disabled) {
                return (
                  <span
                    key={item.href}
                    className="cursor-not-allowed rounded-md px-s-3 py-s-2 text-[14px] opacity-50"
                    style={{ color: "var(--ink-600)" }}
                    title="Available once your account is approved"
                  >
                    {item.label}
                  </span>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className="rounded-md px-s-3 py-s-2 text-[14px] transition-colors"
                  style={{
                    color: active ? "var(--brand-indigo-deep)" : "var(--ink-600)",
                    fontWeight: active ? 500 : 400,
                  }}
                >
                  {item.label}
                </Link>
              );
            })}

            <div
              className="mt-s-2 flex items-center justify-between gap-s-3 border-t pt-s-3"
              style={{ borderColor: "var(--ink-200)" }}
            >
              <div className="flex flex-col px-s-3">
                <span className="text-[13px]" style={{ color: "var(--ink-800)" }}>
                  {session.name}
                </span>
                <span
                  className="font-mono text-[11px] uppercase"
                  style={{ letterSpacing: "var(--tracking-eyebrow)", color: "var(--ink-600)" }}
                >
                  {roleLabel}
                </span>
              </div>
              <span style={{ color: "var(--ink-600)" }}><SignOutButton /></span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
