import Image from "next/image";
import Link from "next/link";
import { SignOutButton } from "@/components/sign-out-button";
import { ProfileAvatar } from "@/components/profile-avatar";
import { RoleNavLinks } from "@/components/role-nav-links";
import type { Role, SessionPayload } from "@/lib/auth";

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
    <header className="border-b border-border-hairline bg-bg-surface">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-s-4 px-s-8 py-s-3">
        <div className="flex items-center gap-s-4">
          <Link href={home} className="flex items-center gap-s-3">
            <Image src="/assets/logo-wordmark.svg" alt="SkillsHub" width={130} height={30} priority />
          </Link>
          <span className="hidden text-fg-3 md:inline">/</span>
          <span className="eyebrow hidden md:inline">{eyebrow}</span>
        </div>

        <div className="flex items-center gap-s-3">
          <RoleNavLinks items={nav} />
          <div className="hidden h-6 w-px bg-border-hairline md:block" />
          <div className="flex items-center gap-s-2">
            <ProfileAvatar name={session.name} email={session.email} className="size-8" />
            <span className="hidden text-[13px] text-fg-1 md:inline">{session.name}</span>
          </div>
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
