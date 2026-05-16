import Image from "next/image";
import Link from "next/link";
import { enterAs } from "@/app/actions/role";

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

      <section className="relative z-10 mx-auto grid max-w-3xl gap-s-4 px-s-8 pb-s-20 md:grid-cols-2">
        {/* HR card */}
        <form action={enterAs.bind(null, "hr")}>
          <button
            type="submit"
            className="group relative flex h-full w-full flex-col items-start gap-s-4 overflow-hidden rounded-xl bg-bg-surface p-s-6 text-left shadow-3 transition-all duration-base ease-out hover:-translate-y-px hover:shadow-4"
          >
            <Image
              src="/assets/glow-indigo.png"
              alt=""
              aria-hidden
              width={280}
              height={280}
              className="pointer-events-none absolute -right-16 -top-16 h-[280px] w-[280px] opacity-35"
            />
            <span className="eyebrow eyebrow-indigo relative">HR · Hiring</span>
            <h3 className="relative text-fg-1">
              Find the right person, <span className="serif-italic" style={{ color: "var(--brand-indigo-deep)" }}>fast.</span>
            </h3>
            <p className="relative text-[14px] text-fg-2">
              Ask in plain English. Get ranked matches with a reason for each.
            </p>
            <span className="relative mt-auto inline-flex items-center gap-s-2 text-[13px] font-medium text-indigo-deep transition-transform duration-base group-hover:translate-x-1">
              Enter as HR &rarr;
            </span>
          </button>
        </form>

        {/* Employee card */}
        <form action={enterAs.bind(null, "employee")}>
          <button
            type="submit"
            className="group relative flex h-full w-full flex-col items-start gap-s-4 overflow-hidden rounded-xl bg-bg-surface p-s-6 text-left shadow-3 transition-all duration-base ease-out hover:-translate-y-px hover:shadow-4"
          >
            <Image
              src="/assets/glow-coral.png"
              alt=""
              aria-hidden
              width={280}
              height={280}
              className="pointer-events-none absolute -right-16 -top-16 h-[280px] w-[280px] opacity-35"
            />
            <span className="eyebrow eyebrow-coral relative">Employee</span>
            <h3 className="relative text-fg-1">
              Show what you can do, <span className="serif-italic" style={{ color: "var(--brand-coral-deep)" }}>in seconds.</span>
            </h3>
            <p className="relative text-[14px] text-fg-2">
              Drop a resume. We&rsquo;ll extract your skills, projects, and proficiency.
            </p>
            <span className="relative mt-auto inline-flex items-center gap-s-2 text-[13px] font-medium text-coral-deep transition-transform duration-base group-hover:translate-x-1">
              Enter as Employee &rarr;
            </span>
          </button>
        </form>
      </section>

      <footer className="relative z-10 mx-auto max-w-6xl px-s-8 pb-s-8">
        <p className="font-mono text-[11px] uppercase tracking-eyebrow text-ink-500">
          {"// hackathon · SkillsHub"}
        </p>
      </footer>
    </main>
  );
}
