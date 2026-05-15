import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-bg-dark text-fg-on-dark">
      {/* Brand glows — soft radial, screen-blended, two max per the design system */}
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
        className="pointer-events-none absolute -bottom-32 -right-24 h-[640px] w-[640px] opacity-50 mix-blend-screen"
      />

      {/* Top bar */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-s-8 py-s-6">
        <Image
          src="/assets/logo-wordmark-dark.svg"
          alt="SkillsHub"
          width={160}
          height={36}
          priority
        />
        <nav className="hidden gap-s-6 text-fg-on-dark-2 md:flex">
          <Link href="/preview" className="text-[13px] hover:text-fg-on-dark">
            Design tokens
          </Link>
        </nav>
      </header>

      {/* Hero — one focal point per screen */}
      <section className="relative z-10 mx-auto flex max-w-3xl flex-col items-start gap-s-6 px-s-8 pb-s-20 pt-s-16">
        <span className="eyebrow eyebrow-indigo" style={{ color: "var(--brand-indigo)" }}>
          01 · Skills intelligence
        </span>

        <h1 className="display-l text-fg-on-dark">
          Find the right person.
          <br />
          <span className="serif-italic" style={{ color: "var(--brand-indigo)" }}>
            In plain English.
          </span>
        </h1>

        <p className="max-w-xl text-[18px] leading-[1.55] text-fg-on-dark-2">
          Ask a question the way you&rsquo;d ask a teammate. SkillsHub reads every
          resume, learns what your people can do, and surfaces ranked matches
          &mdash; each with a reason you can trust.
        </p>

        <div className="mt-s-4 flex flex-wrap items-center gap-s-3">
          <Button size="lg" className="h-11 px-s-5 rounded-lg text-[14px]">
            Get started
          </Button>
          <Link
            href="/preview"
            className="rounded-md px-s-4 py-s-3 text-[14px] text-fg-on-dark-2 transition-colors hover:text-fg-on-dark"
          >
            See the design system &rarr;
          </Link>
        </div>

        <p className="mt-s-8 font-mono text-[11px] uppercase tracking-eyebrow text-ink-500">
          {"// hackathon · SkillsHub"}
        </p>
      </section>
    </main>
  );
}
