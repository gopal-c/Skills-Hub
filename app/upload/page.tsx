import { requireRole } from "@/lib/session";
import { RoleHeader } from "@/components/role-header";
import { UploadForm } from "./upload-form";

export default async function UploadPage() {
  const session = await requireRole("employee");

  return (
    <main className="min-h-screen bg-bg-page">
      <RoleHeader session={session} eyebrow="Employee · Upload" />
      <section className="mx-auto max-w-2xl px-s-8 py-s-12">
        <span className="eyebrow eyebrow-coral">Step 1</span>
        <h1 className="mt-s-2">
          Drop a resume. <span className="serif-italic" style={{ color: "var(--brand-coral-deep)" }}>We&rsquo;ll handle the rest.</span>
        </h1>
        <p className="mt-s-3 max-w-xl text-[15px] text-fg-2">
          We&rsquo;ll extract your skills, projects, and proficiency.
          A reviewer takes a quick look before your profile goes live.
        </p>
        <UploadForm />
      </section>
    </main>
  );
}
