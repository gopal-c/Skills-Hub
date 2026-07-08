/**
 * SQL-backed profile store (Vercel Postgres on Neon).
 *
 * Reads `POSTGRES_URL` from env automatically. Table is created via
 * `/api/init` (hit once manually). On first read after init, the
 * profiles table is auto-seeded from seed/employees.json with all
 * entries marked `approved`.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { sql } from "@vercel/postgres";
import bcrypt from "bcryptjs";
import type { Role } from "./auth";

export type { Role };

export type Proficiency = "beginner" | "intermediate" | "advanced" | "expert";
export type Seniority   = "junior" | "mid" | "senior" | "lead";
export type Status      = "pending" | "approved" | "rejected";

export type Skill = {
  name: string;
  category: string;
  proficiency: Proficiency;
  yearsExperience: number;
};

export type Project = {
  name: string;
  description: string;
  skillsUsed: string[];
  duration: string;
};

export type Education = {
  degree: string;
  institution: string;
  year: number;
};

export type Profile = {
  id: string;
  name: string;
  email: string;
  city: string;
  seniority: Seniority;
  yearsExperience: number;
  skills: Skill[];
  projects: Project[];
  education: Education[];
  avatarUrl: string | null;
  status: Status;
  createdAt: string;
  updatedAt: string;
  /** Work email used for self-signup verification. Null for HR-onboarded/resume-only profiles. */
  workEmail: string | null;
  workEmailVerified: boolean;
  workEmailVerificationToken: string | null;
  workEmailVerificationExpiresAt: string | null;
  /** ISO date strings ("YYYY-MM-DD"), both optional. */
  joiningDate: string | null;
  dateOfBirth: string | null;
};

export type MilestoneCreator = "hr" | "employee";
export type MilestoneCategory = "achievement" | "promotion" | "certification" | "education" | "milestone" | "other";

export type Milestone = {
  id: string;
  profileId: string;
  title: string;
  milestoneDate: string;
  category: MilestoneCategory;
  createdBy: MilestoneCreator;
  createdAt: string;
  updatedAt: string;
};

export type User = {
  id: string;
  email: string;
  name: string;
  role: Role;
  createdAt: string;
};

type UserRow = {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  role: Role;
  created_at: string;
  password_reset_token?: string | null;
  password_reset_expires_at?: string | null;
};

function userRowToUser(r: UserRow): User {
  return {
    id: r.id,
    email: r.email,
    name: r.name,
    role: r.role,
    createdAt: r.created_at,
  };
}

type Row = {
  id: string;
  status: Status;
  name: string;
  email: string;
  city: string;
  seniority: Seniority;
  years_experience: number;
  skills: Skill[] | null;
  projects: Project[] | null;
  education: Education[] | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  work_email: string | null;
  work_email_verified: boolean;
  work_email_verification_token: string | null;
  work_email_verification_expires_at: string | null;
  joining_date: string | null;
  date_of_birth: string | null;
};

type MilestoneRow = {
  id: string;
  profile_id: string;
  title: string;
  milestone_date: string;
  category: MilestoneCategory;
  created_by: MilestoneCreator;
  created_at: string;
  updated_at: string;
};

function rowToMilestone(r: MilestoneRow): Milestone {
  return {
    id: r.id,
    profileId: r.profile_id,
    title: r.title,
    milestoneDate: r.milestone_date ? String(r.milestone_date).slice(0, 10) : r.milestone_date,
    category: r.category ?? "achievement",
    createdBy: r.created_by,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function rowToProfile(r: Row): Profile {
  return {
    id: r.id,
    status: r.status,
    name: r.name,
    email: r.email,
    city: r.city,
    seniority: r.seniority,
    yearsExperience: r.years_experience,
    skills:    r.skills    ?? [],
    projects:  r.projects  ?? [],
    education: r.education ?? [],
    avatarUrl: r.avatar_url ?? null,
    createdAt: r.created_at,
    updatedAt: r.updated_at ?? r.created_at,
    workEmail: r.work_email ?? null,
    workEmailVerified: r.work_email_verified ?? false,
    workEmailVerificationToken: r.work_email_verification_token ?? null,
    workEmailVerificationExpiresAt: r.work_email_verification_expires_at ?? null,
    joiningDate: r.joining_date ? String(r.joining_date).slice(0, 10) : null,
    dateOfBirth: r.date_of_birth ? String(r.date_of_birth).slice(0, 10) : null,
  };
}

/* ─────────── DDL (called by /api/init) ─────────── */

export async function createSchema(): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY,
      status TEXT NOT NULL DEFAULT 'pending',
      name TEXT, email TEXT, city TEXT, seniority TEXT,
      years_experience INT,
      skills JSONB, projects JSONB, education JSONB,
      avatar_url TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  // Backfill for tables created before the avatar_url column existed.
  await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT`;
  await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`;

  // Self-signup + work-email verification columns.
  await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS work_email TEXT`;
  await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS work_email_verified BOOLEAN NOT NULL DEFAULT FALSE`;
  await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS work_email_verification_token TEXT`;
  await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS work_email_verification_expires_at TIMESTAMPTZ`;
  // Unique index on work_email (partial — many rows have NULL work_email, which
  // Postgres allows any number of; only non-null values must be unique).
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS profiles_work_email_key ON profiles (work_email) WHERE work_email IS NOT NULL`;

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('hr','employee')),
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  // Password reset support (self-signup employees + anyone resetting a password).
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS password_reset_token TEXT`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS password_reset_expires_at TIMESTAMPTZ`;

  // Employment dates — optional, no constraints beyond NULL allowed.
  await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS joining_date DATE`;
  await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS date_of_birth DATE`;

  // Milestones. NOTE: the original spec used SERIAL/INTEGER ids to match a
  // generic schema, but this app's profiles.id is TEXT (app-generated UUID
  // via randomUUID()), never SERIAL — adapted profile_id (and the
  // milestone's own id) to TEXT to actually reference the real column.
  await sql`
    CREATE TABLE IF NOT EXISTS milestones (
      id TEXT PRIMARY KEY,
      profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      milestone_date DATE NOT NULL,
      created_by TEXT NOT NULL CHECK (created_by IN ('hr', 'employee')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_milestones_profile_id ON milestones(profile_id)`;

  // Milestone category (achievement, promotion, certification, education, milestone, other).
  await sql`ALTER TABLE milestones ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'achievement'`;
}

const DEMO_USERS: Array<{ email: string; name: string; role: Role; password: string }> = [
  { email: "hr@demo.com",       name: "HR Demo",       role: "hr",       password: "Demo@123" },
  { email: "employee@demo.com", name: "Employee Demo", role: "employee", password: "Demo@123" },
];

const DEMO_PASSWORD = "Demo@123";

/** Insert a single user account if one with that email doesn't exist. */
export async function createUserForProfile(
  email: string,
  name: string,
  role: Role = "employee",
  password: string = DEMO_PASSWORD,
): Promise<boolean> {
  if (!email || !name) return false;
  const hash = await bcrypt.hash(password, 10);
  const id = randomUUID();
  const { rowCount } = await sql`
    INSERT INTO users (id, email, password_hash, name, role)
    VALUES (${id}, ${email.toLowerCase()}, ${hash}, ${name}, ${role})
    ON CONFLICT (email) DO NOTHING
  `;
  return (rowCount ?? 0) > 0;
}

/** Insert the two static demo accounts (HR + generic Employee). Idempotent. */
export async function seedDemoUsers(): Promise<number> {
  let inserted = 0;
  for (const u of DEMO_USERS) {
    if (await createUserForProfile(u.email, u.name, u.role, u.password)) inserted++;
  }
  return inserted;
}

/** Seed the 15 example profiles from seed/employees.json if the table is empty. */
export async function seedProfilesFromJson(): Promise<number> {
  const { rows } = await sql<{ c: number }>`SELECT COUNT(*)::int AS c FROM profiles`;
  if ((rows[0]?.c ?? 0) > 0) return 0;

  const raw = readFileSync(join(process.cwd(), "seed", "employees.json"), "utf8");
  const seed = JSON.parse(raw) as Array<Omit<Profile, "id" | "status" | "createdAt" | "updatedAt" | "avatarUrl" | "joiningDate" | "dateOfBirth">>;
  let inserted = 0;
  for (const e of seed) {
    const id = randomUUID();
    await sql`
      INSERT INTO profiles (id, status, name, email, city, seniority, years_experience, skills, projects, education)
      VALUES (
        ${id}, 'approved', ${e.name}, ${e.email}, ${e.city}, ${e.seniority}, ${e.yearsExperience},
        ${JSON.stringify(e.skills)}::jsonb,
        ${JSON.stringify(e.projects)}::jsonb,
        ${JSON.stringify(e.education)}::jsonb
      )
    `;
    inserted++;
  }
  return inserted;
}

/**
 * Backfill the users table from existing profiles. For each profile row with
 * an email, insert a user account (role=employee, password=Demo@123). Idempotent
 * — existing emails are skipped via ON CONFLICT (email) DO NOTHING.
 */
export async function backfillUsersFromProfiles(): Promise<number> {
  const { rows } = await sql<{ email: string; name: string }>`
    SELECT email, name FROM profiles WHERE email IS NOT NULL AND email <> ''
  `;
  let inserted = 0;
  for (const p of rows) {
    if (await createUserForProfile(p.email, p.name, "employee", DEMO_PASSWORD)) inserted++;
  }
  return inserted;
}

/** @deprecated — kept for backward compat; equivalent to demos + backfill. */
export async function seedUsers(): Promise<number> {
  const a = await seedDemoUsers();
  const b = await backfillUsersFromProfiles();
  return a + b;
}

export async function getUserByEmail(email: string): Promise<(User & { passwordHash: string }) | undefined> {
  await ensureSeeded();
  const { rows } = await sql<UserRow>`
    SELECT * FROM users WHERE email = ${email.toLowerCase()} LIMIT 1
  `;
  if (!rows[0]) return undefined;
  return { ...userRowToUser(rows[0]), passwordHash: rows[0].password_hash };
}

// =============================================
// Milestone seed data for existing HR-onboarded profiles
// Do NOT run on new self-signup employee profiles
// =============================================
type MilestoneSeed = { title: string; date: string; category: MilestoneCategory; createdBy: MilestoneCreator };

const MILESTONE_SEEDS: Record<string, { joiningDate: string; dateOfBirth: string; milestones: MilestoneSeed[] }> = {
  "aarav.sharma@demo.com": {
    joiningDate: "2024-01-15", dateOfBirth: "2000-06-12",
    milestones: [
      { title: "Completed probation period", date: "2024-04-15", category: "milestone", createdBy: "hr" },
      { title: "Company Hackathon — 2nd Place", date: "2024-11-20", category: "achievement", createdBy: "hr" },
      { title: "Led checkout redesign launch", date: "2025-08-15", category: "achievement", createdBy: "hr" },
      { title: "Mentored 2 new interns", date: "2026-03-10", category: "achievement", createdBy: "hr" },
    ],
  },
  "priya.iyer@demo.com": {
    joiningDate: "2022-03-01", dateOfBirth: "1997-09-28",
    milestones: [
      { title: "Completed probation period", date: "2022-06-01", category: "milestone", createdBy: "hr" },
      { title: "Promoted to Mid-Level Engineer", date: "2023-04-01", category: "promotion", createdBy: "hr" },
      { title: "Led payouts ledger service to production", date: "2024-02-20", category: "achievement", createdBy: "hr" },
      { title: "Speaker at internal tech talks — gRPC patterns", date: "2025-01-18", category: "achievement", createdBy: "employee" },
      { title: "Reconciliation engine 99.9% uptime milestone", date: "2026-02-01", category: "achievement", createdBy: "hr" },
    ],
  },
  "rohan.mehta@demo.com": {
    joiningDate: "2021-06-15", dateOfBirth: "1994-03-22",
    milestones: [
      { title: "Promoted to Senior Engineer", date: "2022-07-01", category: "promotion", createdBy: "hr" },
      { title: "Marketplace pipeline shipped — 50k orders/day", date: "2023-03-15", category: "achievement", createdBy: "hr" },
      { title: "Led seller dashboard 2.0 rewrite", date: "2024-01-10", category: "achievement", createdBy: "hr" },
      { title: "Company Hackathon — 1st Place", date: "2024-11-20", category: "achievement", createdBy: "hr" },
      { title: "Promoted to Staff Engineer", date: "2026-01-15", category: "promotion", createdBy: "hr" },
    ],
  },
  "ananya.reddy@demo.com": {
    joiningDate: "2021-01-10", dateOfBirth: "1988-11-05",
    milestones: [
      { title: "Promoted to Engineering Lead", date: "2021-07-01", category: "promotion", createdBy: "hr" },
      { title: "Event platform scaled to 1M events/sec", date: "2022-09-20", category: "achievement", createdBy: "hr" },
      { title: "Observability rewrite — 60% cost reduction", date: "2023-08-10", category: "achievement", createdBy: "hr" },
      { title: "Built and grew platform team to 12 engineers", date: "2024-04-01", category: "achievement", createdBy: "hr" },
      { title: "Speaker at GopherCon India", date: "2025-02-15", category: "achievement", createdBy: "employee" },
      { title: "Promoted to Principal Engineer", date: "2026-03-01", category: "promotion", createdBy: "hr" },
    ],
  },
  "vikram.kumar@demo.com": {
    joiningDate: "2023-02-01", dateOfBirth: "1998-07-14",
    milestones: [
      { title: "Completed probation period", date: "2023-05-01", category: "milestone", createdBy: "hr" },
      { title: "Design system component library launched", date: "2024-03-20", category: "achievement", createdBy: "hr" },
      { title: "Promoted to Mid-Level Frontend Engineer", date: "2025-02-01", category: "promotion", createdBy: "hr" },
      { title: "Led accessibility audit — WCAG AA compliance", date: "2025-11-10", category: "achievement", createdBy: "hr" },
    ],
  },
  "saanvi.pillai@demo.com": {
    joiningDate: "2021-09-01", dateOfBirth: "1993-04-18",
    milestones: [
      { title: "Promoted to Senior Data Scientist", date: "2022-09-01", category: "promotion", createdBy: "hr" },
      { title: "Fraud model reduced chargebacks by 35%", date: "2023-05-15", category: "achievement", createdBy: "hr" },
      { title: "Published internal ML best-practices guide", date: "2024-06-01", category: "achievement", createdBy: "employee" },
      { title: "Real-time inference pipeline in production", date: "2025-08-20", category: "achievement", createdBy: "hr" },
      { title: "Mentored 4 junior data scientists", date: "2026-04-01", category: "achievement", createdBy: "hr" },
    ],
  },
  "arjun.singh@demo.com": {
    joiningDate: "2025-04-01", dateOfBirth: "2001-12-03",
    milestones: [
      { title: "Completed onboarding bootcamp", date: "2025-04-15", category: "milestone", createdBy: "hr" },
      { title: "First bug fix merged to production", date: "2025-05-10", category: "achievement", createdBy: "hr" },
      { title: "Redesigned onboarding email templates", date: "2026-05-15", category: "achievement", createdBy: "hr" },
    ],
  },
  "meera.krishnan@demo.com": {
    joiningDate: "2022-07-15", dateOfBirth: "1996-02-27",
    milestones: [
      { title: "Completed probation period", date: "2022-10-15", category: "milestone", createdBy: "hr" },
      { title: "Promoted to Product Designer", date: "2023-08-01", category: "promotion", createdBy: "hr" },
      { title: "Redesigned customer dashboard — NPS +12", date: "2024-07-15", category: "achievement", createdBy: "hr" },
      { title: "Design system adoption reached 90% across teams", date: "2025-10-01", category: "achievement", createdBy: "hr" },
      { title: "Speaker at DesignUp conference", date: "2026-02-20", category: "achievement", createdBy: "employee" },
    ],
  },
  "karan.joshi@demo.com": {
    joiningDate: "2021-02-01", dateOfBirth: "1986-08-30",
    milestones: [
      { title: "Promoted to Engineering Director", date: "2021-08-01", category: "promotion", createdBy: "hr" },
      { title: "Platform migration to microservices complete", date: "2022-09-01", category: "achievement", createdBy: "hr" },
      { title: "Engineering org grew from 30 to 65", date: "2023-12-01", category: "achievement", createdBy: "hr" },
      { title: "Introduced company-wide OKR framework", date: "2024-04-01", category: "achievement", createdBy: "hr" },
      { title: "99.99% platform uptime achieved", date: "2025-09-01", category: "achievement", createdBy: "hr" },
      { title: "Promoted to VP Engineering", date: "2026-04-01", category: "promotion", createdBy: "hr" },
    ],
  },
  "tara.banerjee@demo.com": {
    joiningDate: "2022-11-01", dateOfBirth: "1997-05-09",
    milestones: [
      { title: "Completed probation period", date: "2023-02-01", category: "milestone", createdBy: "hr" },
      { title: "Automated 80% of regression test suite", date: "2024-01-20", category: "achievement", createdBy: "hr" },
      { title: "Promoted to Senior QA Engineer", date: "2025-02-01", category: "promotion", createdBy: "hr" },
      { title: "Zero critical bugs in last 3 releases", date: "2025-10-15", category: "achievement", createdBy: "hr" },
    ],
  },
  "devansh.patel@demo.com": {
    joiningDate: "2021-11-15", dateOfBirth: "1995-01-20",
    milestones: [
      { title: "Promoted to Senior DevOps Engineer", date: "2022-12-01", category: "promotion", createdBy: "hr" },
      { title: "CI/CD pipeline reduced deploy time by 70%", date: "2023-09-15", category: "achievement", createdBy: "hr" },
      { title: "Kubernetes cluster migration — zero downtime", date: "2024-08-01", category: "achievement", createdBy: "hr" },
      { title: "Infrastructure cost reduced by 40%", date: "2025-12-01", category: "achievement", createdBy: "hr" },
      { title: "Promoted to Lead Platform Engineer", date: "2026-06-01", category: "promotion", createdBy: "hr" },
    ],
  },
  "ishita.choudhary@demo.com": {
    joiningDate: "2024-06-01", dateOfBirth: "2000-10-16",
    milestones: [
      { title: "Completed onboarding bootcamp", date: "2024-06-15", category: "milestone", createdBy: "hr" },
      { title: "First feature shipped to production", date: "2024-08-20", category: "achievement", createdBy: "hr" },
      { title: "Content campaign drove 2x organic traffic", date: "2025-09-01", category: "achievement", createdBy: "hr" },
    ],
  },
  "aditya.nair@demo.com": {
    joiningDate: "2021-08-01", dateOfBirth: "1992-07-03",
    milestones: [
      { title: "Promoted to Senior Mobile Engineer", date: "2022-08-01", category: "promotion", createdBy: "hr" },
      { title: "App Store rating improved from 3.8 to 4.6", date: "2023-02-15", category: "achievement", createdBy: "hr" },
      { title: "Led cross-platform migration to Flutter", date: "2024-06-15", category: "achievement", createdBy: "hr" },
      { title: "App crash rate reduced below 0.1%", date: "2025-01-20", category: "achievement", createdBy: "hr" },
      { title: "Apple WWDC scholarship recipient", date: "2025-06-10", category: "achievement", createdBy: "employee" },
      { title: "Promoted to Lead Mobile Engineer", date: "2026-02-01", category: "promotion", createdBy: "hr" },
    ],
  },
  "riya.gupta@demo.com": {
    joiningDate: "2023-05-15", dateOfBirth: "1999-03-11",
    milestones: [
      { title: "Completed probation period", date: "2023-08-15", category: "milestone", createdBy: "hr" },
      { title: "Promoted to Mid-Level Backend Engineer", date: "2024-06-01", category: "promotion", createdBy: "hr" },
      { title: "API gateway migration — 30% latency reduction", date: "2024-10-15", category: "achievement", createdBy: "hr" },
      { title: "Microservices auth module shipped", date: "2025-08-20", category: "achievement", createdBy: "hr" },
    ],
  },
  "naveen.rao@demo.com": {
    joiningDate: "2024-09-01", dateOfBirth: "2001-04-25",
    milestones: [
      { title: "Completed onboarding bootcamp", date: "2024-09-15", category: "milestone", createdBy: "hr" },
      { title: "First pull request merged", date: "2024-10-05", category: "achievement", createdBy: "hr" },
      { title: "Built internal data pipeline prototype", date: "2025-05-10", category: "achievement", createdBy: "hr" },
      { title: "Automated 3 manual reporting workflows", date: "2026-04-20", category: "achievement", createdBy: "hr" },
    ],
  },
};

let datesSeeded = false;
async function seedDatesForDemoProfiles(): Promise<void> {
  if (datesSeeded) return;
  datesSeeded = true;
  for (const [email, data] of Object.entries(MILESTONE_SEEDS)) {
    await sql`
      UPDATE profiles
      SET joining_date = COALESCE(joining_date, ${data.joiningDate}::date),
          date_of_birth = COALESCE(date_of_birth, ${data.dateOfBirth}::date)
      WHERE lower(email) = ${email.toLowerCase()}
        AND (joining_date IS NULL OR date_of_birth IS NULL)
    `;
  }
}

async function seedMilestonesForDemoProfiles(): Promise<number> {
  const { rows: existing } = await sql<{ c: number }>`SELECT COUNT(*)::int AS c FROM milestones`;
  if ((existing[0]?.c ?? 0) > 0) return 0;

  let inserted = 0;
  for (const [email, data] of Object.entries(MILESTONE_SEEDS)) {
    const { rows: profiles } = await sql<{ id: string }>`
      SELECT id FROM profiles WHERE email = ${email} LIMIT 1
    `;
    if (!profiles[0]) continue;
    const profileId = profiles[0].id;

    for (const m of data.milestones) {
      const id = randomUUID();
      await sql`
        INSERT INTO milestones (id, profile_id, title, milestone_date, created_by, category)
        SELECT ${id}, ${profileId}, ${m.title}, ${m.date}::date, ${m.createdBy}, ${m.category}
        WHERE NOT EXISTS (
          SELECT 1 FROM milestones WHERE profile_id = ${profileId} AND title = ${m.title}
        )
      `;
      inserted++;
    }
  }
  return inserted;
}

/* ─────────── Lazy seed on first read ─────────── */

let bootstrapPromise: Promise<void> | null = null;

async function ensureSeeded(): Promise<void> {
  if (bootstrapPromise) return bootstrapPromise;
  bootstrapPromise = (async () => {
    // Idempotent — creates tables, seeds demos + profiles, then backfills
    // a user account for every profile email.
    await createSchema();
    await seedDemoUsers();
    await seedProfilesFromJson();
    await backfillUsersFromProfiles();
    await seedDatesForDemoProfiles();
    await seedMilestonesForDemoProfiles();
  })().catch((err) => {
    bootstrapPromise = null;
    throw err;
  });
  return bootstrapPromise;
}

/* ─────────── Public API ─────────── */

export async function getProfiles(): Promise<Profile[]> {
  await ensureSeeded();
  await seedDatesForDemoProfiles();
  const { rows } = await sql<Row>`SELECT * FROM profiles ORDER BY created_at DESC`;
  return rows.map(rowToProfile);
}

export async function getProfile(id: string): Promise<Profile | undefined> {
  await ensureSeeded();
  const { rows } = await sql<Row>`SELECT * FROM profiles WHERE id = ${id} LIMIT 1`;
  return rows[0] ? rowToProfile(rows[0]) : undefined;
}

export async function getProfileByEmail(email: string): Promise<Profile | undefined> {
  await ensureSeeded();
  await seedDatesForDemoProfiles();
  const { rows } = await sql<Row>`
    SELECT * FROM profiles WHERE lower(email) = ${email.toLowerCase()} ORDER BY created_at DESC LIMIT 1
  `;
  return rows[0] ? rowToProfile(rows[0]) : undefined;
}

export { hasResumeData } from "./domain";

export async function getProfileByWorkEmail(workEmail: string): Promise<Profile | undefined> {
  await ensureSeeded();
  const { rows } = await sql<Row>`
    SELECT * FROM profiles WHERE lower(work_email) = ${workEmail.toLowerCase()} LIMIT 1
  `;
  return rows[0] ? rowToProfile(rows[0]) : undefined;
}

export async function getApprovedProfiles(): Promise<Profile[]> {
  await ensureSeeded();
  const { rows } = await sql<Row>`
    SELECT * FROM profiles WHERE status = 'approved' ORDER BY created_at DESC
  `;
  return rows.map(rowToProfile);
}

/**
 * Pending profiles awaiting HR review. Self-signups whose work email hasn't
 * been verified yet are excluded — no point bothering HR with a row nobody
 * can act on until the employee confirms their inbox.
 */
export async function getPendingProfiles(): Promise<Profile[]> {
  await ensureSeeded();
  const { rows } = await sql<Row>`
    SELECT * FROM profiles
    WHERE status = 'pending' AND (work_email IS NULL OR work_email_verified = TRUE)
    ORDER BY created_at DESC
  `;
  return rows.map(rowToProfile);
}

/** Approved + pending — what the directory shows (skips rejected). */
export async function getDirectoryProfiles(): Promise<Profile[]> {
  await ensureSeeded();
  const { rows } = await sql<Row>`
    SELECT * FROM profiles
    WHERE status IN ('approved', 'pending')
    ORDER BY created_at DESC
  `;
  return rows.map(rowToProfile);
}

export async function addProfile(
  input: Omit<Profile, "id" | "status" | "createdAt" | "updatedAt" | "avatarUrl" | "workEmail" | "workEmailVerified" | "workEmailVerificationToken" | "workEmailVerificationExpiresAt" | "joiningDate" | "dateOfBirth">,
): Promise<Profile> {
  const id = randomUUID();
  const { rows } = await sql<Row>`
    INSERT INTO profiles (id, status, name, email, city, seniority, years_experience, skills, projects, education)
    VALUES (
      ${id}, 'pending', ${input.name}, ${input.email}, ${input.city}, ${input.seniority}, ${input.yearsExperience},
      ${JSON.stringify(input.skills)}::jsonb,
      ${JSON.stringify(input.projects)}::jsonb,
      ${JSON.stringify(input.education)}::jsonb
    )
    RETURNING *
  `;
  return rowToProfile(rows[0]);
}

export async function updateProfile(
  id: string,
  patch: Partial<Omit<Profile, "id" | "createdAt" | "updatedAt">>,
): Promise<Profile | undefined> {
  // Hand-built dynamic update — small enough to stay readable.
  const sets: string[] = [];
  const values: unknown[] = [];
  const map: Record<string, string> = {
    name: "name", email: "email", city: "city", seniority: "seniority",
    yearsExperience: "years_experience", status: "status",
    skills: "skills", projects: "projects", education: "education",
    workEmail: "work_email", workEmailVerified: "work_email_verified",
    workEmailVerificationToken: "work_email_verification_token",
    workEmailVerificationExpiresAt: "work_email_verification_expires_at",
    joiningDate: "joining_date", dateOfBirth: "date_of_birth",
  };
  for (const [k, v] of Object.entries(patch)) {
    if (!(k in map) || v === undefined) continue;
    const col = map[k];
    values.push(["skills", "projects", "education"].includes(k) ? JSON.stringify(v) : v);
    sets.push(`${col} = $${values.length}${["skills","projects","education"].includes(k) ? "::jsonb" : ""}`);
  }
  if (sets.length === 0) return getProfile(id);
  sets.push("updated_at = NOW()"); // touch on every write — no placeholder needed
  values.push(id);
  const { rows } = await sql.query<Row>(
    `UPDATE profiles SET ${sets.join(", ")} WHERE id = $${values.length} RETURNING *`,
    values,
  );
  return rows[0] ? rowToProfile(rows[0]) : undefined;
}

export async function updateAvatarByEmail(
  email: string,
  avatarUrl: string | null,
): Promise<Profile | undefined> {
  const { rows } = await sql<Row>`
    UPDATE profiles SET avatar_url = ${avatarUrl}
    WHERE lower(email) = ${email.toLowerCase()}
    RETURNING *
  `;
  return rows[0] ? rowToProfile(rows[0]) : undefined;
}

export async function setProfileStatus(
  id: string,
  status: Status,
): Promise<Profile | undefined> {
  const { rows } = await sql<Row>`
    UPDATE profiles SET status = ${status} WHERE id = ${id} RETURNING *
  `;
  return rows[0] ? rowToProfile(rows[0]) : undefined;
}

export async function deleteProfile(id: string): Promise<boolean> {
  const { rowCount } = await sql`DELETE FROM profiles WHERE id = ${id}`;
  return (rowCount ?? 0) > 0;
}

/* ─────────── Self-signup + work-email verification ─────────── */

export { WORK_EMAIL_DOMAIN, isAllowedWorkEmail } from "./domain";

/**
 * Upsert a user account for self-signup. If a users row already exists for
 * this email (e.g. an "invited" employee created earlier during HR
 * onboarding, still on the Demo@123 password), overwrite its password hash
 * and name rather than skipping — the employee is claiming the account.
 */
export async function upsertSelfSignupUser(
  email: string,
  name: string,
  passwordHash: string,
): Promise<User> {
  const id = randomUUID();
  const { rows } = await sql<UserRow>`
    INSERT INTO users (id, email, password_hash, name, role)
    VALUES (${id}, ${email.toLowerCase()}, ${passwordHash}, ${name}, 'employee')
    ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, name = EXCLUDED.name
    RETURNING *
  `;
  return userRowToUser(rows[0]);
}

/**
 * Create (or refresh) the pending profile behind a self-signup attempt.
 * Sets email = workEmail so the existing getProfileByEmail()-based session
 * plumbing (/me, /upload) keeps working without changes.
 */
export async function createOrRefreshSelfSignupProfile(
  workEmail: string,
  name: string,
  token: string,
  expiresAt: string,
): Promise<Profile> {
  const existing = await getProfileByEmail(workEmail);
  if (existing) {
    const updated = await updateProfile(existing.id, {
      name,
      email: workEmail,
      workEmail,
      workEmailVerified: false,
      workEmailVerificationToken: token,
      workEmailVerificationExpiresAt: expiresAt,
      status: "pending",
    });
    return updated!;
  }

  const id = randomUUID();
  const { rows } = await sql<Row>`
    INSERT INTO profiles (
      id, status, name, email, city, seniority, years_experience,
      skills, projects, education,
      work_email, work_email_verified, work_email_verification_token, work_email_verification_expires_at
    )
    VALUES (
      ${id}, 'pending', ${name}, ${workEmail}, '', 'junior', 0,
      '[]'::jsonb, '[]'::jsonb, '[]'::jsonb,
      ${workEmail}, FALSE, ${token}, ${expiresAt}
    )
    RETURNING *
  `;
  return rowToProfile(rows[0]);
}

export async function getProfileByWorkEmailToken(token: string): Promise<Profile | undefined> {
  const { rows } = await sql<Row>`
    SELECT * FROM profiles
    WHERE work_email_verification_token = ${token}
      AND work_email_verification_expires_at > NOW()
    LIMIT 1
  `;
  return rows[0] ? rowToProfile(rows[0]) : undefined;
}

export async function verifyWorkEmail(profileId: string): Promise<Profile | undefined> {
  return updateProfile(profileId, {
    workEmailVerified: true,
    workEmailVerificationToken: null,
    workEmailVerificationExpiresAt: null,
  });
}

/* ─────────── Password reset ─────────── */

export async function getUserById(id: string): Promise<User | undefined> {
  const { rows } = await sql<UserRow>`SELECT * FROM users WHERE id = ${id} LIMIT 1`;
  return rows[0] ? userRowToUser(rows[0]) : undefined;
}

export async function setPasswordResetToken(
  email: string,
  token: string,
  expiresAt: string,
): Promise<boolean> {
  const { rowCount } = await sql`
    UPDATE users SET password_reset_token = ${token}, password_reset_expires_at = ${expiresAt}
    WHERE email = ${email.toLowerCase()}
  `;
  return (rowCount ?? 0) > 0;
}

export async function getUserByPasswordResetToken(token: string): Promise<User | undefined> {
  const { rows } = await sql<UserRow>`
    SELECT * FROM users
    WHERE password_reset_token = ${token} AND password_reset_expires_at > NOW()
    LIMIT 1
  `;
  return rows[0] ? userRowToUser(rows[0]) : undefined;
}

export async function resetUserPassword(userId: string, passwordHash: string): Promise<void> {
  await sql`
    UPDATE users
    SET password_hash = ${passwordHash}, password_reset_token = NULL, password_reset_expires_at = NULL
    WHERE id = ${userId}
  `;
}

/* ─────────── Milestones ─────────── */

export async function getMilestonesByProfileId(profileId: string): Promise<Milestone[]> {
  const { rows } = await sql<MilestoneRow>`
    SELECT * FROM milestones WHERE profile_id = ${profileId} ORDER BY milestone_date DESC
  `;
  return rows.map(rowToMilestone);
}

export async function getMilestoneById(id: string): Promise<Milestone | undefined> {
  const { rows } = await sql<MilestoneRow>`SELECT * FROM milestones WHERE id = ${id} LIMIT 1`;
  return rows[0] ? rowToMilestone(rows[0]) : undefined;
}

export async function addMilestone(
  profileId: string,
  title: string,
  milestoneDate: string,
  createdBy: MilestoneCreator,
  category: MilestoneCategory = "achievement",
): Promise<Milestone> {
  const id = randomUUID();
  const { rows } = await sql<MilestoneRow>`
    INSERT INTO milestones (id, profile_id, title, milestone_date, created_by, category)
    VALUES (${id}, ${profileId}, ${title}, ${milestoneDate}, ${createdBy}, ${category})
    RETURNING *
  `;
  return rowToMilestone(rows[0]);
}

/** Caller must already have verified ownership (see /api/milestones/[id]). */
export async function deleteMilestone(id: string): Promise<boolean> {
  const { rowCount } = await sql`DELETE FROM milestones WHERE id = ${id}`;
  return (rowCount ?? 0) > 0;
}
