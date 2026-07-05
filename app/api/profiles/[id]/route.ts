import { NextResponse } from "next/server";
import { requireRole } from "@/lib/session";
import {
  getProfile,
  getProfileByWorkEmail,
  updateProfile,
  deleteProfile,
  type Status,
} from "@/lib/store";
import { isAllowedWorkEmail, WORK_EMAIL_DOMAIN, isValidDateOfBirth } from "@/lib/domain";

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

  const allowed = ["name", "email", "city", "seniority", "yearsExperience", "skills", "projects", "education", "status", "workEmail", "joiningDate", "dateOfBirth"] as const;
  const patch: Record<string, unknown> = {};
  for (const k of allowed) if (k in body) patch[k] = body[k];

  if (patch.status && !["pending", "approved", "rejected"].includes(patch.status as string)) {
    return NextResponse.json({ ok: false, error: "Invalid status." }, { status: 400 });
  }

  if (typeof patch.dateOfBirth === "string" && patch.dateOfBirth && !isValidDateOfBirth(patch.dateOfBirth)) {
    return NextResponse.json({ ok: false, error: "Date of birth must be at least 16 years ago." }, { status: 400 });
  }
  if (patch.joiningDate === "") patch.joiningDate = null;
  if (patch.dateOfBirth === "") patch.dateOfBirth = null;

  // HR is a trusted actor — setting work_email here bypasses employee
  // verification entirely (no email sent, marked verified immediately).
  if (typeof patch.workEmail === "string") {
    const workEmail = patch.workEmail.trim().toLowerCase();
    if (workEmail && !isAllowedWorkEmail(workEmail)) {
      return NextResponse.json(
        { ok: false, error: `Work email must end in ${WORK_EMAIL_DOMAIN}.` },
        { status: 400 },
      );
    }
    patch.workEmail = workEmail || null;
    patch.workEmailVerified = !!workEmail;
    patch.workEmailVerificationToken = null;
    patch.workEmailVerificationExpiresAt = null;

    if (workEmail) {
      const conflict = await getProfileByWorkEmail(workEmail);
      if (conflict && conflict.id !== params.id) {
        return NextResponse.json(
          { ok: false, error: `${workEmail} is already used by ${conflict.name}'s profile.` },
          { status: 409 },
        );
      }
    }
  }

  let updated;
  try {
    updated = await updateProfile(params.id, patch as Partial<{ status: Status }>);
  } catch (err) {
    if (isUniqueViolation(err)) {
      return NextResponse.json(
        { ok: false, error: "That work email is already in use by another profile." },
        { status: 409 },
      );
    }
    const message = err instanceof Error ? err.message : "update failed";
    return NextResponse.json({ ok: false, error: `Couldn't save: ${message}` }, { status: 500 });
  }
  if (!updated) return NextResponse.json({ ok: false, error: "Not found." }, { status: 404 });
  return NextResponse.json({ ok: true, profile: updated });
}

/** Postgres unique_violation. See https://www.postgresql.org/docs/current/errcodes-appendix.html */
function isUniqueViolation(err: unknown): boolean {
  return typeof err === "object" && err !== null && (err as { code?: string }).code === "23505";
}

export async function DELETE(_req: Request, { params }: Params) {
  await requireRole("hr");
  const ok = await deleteProfile(params.id);
  if (!ok) return NextResponse.json({ ok: false, error: "Not found." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
