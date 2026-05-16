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
};

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
  const seed = JSON.parse(raw) as Array<Omit<Profile, "id" | "status" | "createdAt" | "avatarUrl">>;
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
  })().catch((err) => {
    bootstrapPromise = null;
    throw err;
  });
  return bootstrapPromise;
}

/* ─────────── Public API ─────────── */

export async function getProfiles(): Promise<Profile[]> {
  await ensureSeeded();
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
  const { rows } = await sql<Row>`
    SELECT * FROM profiles WHERE lower(email) = ${email.toLowerCase()} ORDER BY created_at DESC LIMIT 1
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

export async function getPendingProfiles(): Promise<Profile[]> {
  await ensureSeeded();
  const { rows } = await sql<Row>`
    SELECT * FROM profiles WHERE status = 'pending' ORDER BY created_at DESC
  `;
  return rows.map(rowToProfile);
}

export async function addProfile(
  input: Omit<Profile, "id" | "status" | "createdAt" | "avatarUrl">,
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
  patch: Partial<Omit<Profile, "id" | "createdAt">>,
): Promise<Profile | undefined> {
  // Hand-built dynamic update — small enough to stay readable.
  const sets: string[] = [];
  const values: unknown[] = [];
  const map: Record<string, string> = {
    name: "name", email: "email", city: "city", seniority: "seniority",
    yearsExperience: "years_experience", status: "status",
    skills: "skills", projects: "projects", education: "education",
  };
  for (const [k, v] of Object.entries(patch)) {
    if (!(k in map) || v === undefined) continue;
    const col = map[k];
    values.push(["skills", "projects", "education"].includes(k) ? JSON.stringify(v) : v);
    sets.push(`${col} = $${values.length}${["skills","projects","education"].includes(k) ? "::jsonb" : ""}`);
  }
  if (sets.length === 0) return getProfile(id);
  values.push(id);
  const { rows } = await sql.query<Row>(
    `UPDATE profiles SET ${sets.join(", ")} WHERE id = $${values.length} RETURNING *`,
    values,
  );
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
