import { NextResponse } from "next/server";
import {
  createSchema,
  seedDemoUsers,
  seedProfilesFromJson,
  backfillUsersFromProfiles,
} from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await createSchema();
    const demoUsersInserted   = await seedDemoUsers();
    const profilesInserted    = await seedProfilesFromJson();
    const usersBackfilled     = await backfillUsersFromProfiles();
    return NextResponse.json({
      ok: true,
      demoUsersInserted,
      profilesInserted,
      usersBackfilled,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "init failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
