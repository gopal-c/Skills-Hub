import { NextResponse } from "next/server";
import { createSchema, seedUsers } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await createSchema();
    const usersInserted = await seedUsers();
    return NextResponse.json({ ok: true, usersInserted });
  } catch (err) {
    const message = err instanceof Error ? err.message : "init failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
