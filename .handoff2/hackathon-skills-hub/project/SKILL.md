---
name: skillshub-design
description: Use this skill to generate well-branded interfaces and assets for SkillsHub, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the `README.md` file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick orientation

- **What SkillsHub is** — AI skills intelligence platform for HR. Resume ingest + AI extraction + semantic natural-language search with explainable reasoning.
- **Audience** — HR leads, hiring managers, sponsors. *Warm but credible.*
- **Token file** — `colors_and_type.css` is the single source of truth for colors, type, spacing, radii, shadows. Always `@import` it, never hard-code hexes.
- **Theme system** — `ui_kits/web-app/theme.css`. Set `<body data-theme="light">` or `data-theme="dark"` and the page chrome (background, top bar, hero text, footer pills, logo, glow visibility) follows automatically.
- **Mark + wordmark** — `assets/logo-mark.svg` (four-colour vertical gradient) and `assets/logo-wordmark[-dark].svg`. Use `logo-mark-light.svg` (solid white) on busy or brand-coloured surfaces.
- **Brand illustration** — soft radial glows in `assets/glow-{indigo,coral,teal,amber}.png`. Use `mix-blend-mode: screen` on dark backgrounds.

## UI kit — what's built

`ui_kits/web-app/` contains the canonical screen patterns. Reuse these:

| File | Pattern |
|---|---|
| `directory.html` | HR card grid with frosted glass cards on a soft pastel gradient |
| `directory-v2.html` | Vertical ID-badge layout — avatar-first, stronger frost, lanyard detail, status dot |
| `profile.html` | Employee detail with hero avatar, frosted skill pills, project cards, tinted education card |
| `search.html` | Natural-language search bar + frosted result cards with score + reason banner |
| `upload.html` | Resume drag-and-drop upload, 3-step indicator, frosted card (light theme) |
| `upload-v2.html` | Identical to `upload.html` but `data-theme="dark"` — landing-page surface (ink-900 + glow orbs) |
| `theme.css` | Theme tokens + shared topbar + glow layer + logo swap |
| `upload.css` | Upload-page styles (dropzone, file row, action buttons) |

## Hard rules

- Indigo (`#8B7BE8` pastel, `#6B58D9` deep for actions) carries the brand. Coral/teal/amber are co-equal data colors.
- No pure black — `--ink-900` (`#151634`) is the deepest surface.
- No left-border-accent cards, no bluish-purple gradient hero backgrounds, no isometric SaaS illustration.
- Iconography is Lucide, 1.5 stroke, currentColor.
- Editorial moments use Instrument Serif (italic for the lyrical bits). Everything else is Geist sans.
- Shadows are indigo-tinted, never neutral grey.

## The frosted-glass card recipe

Used on every product surface. Light glass over a tinted page reads as proper translucent glass. Drop this into any container and it just works:

```css
.card {
  position: relative;
  border-radius: 22px;
  background: linear-gradient(155deg,
                rgba(255, 255, 255, 0.62) 0%,
                rgba(255, 255, 255, 0.40) 60%,
                rgba(255, 255, 255, 0.52) 100%);
  backdrop-filter: blur(40px) saturate(200%);
  -webkit-backdrop-filter: blur(40px) saturate(200%);
  border: 1px solid rgba(255, 255, 255, 0.85);
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.95) inset,
    0 0 0 1px rgba(255, 255, 255, 0.18) inset,
    0 22px 46px -20px rgba(21, 22, 52, 0.20),
    0 4px 12px rgba(21, 22, 52, 0.05);
}
.card::before {
  content: ""; position: absolute; inset: 0;
  border-radius: inherit;
  background: linear-gradient(135deg,
                rgba(255,255,255,0.55) 0%,
                rgba(255,255,255,0.08) 30%,
                transparent 50%,
                rgba(255,255,255,0.10) 75%,
                rgba(255,255,255,0.30) 100%);
  pointer-events: none; mix-blend-mode: overlay;
}
```

The diagonal `::before` is the lustre — it's what makes the card look like glass and not just a translucent rectangle. Don't skip it.

## Avatar recipe

48–128px circle, gradient fill, colored halo, white ring. Two-stop brand gradient picks two of `#8B7BE8 #FF9A82 #7CD3C5 #FFCB6B`:

```css
.avatar {
  width: 52px; height: 52px; border-radius: 50%;
  background: linear-gradient(135deg, #FF9A82, #FFCB6B);  /* pick two */
  color: #fff; font: 600 17px/1 var(--font-sans);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 6px 14px rgba(21, 22, 52, 0.18),
              0 0 0 3px rgba(255, 255, 255, 0.65);
}
/* Halo glow behind, picks up the avatar's hue */
.avatar-wrap::before {
  content: ""; position: absolute; inset: -10px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,154,130,0.40) 0%, transparent 65%);
  filter: blur(6px); z-index: -1;
}
```
