import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { requireRole } from "@/lib/session";
import { getProfileByEmail, getProfileByWorkEmail, updateProfile } from "@/lib/store";
import { isAllowedWorkEmail, WORK_EMAIL_DOMAIN } from "@/lib/domain";
import { sendVerificationEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VERIFICATION_TTL_MS = 24 * 60 * 60 * 1000;

/** Employee self-edit. Cannot touch `status` — approval stays HR-only. */
export async function PATCH(req: Request) {
  const session = await requireRole("employee");

  const existing = await getProfileByEmail(session.email);
  if (!existing) {
    return NextResponse.json({ ok: false, error: "No profile exists for your account yet." }, { status: 404 });
  }

  const body = (await req.json()) as Record<string, unknown>;
  const allowed = ["name", "city", "seniority", "yearsExperience", "skills", "projects", "education"] as const;
  const patch: Record<string, unknown> = {};
  for (const k of allowed) if (k in body) patch[k] = body[k];

  let verificationSent = false;

  // Work email is only editable while unverified. If they change it, re-run
  // the domain check and restart verification from scratch.
  if (typeof body.workEmail === "string") {
    const newWorkEmail = body.workEmail.trim().toLowerCase();
    const currentWorkEmail = (existing.workEmail ?? "").toLowerCase();

    if (existing.workEmailVerified && newWorkEmail !== currentWorkEmail) {
      return NextResponse.json(
        { ok: false, error: "Verified — contact HR to change this email." },
        { status: 403 },
      );
    }

    if (newWorkEmail && newWorkEmail !== currentWorkEmail) {
      if (!isAllowedWorkEmail(newWorkEmail)) {
        return NextResponse.json(
          { ok: false, error: `Work email must end in ${WORK_EMAIL_DOMAIN}.` },
          { status: 400 },
        );
      }
      const conflict = await getProfileByWorkEmail(newWorkEmail);
      if (conflict && conflict.id !== existing.id) {
        return NextResponse.json(
          { ok: false, error: "That work email is already in use on another account." },
          { status: 409 },
        );
      }
      const token     = randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + VERIFICATION_TTL_MS).toISOString();
      patch.workEmail = newWorkEmail;
      patch.email = newWorkEmail; // keep the lookup email in sync, matching signup behavior
      patch.workEmailVerified = false;
      patch.workEmailVerificationToken = token;
      patch.workEmailVerificationExpiresAt = expiresAt;

      const result = await sendVerificationEmail(newWorkEmail, existing.name, token);
      verificationSent = result.ok;
    }
  }

  let updated;
  try {
    updated = await updateProfile(existing.id, patch);
  } catch (err) {
    if (isUniqueViolation(err)) {
      return NextResponse.json(
        { ok: false, error: "That work email is already in use on another account." },
        { status: 409 },
      );
    }
    const message = err instanceof Error ? err.message : "update failed";
    return NextResponse.json({ ok: false, error: `Couldn't save changes: ${message}` }, { status: 500 });
  }
  if (!updated) {
    return NextResponse.json({ ok: false, error: "Couldn't save changes." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, profile: updated, verificationSent });
}

/** Postgres unique_violation. See https://www.postgresql.org/docs/current/errcodes-appendix.html */
function isUniqueViolation(err: unknown): boolean {
  return typeof err === "object" && err !== null && (err as { code?: string }).code === "23505";
}
