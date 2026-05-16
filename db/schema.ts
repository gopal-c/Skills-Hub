import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  pgEnum,
  jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const seniorityEnum   = pgEnum("seniority",   ["junior", "mid", "senior", "lead"]);
export const proficiencyEnum = pgEnum("proficiency", ["beginner", "intermediate", "advanced", "expert"]);
export const statusEnum      = pgEnum("status",      ["pending", "approved", "rejected"]);

export type EducationEntry = {
  degree: string;
  institution: string;
  year: number;
};

export const employees = pgTable("employees", {
  id:              uuid("id").defaultRandom().primaryKey(),
  name:            text("name").notNull(),
  email:           text("email").notNull().unique(),
  city:            text("city").notNull(),
  seniority:       seniorityEnum("seniority").notNull(),
  yearsExperience: integer("years_experience").notNull(),
  education:       jsonb("education").$type<EducationEntry[]>().notNull().default([]),
  status:          statusEnum("status").notNull().default("pending"),
  createdAt:       timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt:       timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const skills = pgTable("skills", {
  id:              uuid("id").defaultRandom().primaryKey(),
  employeeId:      uuid("employee_id").notNull().references(() => employees.id, { onDelete: "cascade" }),
  name:            text("name").notNull(),
  category:        text("category").notNull(),
  proficiency:     proficiencyEnum("proficiency").notNull(),
  yearsExperience: integer("years_experience").notNull(),
});

export const projects = pgTable("projects", {
  id:          uuid("id").defaultRandom().primaryKey(),
  employeeId:  uuid("employee_id").notNull().references(() => employees.id, { onDelete: "cascade" }),
  name:        text("name").notNull(),
  description: text("description").notNull(),
  skillsUsed:  text("skills_used").array().notNull().default([]),
  duration:    text("duration").notNull(),
});

/** Audit log of HR review decisions on a candidate profile. */
export const profileReviews = pgTable("profile_reviews", {
  id:            uuid("id").defaultRandom().primaryKey(),
  employeeId:    uuid("employee_id").notNull().references(() => employees.id, { onDelete: "cascade" }),
  status:        statusEnum("status").notNull(),
  reviewerEmail: text("reviewer_email").notNull(),
  notes:         text("notes"),
  reviewedAt:    timestamp("reviewed_at", { withTimezone: true }).notNull().defaultNow(),
});

export const employeesRelations = relations(employees, ({ many }) => ({
  skills:   many(skills),
  projects: many(projects),
  reviews:  many(profileReviews),
}));

export const skillsRelations = relations(skills, ({ one }) => ({
  employee: one(employees, { fields: [skills.employeeId], references: [employees.id] }),
}));

export const projectsRelations = relations(projects, ({ one }) => ({
  employee: one(employees, { fields: [projects.employeeId], references: [employees.id] }),
}));

export const profileReviewsRelations = relations(profileReviews, ({ one }) => ({
  employee: one(employees, { fields: [profileReviews.employeeId], references: [employees.id] }),
}));

export type Employee       = typeof employees.$inferSelect;
export type NewEmployee    = typeof employees.$inferInsert;
export type Skill          = typeof skills.$inferSelect;
export type Project        = typeof projects.$inferSelect;
export type ProfileReview  = typeof profileReviews.$inferSelect;
