# SkillsHub Web App — UI Kit

High-fidelity recreations of SkillsHub's HR-facing web app. These are
**cosmetic** patterns — they show the visual surface, not the data layer.
Wire them to your real backend; the look will carry.

## Pages (start here)

| File | Role | Theme |
|---|---|---|
| `directory.html` | HR card grid — 3-up frosted cards with avatar + skill chips | light |
| `directory-v2.html` | Vertical ID-badge layout — 4-up, avatar-first, stronger frost, lanyard detail | light |
| `profile.html` | Employee detail — hero avatar, frosted skill pills, project cards, tinted education card | light |
| `search.html` | Natural-language search + frosted result cards (score badge + reason banner) | light |
| `upload.html` | Resume drag-and-drop, 3-step indicator | light |
| `upload-v2.html` | Same as `upload.html`, dark theme (ink-900 + brand glows) | dark |
| `index.html` | First-pass React sidebar demo (kept for reference) | light |

Every page is self-contained — open any one in a browser, it works. No build,
no bundler.

## Theme system

```html
<body data-theme="light">   <!-- or "dark" -->
```

Switches the page background, top bar, hero text color, footer-pill chrome,
which wordmark renders, and whether the brand glow orbs are visible.
Frosted cards inside the page stay light-glass in both themes by design
(intentional contrast on a dark page → social-media-post effect).

Every page already has:
- `<link rel="stylesheet" href="theme.css">`
- Both wordmarks: `<img class="theme-logo-light">` and `<img class="theme-logo-dark">`
- Three glow divs: `<div class="theme-glow g1|g2|g3">`

Just flip the body attribute to switch.

## File map

```
ui_kits/web-app/
├── README.md           ← this file
├── theme.css           ← theme tokens (data-theme), shared topbar, glow layer
├── upload.css          ← upload-page styles (dropzone, file row, actions)
├── *.html              ← every page (see table above)
└── (legacy React kit)
    ├── index.html      ← original sidebar/search demo
    ├── App.jsx
    ├── Sidebar.jsx
    ├── SearchBar.jsx
    ├── ResultCard.jsx
    ├── ProfilePanel.jsx
    └── app.css
```

## How a new page should be wired

```html
<!doctype html>
<html lang="en">
<head>
  <link rel="stylesheet" href="../../colors_and_type.css">
  <link rel="stylesheet" href="theme.css">
  <style>
    /* your page-specific styles — cards, form fields, etc.
       use --t-fg-1 / --t-fg-2 / --t-fg-3 for page chrome text. */
  </style>
</head>
<body data-theme="light">
  <div class="theme-glow g1"></div>
  <div class="theme-glow g2"></div>
  <div class="theme-glow g3"></div>

  <header class="topbar">
    <img class="theme-logo-light" src="../../assets/logo-wordmark.svg" alt="SkillsHub">
    <img class="theme-logo-dark"  src="../../assets/logo-wordmark-dark.svg" alt="SkillsHub">
    <span class="divider">/</span>
    <span class="crumb">Section · <b>Page</b></span>
    <div class="right">
      <span class="role">role: <b>HR</b></span>
      <span class="tab active">Directory</span>
      <span class="tab">Switch role</span>
    </div>
  </header>

  <main class="page">
    <!-- your content -->
  </main>
</body>
</html>
```

## Component patterns to lift

- **Frosted card** — see `.card` in any page. Always pair the translucent
  background with the diagonal `::before` sheen, or it won't read as glass.
- **Avatar with halo** — see `.avatar` + `.avatar-wrap::before` in
  `directory-v2.html` and `profile.html`. Halo color matches the avatar's
  gradient.
- **Pending Review pattern** — coral status dot on the avatar + coral pill
  in the data row. See first card in `directory-v2.html`.
- **Score badge** — ink-900 pill with teal numeral (or amber for weaker
  matches). See `search.html`.
- **Step pips** — see `upload.html`. Active step lights coral with a halo.
- **Dropzone** — see `upload.html`. Dashed indigo border + gradient icon tile
  + hover/dragging state lift.
