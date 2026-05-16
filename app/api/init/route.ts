import { NextResponse } from "next/server";
import { createSchema } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await createSchema();
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "init failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
