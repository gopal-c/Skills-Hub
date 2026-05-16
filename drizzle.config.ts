import "dotenv/config";
import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Load .env.local explicitly (Next.js convention; not picked up by default).
config({ path: ".env.local" });

const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL_UNPOOLED or DATABASE_URL must be set");

export default defineConfig({
  schema: "./db/schema.ts",
  out:    "./db/migrations",
  dialect: "postgresql",
  dbCredentials: { url },
  verbose: true,
  strict:  true,
});
