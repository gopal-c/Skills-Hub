import { NextResponse } from "next/server";
import { requireRole } from "@/lib/session";
import { getProfile, getProfileByEmail, getMilestonesByProfileId, addMilestone } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** HR may fetch any profile's milestones; an employee only their own. */
async function assertCanAccessProfile(profileId: string): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  const session = await requireRole("any");
  if (session.role === "hr") return { ok: true };

  const own = await getProfileByEmail(session.email);
  if (!own || own.id !== profileId) {
    return { ok: false, status: 403, error: "You can only view your own milestones." };
  }
  return { ok: true };
}

export async function GET(req: Request) {
  const profileId = new URL(req.url).searchParams.get("profileId");
  if (!profileId) {
    return NextResponse.json({ ok: false, error: "profileId is required." }, { status: 400 });
  }

  const access = await assertCanAccessProfile(profileId);
  if (!access.ok) return NextResponse.json({ ok: false, error: access.error }, { status: access.status });

  const milestones = await getMilestonesByProfileId(profileId);
  return NextResponse.json({ ok: true, milestones });
}

export async function POST(req: Request) {
  const session = await requireRole("any");

  const VALID_CATEGORIES = ["achievement", "promotion", "certification", "education", "milestone", "celebration", "other"] as const;
  type Cat = typeof VALID_CATEGORIES[number];

  const body = (await req.json()) as Record<string, unknown>;
  const profileId      = typeof body.profileId === "string" ? body.profileId : "";
  const title           = typeof body.title === "string" ? body.title.trim() : "";
  const milestoneDate    = typeof body.milestoneDate === "string" ? body.milestoneDate : "";
  const category        = VALID_CATEGORIES.includes(body.category as Cat) ? (body.category as Cat) : "achievement";

  if (!profileId || !title || !milestoneDate) {
    return NextResponse.json({ ok: false, error: "profileId, title, and milestoneDate are required." }, { status: 400 });
  }

  if (session.role === "employee") {
    const own = await getProfileByEmail(session.email);
    if (!own || own.id !== profileId) {
      return NextResponse.json({ ok: false, error: "You can only add milestones to your own profile." }, { status: 403 });
    }
  } else {
    const profile = await getProfile(profileId);
    if (!profile) return NextResponse.json({ ok: false, error: "Profile not found." }, { status: 404 });
  }

  const milestone = await addMilestone(profileId, title, milestoneDate, session.role, category);
  return NextResponse.json({ ok: true, milestone });
}
