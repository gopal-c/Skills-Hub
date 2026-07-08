import { NextResponse } from "next/server";
import { requireRole } from "@/lib/session";
import { getMilestoneById, getProfileByEmail, deleteMilestone } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { params: { id: string } };

/** HR can delete any milestone. An employee can only delete their own,
 *  employee-created entries — HR-added milestones are read-only to them. */
export async function DELETE(_req: Request, { params }: Params) {
  const session = await requireRole("any");

  const milestone = await getMilestoneById(params.id);
  if (!milestone) {
    return NextResponse.json({ ok: false, error: "Not found." }, { status: 404 });
  }

  if (session.role === "employee") {
    const own = await getProfileByEmail(session.email);
    if (!own || own.id !== milestone.profileId) {
      return NextResponse.json({ ok: false, error: "You can't delete that milestone." }, { status: 403 });
    }
  }

  const ok = await deleteMilestone(params.id);
  if (!ok) return NextResponse.json({ ok: false, error: "Not found." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
