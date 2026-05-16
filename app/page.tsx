import Image from "next/image";
import Link from "next/link";
import { RoleButtons } from "@/components/role-buttons";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-bg-dark text-fg-on-dark">
      <Image
        src="/assets/glow-indigo.png"
        alt=""
        aria-hidden
        width={720}
        height={720}
        priority
        className="pointer-events-none absolute -top-40 -left-40 h-[720px] w-[720px] opacity-60 mix-blend-screen"
      />
      <Image
        src="/assets/glow-coral.png"
        alt=""
        aria-hidden
        width={640}
        height={640}
        priority
        className="pointer-events-none absolute -bottom-40 -right-32 h-[640px] w-[640px] opacity-50 mix-blend-screen"
      />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-s-8 py-s-6">
        <Image src="/assets/logo-wordmark-dark.svg" alt="SkillsHub" width={160} height={36} priority />
        <Link href="/preview" className="text-[13px] text-fg-on-dark-2 hover:text-fg-on-dark">
          Design tokens
        </Link>
      </header>

      <section className="relative z-10 mx-auto flex max-w-3xl flex-col items-start px-s-8 pb-s-12 pt-s-16">
        <span className="eyebrow" style={{ color: "var(--brand-indigo)" }}>
          00 · Skills intelligence
        </span>
        <h1 className="mt-s-3 text-fg-on-dark">
          Two ways in. <span className="serif-italic" style={{ color: "var(--brand-indigo)" }}>Pick yours.</span>
        </h1>
        <p className="mt-s-4 max-w-xl text-[18px] leading-[1.55] text-fg-on-dark-2">
          Search the directory in plain English &mdash; or drop a resume and let us
          extract your skills.
        </p>
      </section>

      <RoleButtons />

      <footer className="relative z-10 mx-auto max-w-6xl px-s-8 pb-s-8">
        <p className="font-mono text-[11px] uppercase tracking-eyebrow text-ink-500">
          {"// hackathon · SkillsHub"}
        </p>
      </footer>
    </main>
  );
}
