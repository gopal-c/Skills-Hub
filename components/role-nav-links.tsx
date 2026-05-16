"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string };

export function RoleNavLinks({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  function isActive(href: string): boolean {
    if (pathname === href) return true;
    return pathname.startsWith(href + "/");
  }

  return (
    <nav className="hidden items-center gap-s-1 md:flex" aria-label="Primary">
      {items.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-md px-s-3 py-s-1 text-[13px] transition-colors duration-fast",
              active && "font-medium",
            )}
            style={
              active
                ? { color: "var(--t-accent-soft)" }
                : { color: "var(--t-fg-2)" }
            }
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
