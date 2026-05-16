/**
 * In-memory profile store.
 *
 * Loaded once on module init from seed/employees.json with all profiles
 * marked `approved`. Lives only in-process — restarts clear non-seeded
 * additions. Fine for hackathon scope.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { randomUUID } from "node:crypto";

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
  status: Status;
  createdAt: string;
};

type SeedProfile = Omit<Profile, "id" | "status" | "createdAt">;

function loadSeed(): Profile[] {
  const raw = readFileSync(join(process.cwd(), "seed", "employees.json"), "utf8");
  const seed: SeedProfile[] = JSON.parse(raw);
  const now = new Date().toISOString();
  return seed.map((p) => ({
    ...p,
    id: randomUUID(),
    status: "approved" as const,
    createdAt: now,
  }));
}

// Module-level mutable array. Re-loaded on cold start (dev HMR + serverless).
const profiles: Profile[] = loadSeed();

export function getProfiles(): Profile[] {
  return profiles;
}

export function getProfile(id: string): Profile | undefined {
  return profiles.find((p) => p.id === id);
}

export function getApprovedProfiles(): Profile[] {
  return profiles.filter((p) => p.status === "approved");
}

export function getPendingProfiles(): Profile[] {
  return profiles.filter((p) => p.status === "pending");
}

export function addProfile(input: Omit<Profile, "id" | "status" | "createdAt">): Profile {
  const profile: Profile = {
    ...input,
    id: randomUUID(),
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  profiles.push(profile);
  return profile;
}

export function updateProfile(id: string, patch: Partial<Omit<Profile, "id">>): Profile | undefined {
  const idx = profiles.findIndex((p) => p.id === id);
  if (idx === -1) return undefined;
  profiles[idx] = { ...profiles[idx], ...patch };
  return profiles[idx];
}

export function setProfileStatus(id: string, status: Status): Profile | undefined {
  return updateProfile(id, { status });
}
