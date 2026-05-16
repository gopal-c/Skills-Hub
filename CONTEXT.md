# SkillsHub — Hackathon build context

AI-powered skills intelligence platform for HR teams. Two user roles:
- **HR** searches the skills database in plain English, sees ranked results with reasoning.
- **Employees** upload a resume PDF; system extracts skills/proficiency/projects; profile lands in a review queue before going live.

Hackathon submission deadline: **midnight Saturday, 2026-05-16** (today).

Judging hinges on the two hard problems — smart resume ingestion + semantic search with reasoning. Everything else is plumbing.

## Stack

- **Next.js 14.2.35** (App Router) + TypeScript + Tailwind 3 + shadcn/ui
- **Fonts** via Google Fonts `@import` in `app/globals.css` — Instrument Serif (display), Geist (UI), Geist Mono (eyebrow/code). Not `next/font`, because this Next version's font catalog doesn't recognize `Geist`.
- **AI** Groq `llama-3.3-70b-versatile` via OpenAI-compatible SDK
- **PDF parsing** `unpdf` (replaces `pdf-parse` to dodge its import-time bug)
- **Data** in-memory store (`lib/store.ts`), seeded from `seed/employees.json` on import — *no database*
- **Auth** plain-cookie role-switcher (`skillshub_role` = `hr` | `employee`) — *no password, no user table*
- Deployed via Vercel from `master`

## What's done

### Phase 0 — scaffold + foundations (commit `156b54e`)
- Next + TS + Tailwind + shadcn scaffold
- Full **SkillsHub design system** from Claude Design handoff applied:
  - Brand palette (`#8B7BE8` indigo + coral/teal/amber), 12-step cool ink scale, soft/deep/press variants
  - Type scale, 4px spacing, 6-step radii, indigo-tinted shadows, motion easings
  - Tokens in `app/globals.css`; utilities exposed via `tailwind.config.ts`
  - Parallel shadcn-compatible RGB-triple tokens so Button's `/80` alpha modifiers work
- `/` landing — dark hero, two mix-blend glows (current state: role-switcher cards, see Phase 1)
- `/preview` — 7-section design system showcase (colors, type, spacing, radii, shadows, buttons, brand)
- `/api/test-groq` smoke route (verified ~200ms)
- 15 seed profiles in `seed/employees.json` — Indian-tech mix across BLR/Pune/Mumbai/Hyderabad/remote, junior→lead, FE/BE/full-stack, fintech/healthtech/e-comm/devtools
- Logo SVGs + glow PNGs in `public/assets/`

### Phase 1 — data + auth (revised; commits `7671ee9` → `15640bd` → `1c5020a`)
Original plan: Drizzle + Neon + email/password auth. Pivoted mid-flight.

- **Data layer** `lib/store.ts` — module-level array seeded from JSON; exposes `getProfiles / getProfile / getApprovedProfiles / getPendingProfiles / addProfile / updateProfile / setProfileStatus`. All seeded entries marked `approved`; uploads start `pending`. State lives in-process, resets on cold start (acceptable tradeoff for demo).
- **Role-switcher** instead of auth:
  - `/` shows two big cards — "Enter as HR" / "Enter as Employee"
  - Each submits a server action (`app/actions/role.ts → enterAs(role)`) that sets `skillshub_role` cookie and redirects
  - `clearRole()` on the role-header "Switch role" button returns to `/`
- **Middleware** (`middleware.ts`) reads cookie, enforces:
  - `/search`, `/review/*` → `hr`
  - `/upload`, `/profile/*` → `employee`
  - `/employees/*` → either role
- **Helpers** `lib/auth.ts` (Role / cookie name / ROLE_HOME map) + `lib/session.ts` (`getRole`, `requireRole`)
- **Placeholder home pages** for each role using a shared `<RoleHeader>` component
- `/employees` placeholder renders the 15 seeded profiles as a grid

## What's mid-flight

Nothing. Working tree is clean, build passes, `master` is pushed.

## What's next — Phase 2: resume ingestion + review queue

This is the first of the **two hard problems** judging will weigh. Don't skimp.

1. **Upload UI at `/upload`** — drag-and-drop or file input for a PDF. Brand-correct (coral accent per the role's home).
2. **Server route `POST /api/resume`** — accepts the PDF, calls `unpdf` to extract text, sends to Groq with a strict JSON schema prompt for structured extraction (name, email, city, seniority guess, skills with category/proficiency/years, projects with description + skills used + duration, education).
3. **Save extracted profile via `addProfile()`** — lands as `status: "pending"`.
4. **Review queue at `/review`** (HR-only) — list of pending profiles, click into a detail view showing extracted JSON, accept / reject / edit-then-accept actions that call `setProfileStatus()` or `updateProfile()`.
5. **Confirmation screen** for the employee after upload — "Your profile is in review."

### Open decisions for Phase 2
- Whether to show the raw Groq output to the user before saving, or save directly and let HR review.
- Whether HR can edit fields in the review queue, or only accept/reject (edit is a bigger lift but a stronger demo).
- Whether to handle PDF parse failures gracefully (e.g. show the raw text and let the user paste a structured version) or just error out.

## Roadmap remaining

- **Phase 3 — directory + profile view** — `/employees` list with filters (skill/seniority/city), individual profile pages at `/employees/[id]`.
- **Phase 4 — semantic search** (second hard problem) — `/search` page, text input, sends query + all approved profiles JSON to Groq with a ranking prompt, renders score + 1–2 sentence reason per match.
- **Phase 5 — polish** — empty/loading states, transitions, edge cases, demo click-path.

## Key files / where things live

```
app/
  page.tsx                 ← landing / role switcher
  preview/page.tsx         ← design system showcase
  search/page.tsx          ← HR home (placeholder, Phase 4)
  upload/page.tsx          ← employee home (placeholder, Phase 2)
  employees/page.tsx       ← directory (placeholder, Phase 3)
  actions/role.ts          ← server actions: enterAs / clearRole
  api/test-groq/route.ts   ← Groq smoke test
  globals.css              ← design tokens (single source of truth)
  layout.tsx
lib/
  store.ts                 ← in-memory profile store + types
  auth.ts                  ← Role / cookie / ROLE_HOME constants
  session.ts               ← getRole / requireRole (server-side)
  utils.ts                 ← shadcn cn() helper
components/
  ui/button.tsx            ← shadcn Button
  role-header.tsx          ← brand chrome + "Switch role" for role homes
middleware.ts              ← edge runtime cookie-based role guard
seed/employees.json        ← 15 hand-written profiles
public/assets/             ← 4 logo SVGs + 4 glow PNGs (brand illustration)
tailwind.config.ts         ← maps CSS vars → Tailwind utilities
.handoff/                  ← raw Claude Design handoff (gitignored, reference only)
```

## Important deviations from the original plan

1. **No database.** Pivoted from Drizzle + Neon to an in-memory store on Saturday morning. Profiles added at runtime don't survive cold starts on Vercel — known limit, acceptable for demo. Neon URLs are still in `.env.local` but unused.
2. **No real auth.** Pivoted from email/password to a one-click role-switcher. Cookie isn't HMAC-signed (anyone can forge `role=hr`). Fine for hackathon; absolutely not for production.
3. **Geist, not Inter.** The design handoff specifies Geist; the in-chat design-tool transcript shows the user explicitly reverted Inter back to Geist. Loaded via Google Fonts `@import`, not `next/font` (this Next version doesn't know `Geist`).
4. **Radius 14px (cards) / 10px (inputs), not the original 8px** — per the design handoff.
5. **`unpdf` not `pdf-parse`.** Same API surface; no import-time test-file bug.

## Running locally

```bash
npm run dev            # http://localhost:3000
npm run build          # production build, lint + types
```

Required env vars in `.env.local`:
- `GROQ_API_KEY` — Groq API key (set)
- `SESSION_SECRET` — placeholder; unused since the auth pivot

`DATABASE_URL` / `DATABASE_URL_UNPOOLED` are present from the Neon attempt but the code no longer reads them.

## Known gotchas (from memory)

- **Literal `//` in JSX text breaks builds** — ESLint `react/jsx-no-comment-textnodes`. Wrap in `{"..."}`. Grepped clean as of this commit.
- **`TaskStop` leaves orphan `node` processes on Windows** — kills the npm wrapper, not its node child. Stale children lock `.next/trace`, make new builds appear stuck. Check `Get-Process node` before assuming code is broken.
