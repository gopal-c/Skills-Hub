import { NextResponse } from "next/server";
import { verifyPreApprovalUploadToken } from "@/lib/auth";
import { getProfile, updateProfile, hasResumeData } from "@/lib/store";
import { extractProfileFromPdf, ExtractError } from "@/lib/extract";

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

/**
 * Resume upload for a verified-but-not-yet-approved employee. Auth here is
 * the short-lived pre-approval token minted on the /verify-email success
 * screen (see lib/auth.ts) — NOT a login session. It only ever lets the
 * caller write to the one profile it was scoped to.
 */
export async function POST(req: Request) {
  const form = await req.formData();
  const token = form.get("token");
  if (typeof token !== "string") {
    return NextResponse.json({ ok: false, error: "Missing upload token." }, { status: 401 });
  }

  const profileId = await verifyPreApprovalUploadToken(token);
  if (!profileId) {
    return NextResponse.json({ ok: false, error: "This upload link has expired." }, { status: 401 });
  }

  const profile = await getProfile(profileId);
  if (!profile) {
    return NextResponse.json({ ok: false, error: "Profile not found." }, { status: 404 });
  }
  if (hasResumeData(profile)) {
    return NextResponse.json({ ok: false, error: "Resume already uploaded." }, { status: 409 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "No file uploaded." }, { status: 400 });
  }

  let extracted;
  try {
    extracted = await extractProfileFromPdf(new Uint8Array(await file.arrayBuffer()));
  } catch (err) {
    if (err instanceof ExtractError) {
      return NextResponse.json({ ok: false, error: err.message }, { status: err.status });
    }
    return NextResponse.json({ ok: false, error: "Extraction failed." }, { status: 500 });
  }

  // Status stays untouched (still pending HR review) — this only enriches
  // the profile HR is about to look at, it doesn't change the approval gate.
  const updated = await updateProfile(profileId, {
    name: extracted.name || profile.name,
    city: extracted.city,
    seniority: extracted.seniority,
    yearsExperience: extracted.yearsExperience,
    skills: extracted.skills,
    projects: extracted.projects,
    education: extracted.education,
  });
  if (!updated) {
    return NextResponse.json({ ok: false, error: "Couldn't save your resume." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, profileId: updated.id });
}
