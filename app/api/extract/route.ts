import { NextResponse } from "next/server";
import OpenAI from "openai";
import { extractText, getDocumentProxy } from "unpdf";
import { addProfile, type Proficiency, type Seniority } from "@/lib/store";

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

const SYSTEM_PROMPT = `You are a careful resume parser. Read the resume text and return a JSON object that fits this exact shape:

{
  "name": string,
  "email": string,
  "city": string,
  "seniority": "junior" | "mid" | "senior" | "lead",
  "yearsExperience": number,
  "skills": [{ "name": string, "category": string, "proficiency": "beginner" | "intermediate" | "advanced" | "expert", "yearsExperience": number }],
  "projects": [{ "name": string, "description": string, "skillsUsed": string[], "duration": string }],
  "education": [{ "degree": string, "institution": string, "year": number }]
}

Guidance:
- "category" examples: language, framework, database, cloud, tool, domain, soft.
- Infer "seniority" from years of experience: 0–2 junior, 3–5 mid, 6–9 senior, 10+ lead.
- Infer "proficiency" from how recent and central the skill is in projects.
- If a field is missing, make a reasonable guess; never invent specifics like company names.
- Return JSON only — no prose, no markdown.`;

const VALID_SENIORITY: Seniority[]     = ["junior", "mid", "senior", "lead"];
const VALID_PROFICIENCY: Proficiency[] = ["beginner", "intermediate", "advanced", "expert"];

type Extracted = {
  name: string;
  email: string;
  city: string;
  seniority: Seniority;
  yearsExperience: number;
  skills:    Array<{ name: string; category: string; proficiency: Proficiency; yearsExperience: number }>;
  projects:  Array<{ name: string; description: string; skillsUsed: string[]; duration: string }>;
  education: Array<{ degree: string; institution: string; year: number }>;
};

function coerce(raw: unknown): Extracted | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;

  const name      = typeof r.name      === "string" ? r.name      : "";
  const email     = typeof r.email     === "string" ? r.email     : "";
  const city      = typeof r.city      === "string" ? r.city      : "";
  const seniority = VALID_SENIORITY.includes(r.seniority as Seniority) ? (r.seniority as Seniority) : "mid";
  const yearsExperience = typeof r.yearsExperience === "number" ? r.yearsExperience : 0;

  if (!name) return null;

  const skills = Array.isArray(r.skills) ? r.skills.flatMap((s: unknown) => {
    if (!s || typeof s !== "object") return [];
    const sx = s as Record<string, unknown>;
    if (typeof sx.name !== "string") return [];
    return [{
      name: sx.name,
      category: typeof sx.category === "string" ? sx.category : "other",
      proficiency: VALID_PROFICIENCY.includes(sx.proficiency as Proficiency) ? (sx.proficiency as Proficiency) : "intermediate",
      yearsExperience: typeof sx.yearsExperience === "number" ? sx.yearsExperience : 0,
    }];
  }) : [];

  const projects = Array.isArray(r.projects) ? r.projects.flatMap((p: unknown) => {
    if (!p || typeof p !== "object") return [];
    const px = p as Record<string, unknown>;
    if (typeof px.name !== "string") return [];
    return [{
      name: px.name,
      description: typeof px.description === "string" ? px.description : "",
      skillsUsed: Array.isArray(px.skillsUsed) ? px.skillsUsed.filter((x): x is string => typeof x === "string") : [],
      duration: typeof px.duration === "string" ? px.duration : "",
    }];
  }) : [];

  const education = Array.isArray(r.education) ? r.education.flatMap((e: unknown) => {
    if (!e || typeof e !== "object") return [];
    const ex = e as Record<string, unknown>;
    if (typeof ex.degree !== "string") return [];
    return [{
      degree: ex.degree,
      institution: typeof ex.institution === "string" ? ex.institution : "",
      year: typeof ex.year === "number" ? ex.year : 0,
    }];
  }) : [];

  return { name, email, city, seniority, yearsExperience, skills, projects, education };
}

export async function POST(req: Request) {
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ ok: false, error: "GROQ_API_KEY not configured." }, { status: 503 });
  }

  let pdfBytes: Uint8Array;
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "No file uploaded." }, { status: 400 });
    }
    const buf = await file.arrayBuffer();
    pdfBytes = new Uint8Array(buf);
  } catch {
    return NextResponse.json({ ok: false, error: "Couldn't read the upload." }, { status: 400 });
  }

  let resumeText: string;
  try {
    const pdf = await getDocumentProxy(pdfBytes);
    const result = await extractText(pdf, { mergePages: true });
    resumeText = Array.isArray(result.text) ? result.text.join("\n") : result.text;
    if (!resumeText.trim()) {
      return NextResponse.json({ ok: false, error: "We couldn't read any text from that PDF. Is it scanned?" }, { status: 422 });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "PDF parsing failed";
    return NextResponse.json({ ok: false, error: `PDF parsing failed: ${message}` }, { status: 422 });
  }

  let extracted: Extracted | null = null;
  try {
    const groq = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      temperature: 0.2,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user",   content: `Resume text:\n\n${resumeText.slice(0, 18000)}` },
      ],
    });
    const content = completion.choices[0]?.message?.content ?? "{}";
    extracted = coerce(JSON.parse(content));
  } catch (err) {
    const message = err instanceof Error ? err.message : "extraction failed";
    return NextResponse.json({ ok: false, error: `Extraction failed: ${message}` }, { status: 502 });
  }

  if (!extracted) {
    return NextResponse.json({ ok: false, error: "We couldn't pull a structured profile out of that resume." }, { status: 422 });
  }

  try {
    const profile = await addProfile(extracted);
    return NextResponse.json({ ok: true, id: profile.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "save failed";
    return NextResponse.json({ ok: false, error: `Couldn't save profile: ${message}` }, { status: 500 });
  }
}
