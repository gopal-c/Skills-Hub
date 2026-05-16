# SkillsHub Design System

An AI-powered skills intelligence platform for HR teams. SkillsHub ingests
resumes, extracts skills with Gemini, and answers natural-language questions
like *"Who knows React AND has worked on payment integrations?"* with ranked,
explainable matches.

This design system is the source of truth for SkillsHub's brand, visual
language, and product UI.

---

## Source materials

- **Hackathon pitch deck** — `uploads/extra_assets-1778858750800.pptx`
  - 7 slides: Problem, Approach, What we built, Architecture, Honesty, What's next
  - Color palette + orb-glow illustration motif extracted from this deck
- **Product brief from intake form** — see `Setting up the Hackathon-Skills-Hub` form answers
  - Audience: mixed (HR leads + their managers + sponsors); warm but credible
  - Visual direction: *Microsoft Design — Vibrant Evolution* (referenced)
  - Fidelity: quick brand kit — logo, colors, type, one demo screen

> No codebase, Figma file, or existing logo was provided. The mark is a
> **placeholder** — derived from the deck's four-orb motif. Replace when
> the brand is finalized.

---

## What's in this folder

```
SkillsHub Design System/
├── README.md                       ← you are here
├── SKILL.md                        ← Claude Code agent skill entrypoint
├── colors_and_type.css             ← all design tokens (CSS variables)
├── assets/
│   ├── logo-mark.svg               ← mark, four-colour vertical gradient
│   ├── logo-mark-light.svg         ← mono-white variant for dark surfaces
│   ├── logo-wordmark.svg           ← lockup (light surface)
│   ├── logo-wordmark-dark.svg      ← lockup (dark surface)
│   ├── glow-indigo.png             ← brand orb illustration
│   ├── glow-coral.png
│   ├── glow-teal.png
│   └── glow-amber.png
├── preview/                        ← Design System tab cards
│   ├── colors-*.html
│   ├── type-*.html
│   ├── spacing-*.html
│   ├── components-*.html
│   └── brand-*.html
└── ui_kits/
    └── web-app/
        ├── README.md
        ├── theme.css               ← light + dark theme tokens (data-theme)
        ├── directory.html          ← HR card grid (frosted)
        ├── directory-v2.html       ← HR ID-badge grid (avatar-first)
        ├── profile.html            ← employee detail page
        ├── search.html             ← natural-language search + results
        ├── upload.html             ← employee resume upload (light)
        ├── upload-v2.html          ← same as upload.html, dark theme
        ├── upload.css
        └── index.html + *.jsx      ← first sidebar demo (React)
```

---

## Content fundamentals

SkillsHub copy is **direct, warm, and confident**. It speaks like a competent
colleague — not a corporate brochure, not a quirky startup.

### Voice rules

- **You-first.** Address HR leads as "you." Avoid "users" or "customers."
- **Plain English over jargon.** The product is AI-powered, but copy never
  says "AI-powered" gratuitously. Talk about what it *does*: *"Ask a question
  in plain English. Get ranked candidates with a reason for each match."*
- **Lowercase tags, sentence-case titles.** Section labels use mono-uppercase
  tracking (`01 · THE PROBLEM`). Everything else is sentence case.
- **Short sentences. Often single-clause. Period.** Builds rhythm.
- **Quotes are conversational.** When demonstrating a query, use the way
  someone actually talks: *"Who knows React AND has worked on payment
  integrations?"* — not *"react developers with payment integration experience."*
- **Em dashes and ampersands are welcome.** They give copy texture.
  *"Smart ingestion — upload a resume. AI extracts skills, proficiency
  & projects."*
- **Be honest about limits.** The deck has a whole "Honesty" slide. Carry
  this into product copy: empty states acknowledge what's missing; error
  states say what happened, not just *"Something went wrong."*

### Tone examples

| Don't                                          | Do                                               |
|------------------------------------------------|--------------------------------------------------|
| "Leverage our AI engine to discover talent."   | "Find the right person. In plain English."      |
| "Click here to upload your resume document."   | "Drop a resume. We'll handle the rest."          |
| "An error occurred while processing."          | "We couldn't read that PDF. Try a different file." |
| "0 results found for your query."              | "Nobody matches yet. Try fewer constraints?"    |

### Section-label conventions

- Numbered sections in headers: `01 · THE PROBLEM`, `02 · APPROACH`
- Inline mono annotations: `// hackathon · team`, `z-index: 9999;`
- Match scores as decimals or percents: `0.92 match` / `92% match`

### Emoji

**Sparingly, never decoratively.** ✓ and ✗ are acceptable in honesty / pros &
cons contexts (used in the deck). Otherwise prefer typographic punctuation
(em dashes, bullets, arrows `→`) and icons from the icon set.

---

## Visual foundations

### Color

The palette is **vibrant but cool** — four saturated hues plus a deep
indigo-navy ink, all tuned to feel related rather than competing.

| Token | Hex      | Role                                            |
|-------|----------|-------------------------------------------------|
| `--brand-indigo` | `#8B7BE8` | Primary. Buttons, links, focus, selected states |
| `--brand-coral`  | `#FF9A82` | Warmth, errors, callouts, emotional accent      |
| `--brand-teal`   | `#7CD3C5` | Success, positive deltas, "matched" badges      |
| `--brand-amber`  | `#FFCB6B` | Warning, pending, in-review                     |
| `--ink-900`      | `#151634` | Display surfaces, hero backdrops                |
| `--ink-50`       | `#FAFAFC` | Default page background                         |

**Rules:**
- Indigo carries the brand. On any given screen, indigo > all other accents combined.
- Coral, teal, amber are **co-equal data colors** — never re-rank them. The
  four-orb logo establishes the order; respect it.
- Pure black (`#000`) is never used. Use `--ink-900` (`#151634`) — it has
  a violet undertone that ties to the indigo.
- Greys are **cool / violet-tinted**, never neutral. See `--ink-100`..`--ink-700`.

### Type

Three families, each with one clear job.

| Family               | Role                                | Notes                                  |
|----------------------|-------------------------------------|----------------------------------------|
| **Instrument Serif** | Display only — hero, big numbers, pull-quotes | Italic for the most editorial moments |
| **Geist**            | UI, body, headings, buttons         | Tracking tightened on large sizes      |
| **Geist Mono**       | Eyebrows, code, match scores, KBD   | Uppercase + wide tracking for labels   |

> ⚠️ **Font substitution flag.** Instrument Serif, Geist, and Geist Mono are
> all loaded from Google Fonts. If brand later licenses different webfonts,
> replace the `@import` in `colors_and_type.css` and these specimens update
> automatically. No design changes needed.

The pairing of an editorial serif (Instrument) with a neutral neo-grotesque
(Geist) is what gives SkillsHub its "warm but credible" tone — the serif
adds humanity, the sans keeps the product side crisp.

### Spacing

A strict **4px base** scale. Component padding is always a token, never a
raw px. Cards default to 24px padding; dense list rows use 12px.

### Backgrounds

Three modes, used deliberately:

1. **Plain `--bg-page`** — default for product surfaces. The work happens here.
2. **Soft glow over `--bg-page`** — landing hero, empty states. Place one or
   two `glow-*.png` orbs at low opacity (0.5–0.7) behind content. Never more
   than two glows in the same composition — they fight each other.
3. **Deep `--ink-900` surface** — marketing, slide moments, modals/sheets
   that need gravitas. Always pair with one or two glows for warmth — a
   flat navy is too austere for this brand.

### Borders & cards

- Cards = `--bg-surface` (white) on `--bg-page` (cool off-white).
- 1px `--border-hairline` (`#E8E8F0`) is the default card border. Combined
  with a soft indigo-tinted shadow, this gives cards depth without aggressive
  shadows. Cards lean **flat with a hairline**, not floating.
- Default radius: `--r-lg` (14px) for cards, `--r-md` (10px) for inputs/chips,
  `--r-pill` for badges and filter chips.
- Borders are **never coloured-left-accent** — that's an AI-design cliché we
  explicitly avoid.

### Shadows

Always **indigo-tinted**, never neutral grey. See `--shadow-1`..`--shadow-4`
in `colors_and_type.css`. The lift comes from a subtle violet glow + a
nearer dark-navy contact shadow.

### Motion

- **Default ease:** `cubic-bezier(0.22, 1, 0.36, 1)` (`--ease-out`).
- **Default duration:** 200ms (`--t-base`).
- **Hover lift:** spring ease for that gentle bounce (`--ease-spring`),
  120ms in, 200ms out.
- Page transitions: fade + 8px upward translate.
- Buttons & cards: scale to `0.98` on press, opacity-darken on hover.
- **No infinite spinners** if avoidable — prefer a determinate progress
  bar in indigo, or a skeleton in `--ink-100`.

### Hover & press states

| Component | Hover                                  | Press                              |
|-----------|----------------------------------------|------------------------------------|
| Primary button | Background shifts to `--brand-indigo-deep` | Scale 0.98, slight inset shadow |
| Secondary button | Background `--ink-100`, border darkens | Scale 0.98                      |
| Card / list row | `bg-sunken` (cool off-white) + 1px lift | Scale 0.99                     |
| Link        | Underline appears, color holds         | Color shifts darker               |
| Icon button | Background `--ink-100` circle         | Background `--ink-200`            |

### Transparency / blur

Used **rarely and intentionally**:
- Sticky top bars on the dark hero: `rgba(21,22,52,0.7)` + `backdrop-filter: blur(12px)`.
- Modal scrims: `rgba(21,22,52,0.55)` flat — never blurred. The product behind
  should stay readable as context.

### Imagery vibe

The deck's **soft, radial color glows** are the brand's signature illustration
style — there is no photography in the system. Imagery is:

- **Soft, radial, painterly** — fading edges, no hard lines.
- **One saturated color per glow**, against a deep navy or off-white.
- **Layered, never stacked** — two glows of different colors can overlap; their
  edges should bleed into each other.
- Use the `assets/glow-*.png` files at 60–80% opacity, with `mix-blend-mode: screen`
  on dark backgrounds for a luminous effect.

We deliberately avoid: photography of stock office workers, isometric SaaS
illustrations, 3D abstract shapes, gradient-bluish-purple corporate hero
backgrounds.

### Layout rules

- **12-column grid** at 1280px max content width for marketing.
- **Sidebar + canvas** for product (264px collapsible sidebar, fluid canvas).
- **Always one focal point per screen.** Search, results, profile — pick one,
  weight it heavily, support with secondary elements.
- Section padding: `var(--s-16)` (64px) between marketing sections,
  `var(--s-8)` (32px) between product sections.

---

## Iconography

**Approach:** SkillsHub uses **Lucide** as its primary icon system, served
from a CDN. Lucide's stroke style (1.5px stroke, rounded caps, 24×24 grid)
matches the brand's "warm but precise" feel.

- ⚠️ **Substitution flag.** No bespoke icons exist yet. Lucide is the closest
  match for the visual register we want. When the brand commissions custom
  icons, drop them into `assets/icons/` and switch the `<i data-lucide>`
  tags to the new set.

### Usage

```html
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
<i data-lucide="search"></i>
<script>lucide.createIcons();</script>
```

- Default size: 18px in dense UI, 20px standard, 24px for primary-action buttons.
- Default color: `currentColor` — inherit from the parent's text color.
- Stroke width: leave Lucide's default (1.5). Do **not** swap to filled icons —
  it breaks the system.

### Emoji

Only ✓ and ✗ in honesty/pros-cons contexts (as the deck does on slide 6).
No other emoji appear in the product.

### Unicode glyphs

A small set of typographic glyphs are part of the brand's voice and may appear
inline in copy: `·` (middot, section separators), `→` (arrow, "next"),
`✓` `✗` (honesty), `&` (ampersand, casual lists), em-dash `—`.

### Brand glows

The four `glow-*.png` files in `assets/` are **brand illustration**, not icons.
Use them as decorative background elements only; never as a substitute for an icon.

---

## Index

| File / folder                       | Purpose                                  |
|-------------------------------------|------------------------------------------|
| `README.md`                         | This file. Start here.                   |
| `SKILL.md`                          | Claude Code agent skill entrypoint.      |
| `colors_and_type.css`               | All design tokens — colors, type, radii, shadows, motion. |
| `assets/logo-*.svg`                 | Wordmark + standalone mark.              |
| `assets/glow-*.png`                 | Brand illustration — soft radial color glows. |
| `preview/`                          | Cards rendered in the Design System tab. |
| `ui_kits/web-app/`                  | Recreations of core SkillsHub screens. Start at `index.html`. |
| `ui_kits/web-app/README.md`         | Component inventory for the web app.     |

---

## Open questions / next iteration

- Real logo — current mark is a placeholder built from the four-orb motif.
- Real fonts — currently Google Fonts substitutes (Instrument Serif, Geist).
- Iconography — Lucide as a stand-in until a bespoke set exists.
- Mobile and dark-mode product surfaces — not in scope for this quick brand kit.
