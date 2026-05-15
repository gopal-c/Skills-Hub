import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/* ──────────────── Token data ──────────────── */

const brandRamp = [
  { label: "indigo",       value: "#8B7BE8", cssVar: "--brand-indigo",       fg: "#fff" },
  { label: "indigo-deep",  value: "#6B58D9", cssVar: "--brand-indigo-deep",  fg: "#fff" },
  { label: "indigo-press", value: "#5947C9", cssVar: "--brand-indigo-press", fg: "#fff" },
  { label: "indigo-soft",  value: "#F1ECFD", cssVar: "--brand-indigo-soft",  fg: "#5947C9" },
  { label: "coral",        value: "#FF9A82", cssVar: "--brand-coral",        fg: "#1A1A2E" },
  { label: "coral-deep",   value: "#E87760", cssVar: "--brand-coral-deep",   fg: "#fff" },
  { label: "coral-press",  value: "#C75A45", cssVar: "--brand-coral-press",  fg: "#fff" },
  { label: "coral-soft",   value: "#FFEDE5", cssVar: "--brand-coral-soft",   fg: "#C75A45" },
  { label: "teal",         value: "#7CD3C5", cssVar: "--brand-teal",         fg: "#1A1A2E" },
  { label: "teal-deep",    value: "#5BBFB0", cssVar: "--brand-teal-deep",    fg: "#fff" },
  { label: "teal-soft",    value: "#E5F6F2", cssVar: "--brand-teal-soft",    fg: "#5BBFB0" },
  { label: "amber",        value: "#FFCB6B", cssVar: "--brand-amber",        fg: "#1A1A2E" },
  { label: "amber-deep",   value: "#E8A943", cssVar: "--brand-amber-deep",   fg: "#1A1A2E" },
  { label: "amber-soft",   value: "#FFF4DE", cssVar: "--brand-amber-soft",   fg: "#E8A943" },
];

const inkRamp = [
  { label: "ink-0",   value: "#FFFFFF" },
  { label: "ink-50",  value: "#FAFAFC" },
  { label: "ink-100", value: "#F4F4F8" },
  { label: "ink-200", value: "#E8E8F0" },
  { label: "ink-300", value: "#D4D4E0" },
  { label: "ink-400", value: "#B8B8D0" },
  { label: "ink-500", value: "#8888A0" },
  { label: "ink-600", value: "#5B5B6E" },
  { label: "ink-700", value: "#3A3A4A" },
  { label: "ink-800", value: "#1A1A2E" },
  { label: "ink-900", value: "#151634" },
];

const semanticColors = [
  { label: "--fg-1 (primary text)",        token: "var(--fg-1)" },
  { label: "--fg-2 (secondary text)",      token: "var(--fg-2)" },
  { label: "--fg-3 (tertiary / hint)",     token: "var(--fg-3)" },
  { label: "--fg-link",                    token: "var(--fg-link)" },
  { label: "--bg-page",                    token: "var(--bg-page)" },
  { label: "--bg-surface (cards)",         token: "var(--bg-surface)" },
  { label: "--bg-sunken (hover surface)",  token: "var(--bg-sunken)" },
  { label: "--bg-dark (hero / modals)",    token: "var(--bg-dark)" },
  { label: "--border-hairline",            token: "var(--border-hairline)" },
  { label: "--border-strong",              token: "var(--border-strong)" },
  { label: "--border-focus",               token: "var(--border-focus)" },
];

const radii = [
  { label: "--r-xs",   value: "4px"  },
  { label: "--r-sm",   value: "6px"  },
  { label: "--r-md",   value: "10px" },
  { label: "--r-lg",   value: "14px" },
  { label: "--r-xl",   value: "22px" },
  { label: "--r-pill", value: "999px"},
];

const spacing = [
  { label: "--s-1",  value: "4px"  },
  { label: "--s-2",  value: "8px"  },
  { label: "--s-3",  value: "12px" },
  { label: "--s-4",  value: "16px" },
  { label: "--s-5",  value: "20px" },
  { label: "--s-6",  value: "24px" },
  { label: "--s-8",  value: "32px" },
  { label: "--s-10", value: "40px" },
  { label: "--s-12", value: "48px" },
  { label: "--s-16", value: "64px" },
  { label: "--s-20", value: "80px" },
];

const shadows = [
  { label: "--shadow-1", desc: "Resting cards, inputs" },
  { label: "--shadow-2", desc: "Raised, hover lift" },
  { label: "--shadow-3", desc: "Popovers, dropdowns" },
  { label: "--shadow-4", desc: "Modals, sheets" },
];

/* ──────────────── Helpers ──────────────── */

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-b border-border-hairline px-s-8 py-s-12">
      <div className="mx-auto max-w-6xl">
        <span className="eyebrow eyebrow-indigo">{eyebrow}</span>
        <h2 className="mt-s-2 mb-s-8">{title}</h2>
        {children}
      </div>
    </section>
  );
}

function Swatch({
  label,
  value,
  fg,
}: {
  label: string;
  value: string;
  fg?: string;
}) {
  return (
    <div className="overflow-hidden rounded-md border border-border-hairline bg-bg-surface shadow-1">
      <div
        className="flex h-20 items-end p-s-3 font-mono text-[11px]"
        style={{ background: value, color: fg ?? "#1A1A2E" }}
      >
        {value.toUpperCase()}
      </div>
      <div className="px-s-3 py-s-2">
        <p className="font-mono text-[12px] text-fg-1">{label}</p>
      </div>
    </div>
  );
}

/* ──────────────── Page ──────────────── */

export default function PreviewPage() {
  return (
    <main className="min-h-screen bg-bg-page">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-border-hairline bg-bg-surface/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-s-8 py-s-4">
          <div className="flex items-center gap-s-3">
            <Image src="/assets/logo-wordmark.svg" alt="SkillsHub" width={140} height={32} />
            <span className="eyebrow">Design system</span>
          </div>
          <nav className="hidden gap-s-5 text-[13px] text-fg-2 md:flex">
            <a href="#colors" className="hover:text-fg-1">Colors</a>
            <a href="#type" className="hover:text-fg-1">Type</a>
            <a href="#spacing" className="hover:text-fg-1">Spacing</a>
            <a href="#radii" className="hover:text-fg-1">Radii</a>
            <a href="#shadows" className="hover:text-fg-1">Shadows</a>
            <a href="#buttons" className="hover:text-fg-1">Buttons</a>
            <a href="#brand" className="hover:text-fg-1">Brand</a>
          </nav>
          <Link href="/" className="text-[13px] text-fg-2 hover:text-fg-1">&larr; Home</Link>
        </div>
      </header>

      {/* Title */}
      <section className="px-s-8 py-s-12">
        <div className="mx-auto max-w-6xl">
          <span className="eyebrow">SkillsHub</span>
          <h1 className="mt-s-2 max-w-2xl">
            Design tokens, <span className="serif-italic text-indigo-deep">in motion.</span>
          </h1>
          <p className="mt-s-4 max-w-xl text-[15px] text-fg-2">
            Every color, type ramp, radius, and shadow that ships with the product.
            Source of truth lives in <code>app/globals.css</code>; utilities are exposed
            through <code>tailwind.config.ts</code>.
          </p>
        </div>
      </section>

      {/* ───────────── Colors ───────────── */}
      <Section id="colors" eyebrow="01 · Color" title="Brand palette">
        <div className="grid grid-cols-2 gap-s-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {brandRamp.map((c) => (
            <Swatch key={c.label} label={c.label} value={c.value} fg={c.fg} />
          ))}
        </div>

        <h3 className="mt-s-12 mb-s-4">Neutrals — cool / violet-tinted</h3>
        <div className="grid grid-cols-2 gap-s-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {inkRamp.map((c) => (
            <Swatch
              key={c.label}
              label={c.label}
              value={c.value}
              fg={["ink-700", "ink-800", "ink-900", "ink-600", "ink-500"].includes(c.label) ? "#fff" : "#1A1A2E"}
            />
          ))}
        </div>

        <h3 className="mt-s-12 mb-s-4">Semantic roles</h3>
        <div className="grid grid-cols-1 gap-s-3 md:grid-cols-2">
          {semanticColors.map((c) => (
            <div
              key={c.label}
              className="flex items-center gap-s-4 rounded-md border border-border-hairline bg-bg-surface p-s-3 shadow-1"
            >
              <span
                className="h-10 w-10 flex-shrink-0 rounded-sm border border-border-hairline"
                style={{ background: c.token }}
              />
              <p className="font-mono text-[12px] text-fg-1">{c.label}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ───────────── Typography ───────────── */}
      <Section id="type" eyebrow="02 · Type" title="Three families, one clear job each">
        <div className="grid gap-s-8 md:grid-cols-2">
          <div className="space-y-s-4">
            <span className="eyebrow">Display — Instrument Serif</span>
            <p className="display-l">Skills, explained.</p>
            <p className="display-m serif-italic text-indigo-deep">In plain English.</p>
          </div>

          <div className="space-y-s-4">
            <span className="eyebrow">UI — Geist</span>
            <h1>The h1 — 40/1.1 600</h1>
            <h2>The h2 — 30/1.2 600</h2>
            <h3>The h3 — 22/1.3 600</h3>
            <h4>The h4 — 17/1.35 600</h4>
            <p style={{ font: "var(--t-body-l)" }}>
              Body large — Ask a question the way you&rsquo;d ask a teammate.
            </p>
            <p>Body — Default for product copy. 15/1.55 400.</p>
            <small>Small — supporting metadata, captions.</small>
          </div>
        </div>

        <div className="mt-s-10 grid gap-s-6 md:grid-cols-2">
          <div className="space-y-s-3">
            <span className="eyebrow">Mono — Geist Mono</span>
            <p style={{ font: "var(--t-mono)" }}>0.92 match · senior · bangalore</p>
            <p style={{ font: "var(--t-mono-s)" }}>{"// hackathon · team"}</p>
            <span className="eyebrow eyebrow-coral">01 · The problem</span>
          </div>
          <div className="space-y-s-3">
            <span className="eyebrow">Label / caption</span>
            <p style={{ font: "var(--t-label)" }}>Label — form fields, nav, dense rows</p>
            <p style={{ font: "var(--t-caption)" }}>Caption — secondary metadata</p>
          </div>
        </div>
      </Section>

      {/* ───────────── Spacing ───────────── */}
      <Section id="spacing" eyebrow="03 · Spacing" title="Strict 4px base">
        <div className="space-y-s-2">
          {spacing.map((s) => (
            <div key={s.label} className="flex items-center gap-s-4">
              <span className="w-24 font-mono text-[12px] text-fg-2">{s.label}</span>
              <span className="w-16 font-mono text-[12px] text-fg-2">{s.value}</span>
              <span
                className="h-5 rounded-sm bg-indigo"
                style={{ width: s.value }}
              />
            </div>
          ))}
        </div>
      </Section>

      {/* ───────────── Radii ───────────── */}
      <Section id="radii" eyebrow="04 · Radii" title="From hairline chips to hero cards">
        <div className="grid grid-cols-2 gap-s-4 md:grid-cols-3 lg:grid-cols-6">
          {radii.map((r) => (
            <div key={r.label} className="flex flex-col items-center gap-s-2">
              <div
                className="h-20 w-20 border border-indigo-deep bg-indigo-soft"
                style={{ borderRadius: r.value }}
              />
              <p className="font-mono text-[12px] text-fg-1">{r.label}</p>
              <p className="font-mono text-[11px] text-fg-2">{r.value}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ───────────── Shadows ───────────── */}
      <Section id="shadows" eyebrow="05 · Shadows" title="Indigo-tinted, never neutral grey">
        <div className="grid grid-cols-1 gap-s-6 md:grid-cols-2 lg:grid-cols-4">
          {shadows.map((s) => (
            <div
              key={s.label}
              className="rounded-lg bg-bg-surface p-s-5"
              style={{ boxShadow: `var(${s.label})` }}
            >
              <p className="font-mono text-[12px] text-fg-1">{s.label}</p>
              <p className="mt-s-1 text-[12px] text-fg-2">{s.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ───────────── Buttons ───────────── */}
      <Section id="buttons" eyebrow="06 · Components" title="Buttons">
        <div className="rounded-lg border border-border-hairline bg-bg-surface p-s-6 shadow-1">
          <p className="eyebrow mb-s-4">Variants</p>
          <div className="flex flex-wrap items-center gap-s-3">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
          </div>

          <p className="eyebrow mb-s-4 mt-s-8">Sizes</p>
          <div className="flex flex-wrap items-end gap-s-3">
            <Button size="xs">Extra small</Button>
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
          </div>

          <p className="eyebrow mb-s-4 mt-s-8">States</p>
          <div className="flex flex-wrap items-center gap-s-3">
            <Button>Idle</Button>
            <Button disabled>Disabled</Button>
          </div>
        </div>
      </Section>

      {/* ───────────── Brand ───────────── */}
      <Section id="brand" eyebrow="07 · Brand" title="Logo lockups">
        <div className="grid gap-s-6 md:grid-cols-2">
          <div className="flex h-40 items-center justify-center rounded-lg border border-border-hairline bg-bg-surface shadow-1">
            <Image src="/assets/logo-wordmark.svg" alt="SkillsHub" width={220} height={48} />
          </div>
          <div className="relative flex h-40 items-center justify-center overflow-hidden rounded-lg bg-bg-dark shadow-3">
            <Image
              src="/assets/glow-teal.png"
              alt=""
              aria-hidden
              width={400}
              height={400}
              className="pointer-events-none absolute -right-16 -top-16 h-[400px] w-[400px] opacity-60 mix-blend-screen"
            />
            <Image
              src="/assets/logo-wordmark-dark.svg"
              alt="SkillsHub"
              width={220}
              height={48}
              className="relative z-10"
            />
          </div>
        </div>

        <h3 className="mt-s-10 mb-s-4">Brand glows</h3>
        <p className="mb-s-6 max-w-2xl text-[14px] text-fg-2">
          Soft radial color glows are the brand&rsquo;s signature illustration style.
          On dark backgrounds, use <code>mix-blend-mode: screen</code> for the luminous effect.
          Never more than two glows in the same composition.
        </p>
        <div className="grid grid-cols-2 gap-s-4 md:grid-cols-4">
          {["indigo", "coral", "teal", "amber"].map((g) => (
            <div
              key={g}
              className="relative h-40 overflow-hidden rounded-lg bg-bg-dark"
            >
              <Image
                src={`/assets/glow-${g}.png`}
                alt=""
                aria-hidden
                width={400}
                height={400}
                className="absolute inset-0 h-full w-full object-cover mix-blend-screen"
              />
              <span className="absolute bottom-s-3 left-s-3 font-mono text-[11px] uppercase tracking-eyebrow text-fg-on-dark">
                glow-{g}
              </span>
            </div>
          ))}
        </div>
      </Section>

      <footer className="px-s-8 py-s-10">
        <div className="mx-auto max-w-6xl">
          <p className="font-mono text-[11px] uppercase tracking-eyebrow text-ink-500">
            {"// SkillsHub design system · single source of truth: app/globals.css"}
          </p>
        </div>
      </footer>
    </main>
  );
}
