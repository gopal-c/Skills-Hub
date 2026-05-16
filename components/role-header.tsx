import Image from "next/image";
import Link from "next/link";
import { SignOutButton } from "@/components/sign-out-button";
import type { Role, SessionPayload } from "@/lib/auth";

const ROLE_LABEL: Record<Role, string> = {
  hr:       "HR",
  employee: "Employee",
};

const NAV: Record<Role, Array<{ href: string; label: string }>> = {
  hr: [
    { href: "/search",    label: "Search" },
    { href: "/employees", label: "Directory" },
    { href: "/review",    label: "Review" },
  ],
  employee: [
    { href: "/my-profile", label: "My profile" },
  ],
};

export function RoleHeader({ session, eyebrow }: { session: SessionPayload; eyebrow: string }) {
  const nav  = NAV[session.role];
  const home = session.role === "hr" ? "/search" : "/my-profile";

  return (
    <header className="border-b border-border-hairline bg-bg-surface">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-s-4 px-s-8 py-s-4">
        <div className="flex items-center gap-s-4">
          <Link href={home} className="flex items-center gap-s-3">
            <Image src="/assets/logo-wordmark.svg" alt="SkillsHub" width={130} height={30} />
          </Link>
          <span className="hidden text-fg-3 md:inline">/</span>
          <span className="eyebrow hidden md:inline">{eyebrow}</span>
        </div>

        <div className="flex items-center gap-s-1 text-[13px] text-fg-2">
          <nav className="mr-s-3 hidden items-center gap-s-1 md:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-s-3 py-s-1 transition-colors hover:bg-bg-sunken hover:text-fg-1"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <span className="hidden text-fg-1 md:inline">{session.name}</span>
          <span className="mx-s-2 hidden font-mono text-fg-3 md:inline">{ROLE_LABEL[session.role]}</span>
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
