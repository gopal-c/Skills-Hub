import { readFileSync } from "node:fs";
import { join } from "node:path";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { employees, skills, projects, profileReviews } from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set — run with `npm run db:seed`");
}

type SeedSkill = {
  name: string;
  category: string;
  proficiency: "beginner" | "intermediate" | "advanced" | "expert";
  yearsExperience: number;
};

type SeedProject = {
  name: string;
  description: string;
  skillsUsed: string[];
  duration: string;
};

type SeedEducation = { degree: string; institution: string; year: number };

type SeedEmployee = {
  name: string;
  email: string;
  city: string;
  seniority: "junior" | "mid" | "senior" | "lead";
  yearsExperience: number;
  skills: SeedSkill[];
  projects: SeedProject[];
  education: SeedEducation[];
};

async function main() {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql);

  const raw = readFileSync(join(process.cwd(), "seed", "employees.json"), "utf8");
  const seed: SeedEmployee[] = JSON.parse(raw);

  console.log(`Seeding ${seed.length} employees…`);

  // Wipe first so re-running is idempotent. Cascades drop skills/projects/reviews.
  await db.delete(profileReviews);
  await db.delete(skills);
  await db.delete(projects);
  await db.delete(employees);

  for (const e of seed) {
    const [row] = await db
      .insert(employees)
      .values({
        name: e.name,
        email: e.email,
        city: e.city,
        seniority: e.seniority,
        yearsExperience: e.yearsExperience,
        education: e.education,
        status: "approved", // seeded profiles are live from day one
      })
      .returning({ id: employees.id });

    if (e.skills.length) {
      await db.insert(skills).values(
        e.skills.map((s) => ({ ...s, employeeId: row.id }))
      );
    }
    if (e.projects.length) {
      await db.insert(projects).values(
        e.projects.map((p) => ({ ...p, employeeId: row.id }))
      );
    }

    await db.insert(profileReviews).values({
      employeeId: row.id,
      status: "approved",
      reviewerEmail: "seed@demo.com",
      notes: "Auto-approved during seed.",
    });

    console.log(`  ✓ ${e.name} (${e.seniority}, ${e.city})`);
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
