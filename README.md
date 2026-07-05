This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
# SkillsHub

AI-powered skills intelligence for HR teams. Built for [Hackathon Name] in 48 hours.

## What it does
- **HR onboards employees** by uploading resumes → AI extracts skills, proficiency, projects
- **Semantic search** with plain-English reasoning (not just keyword matching)
- **Employees update** their own profiles and photos

## Stack
Next.js 14 · TypeScript · Tailwind · shadcn/ui · Postgres (Neon) · Groq (Llama 3.3 70B) · JWT auth

## Demo
🔗 [Live demo](https://z-index-9999-skills-hub.vercel.app/)

**Login:**
- HR: `hr@demo.com` / `Demo@123`
- Employee: any seeded email (try `naveen.rao@demo.com`) / `Demo@123`

## Team
**z-index: 9999;** — [Gopal Chavan] (UI/UX) + Claude (Dev)

Built May 15–16, 2026.

## Employee self-signup

Employees at `@valueaddsofttech.com` can create their own account instead of waiting for
HR to onboard them from a resume:

1. **`/signup`** — name, work email (must end in `@valueaddsofttech.com`), password.
2. A verification email is sent (see env vars below). Clicking the link confirms the
   email and flips the account to "pending HR approval."
3. **`/review`** — self-signups only show up here once their email is verified. Unverified
   rows are hidden so HR isn't asked to approve an account nobody's confirmed yet.
4. Once HR approves, the employee can sign in and lands on `/me`. Logging in before
   verification/approval redirects to `/pending-approval` instead.
5. From `/me`, employees can edit their own profile fields. Their **work email is locked
   once verified** — changing it requires HR to update it from the review/edit screen
   (HR changes bypass verification entirely, since HR is a trusted actor).
6. Forgot a password? `/forgot-password` → email link → `/reset-password`.

### New environment variables

| Var | Purpose |
|---|---|
| `APP_URL` | Base URL used to build verification / reset links in emails (e.g. `http://localhost:3000` in dev). |
| `GMAIL_USER` | Gmail address emails are sent from. |
| `GMAIL_APP_PASSWORD` | A Google [App Password](https://myaccount.google.com/apppasswords) for that account — not your regular Gmail password. |

If these aren't set, signup/verification/reset still work functionally (accounts and
tokens are created), but no email is sent — the API responds with `emailSent: false`
so the UI can show a "resend" option instead of crashing.


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
