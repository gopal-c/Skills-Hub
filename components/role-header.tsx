import Link from "next/link";
import { SignOutButton } from "@/components/sign-out-button";
import { ProfileAvatar } from "@/components/profile-avatar";
import { RoleNavLinks } from "@/components/role-nav-links";
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
  ],
  employee: [
    { href: "/me",     label: "My Profile" },
    { href: "/upload", label: "Upload Resume" },
  ],
};

export function RoleHeader({ session, eyebrow }: { session: SessionPayload; eyebrow: string }) {
  const nav  = NAV[session.role];
  const home = session.role === "hr" ? "/search" : "/me";

  return (
    <header
      className="themed-topbar flex items-center gap-s-4 px-s-8 py-s-3"
      style={{ position: "sticky", top: 0, zIndex: 10 }}
    >
      <div className="flex items-center gap-s-3">
        <Link href={home} className="flex items-center">
          {/* Both logos render; CSS shows the one for the active theme. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="theme-logo-light" src="/assets/logo-wordmark.svg" alt="SkillsHub" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="theme-logo-dark"  src="/assets/logo-wordmark-dark.svg" alt="SkillsHub" />
        </Link>
        <span className="divider hidden md:inline">/</span>
        <span
          className="crumb font-mono text-[11px] uppercase hidden md:inline"
          style={{ letterSpacing: "var(--tracking-eyebrow)" }}
        >
          {eyebrow}
        </span>
      </div>

      <div className="ml-auto flex items-center gap-s-3 text-[13px]" style={{ color: "var(--t-fg-1)" }}>
        <RoleNavLinks items={nav} />
        <div className="hidden h-6 w-px md:block" style={{ background: "var(--t-bar-divider)" }} />
        <div className="flex items-center gap-s-2">
          <ProfileAvatar name={session.name} className="size-8" />
          <span className="hidden md:inline">{session.name}</span>
        </div>
        <span
          className="hidden font-mono uppercase text-[11px] md:inline"
          style={{ letterSpacing: "var(--tracking-eyebrow)", color: "var(--t-fg-2)" }}
        >
          {ROLE_LABEL[session.role]}
        </span>
        <SignOutButton />
      </div>
    </header>
  );
}
