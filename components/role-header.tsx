import Image from "next/image";
import Link from "next/link";
import { clearRole } from "@/app/actions/role";
import type { Role } from "@/lib/auth";

const ROLE_LABEL: Record<Role, string> = {
  hr:       "HR",
  employee: "Employee",
};

export function RoleHeader({ role, eyebrow }: { role: Role; eyebrow: string }) {
  return (
    <header className="border-b border-border-hairline bg-bg-surface">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-s-4 px-s-8 py-s-4">
        <div className="flex items-center gap-s-4">
          <Link href="/" className="flex items-center gap-s-3">
            <Image src="/assets/logo-wordmark.svg" alt="SkillsHub" width={130} height={30} />
          </Link>
          <span className="hidden text-fg-3 md:inline">/</span>
          <span className="eyebrow hidden md:inline">{eyebrow}</span>
        </div>
        <div className="flex items-center gap-s-4 text-[13px] text-fg-2">
          <span className="hidden font-mono md:inline">role: {ROLE_LABEL[role]}</span>
          <Link
            href="/employees"
            className="hidden rounded-md px-s-2 py-s-1 hover:bg-bg-sunken hover:text-fg-1 md:inline"
          >
            Directory
          </Link>
          <form action={clearRole}>
            <button
              type="submit"
              className="rounded-md px-s-2 py-s-1 transition-colors hover:bg-bg-sunken hover:text-fg-1"
            >
              Switch role
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
