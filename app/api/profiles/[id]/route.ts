import { NextResponse } from "next/server";
import { requireRole } from "@/lib/session";
import {
  getProfile,
  updateProfile,
  deleteProfile,
  type Status,
} from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { params: { id: string } };

export async function GET(_req: Request, { params }: Params) {
  const profile = await getProfile(params.id);
  if (!profile) return NextResponse.json({ ok: false, error: "Not found." }, { status: 404 });
  return NextResponse.json({ ok: true, profile });
}

export async function PATCH(req: Request, { params }: Params) {
  await requireRole("hr");
  const body = (await req.json()) as Record<string, unknown>;

  const allowed = ["name", "email", "city", "seniority", "yearsExperience", "skills", "projects", "education", "status"] as const;
  const patch: Record<string, unknown> = {};
  for (const k of allowed) if (k in body) patch[k] = body[k];

  if (patch.status && !["pending", "approved", "rejected"].includes(patch.status as string)) {
    return NextResponse.json({ ok: false, error: "Invalid status." }, { status: 400 });
  }

  const updated = await updateProfile(params.id, patch as Partial<{ status: Status }>);
  if (!updated) return NextResponse.json({ ok: false, error: "Not found." }, { status: 404 });
  return NextResponse.json({ ok: true, profile: updated });
}

export async function DELETE(_req: Request, { params }: Params) {
  await requireRole("hr");
  const ok = await deleteProfile(params.id);
  if (!ok) return NextResponse.json({ ok: false, error: "Not found." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
