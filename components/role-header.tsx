import Image from "next/image";
import Link from "next/link";
import { SignOutButton } from "@/components/sign-out-button";
import type { SessionPayload } from "@/lib/auth";

const ROLE_LABEL: Record<SessionPayload["role"], string> = {
  hr:       "HR",
  employee: "Employee",
};

export function RoleHeader({ session, eyebrow }: { session: SessionPayload; eyebrow: string }) {
  return (
    <header className="border-b border-border-hairline bg-bg-surface">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-s-4 px-s-8 py-s-4">
        <div className="flex items-center gap-s-4">
          <Link href={session.role === "hr" ? "/search" : "/upload"} className="flex items-center gap-s-3">
            <Image src="/assets/logo-wordmark.svg" alt="SkillsHub" width={130} height={30} />
          </Link>
          <span className="hidden text-fg-3 md:inline">/</span>
          <span className="eyebrow hidden md:inline">{eyebrow}</span>
        </div>
        <div className="flex items-center gap-s-4 text-[13px] text-fg-2">
          <span className="hidden text-fg-1 md:inline">{session.name}</span>
          <span className="hidden font-mono text-fg-3 md:inline">{ROLE_LABEL[session.role]}</span>
          <Link
            href="/employees"
            className="hidden rounded-md px-s-2 py-s-1 hover:bg-bg-sunken hover:text-fg-1 md:inline"
          >
            Directory
          </Link>
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
