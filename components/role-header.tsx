import Link from "next/link";
import { SignOutButton } from "@/components/sign-out-button";
import { ProfileAvatar } from "@/components/profile-avatar";
import { RoleNavLinks } from "@/components/role-nav-links";
import { MobileMenu } from "@/components/mobile-menu";
import type { Role, SessionPayload } from "@/lib/auth";

const ROLE_LABEL: Record<Role, string> = {
  hr:       "HR",
  employee: "Employee",
};

const NAV: Record<Role, Array<{ href: string; label: string }>> = {
  hr: [
    { href: "/search",    label: "Search" },
    { href: "/employees", label: "Directory" },
    { href: "/review",    label: "Review Queue" },
    { href: "/onboard",   label: "Onboard" },
  ],
  employee: [
    { href: "/me",     label: "My Profile" },
    { href: "/upload", label: "Update Resume" },
  ],
};

export function RoleHeader({ session, eyebrow }: { session: SessionPayload; eyebrow: string }) {
  const nav  = NAV[session.role];
  const home = session.role === "hr" ? "/search" : "/me";

  return (
    <header className="themed-topbar">
      <div className="mx-auto flex max-w-6xl items-center gap-s-4 px-s-8 py-s-3">
        <div className="flex min-w-0 items-center gap-s-3">
          <Link href={home} className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="theme-logo-light" src="/assets/logo-wordmark.svg" alt="SkillsHub" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="theme-logo-dark"  src="/assets/logo-wordmark-dark.svg" alt="SkillsHub" />
          </Link>
          <span className="divider hidden md:inline">/</span>
          <span
            className="crumb hidden truncate font-mono text-[11px] uppercase md:inline"
            style={{ letterSpacing: "var(--tracking-eyebrow)" }}
          >
            {eyebrow}
          </span>
        </div>

        {/* Desktop nav + identity */}
        <div className="ml-auto hidden items-center gap-s-3 text-[13px] md:flex" style={{ color: "var(--t-fg-1)" }}>
          <RoleNavLinks items={nav} />
          <div className="h-6 w-px" style={{ background: "var(--t-bar-divider)" }} />
          <div className="flex items-center gap-s-2">
            <ProfileAvatar name={session.name} className="size-8" />
            <span>{session.name}</span>
          </div>
          <span
            className="font-mono text-[11px] uppercase"
            style={{ letterSpacing: "var(--tracking-eyebrow)", color: "var(--t-fg-2)" }}
          >
            {ROLE_LABEL[session.role]}
          </span>
          <SignOutButton />
        </div>

        {/* Mobile: avatar + hamburger */}
        <div className="ml-auto flex items-center gap-s-2 md:hidden">
          <ProfileAvatar name={session.name} className="size-8" />
          <MobileMenu session={session} items={nav} roleLabel={ROLE_LABEL[session.role]} />
        </div>
      </div>
    </header>
  );
}
