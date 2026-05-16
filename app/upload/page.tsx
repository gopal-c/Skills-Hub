import { requireRole } from "@/lib/session";
import { RoleHeader } from "@/components/role-header";

export default function UploadHomePage() {
  const role = requireRole("employee");

  return (
    <main className="min-h-screen bg-bg-page">
      <RoleHeader role={role} eyebrow="Employee · Upload" />
      <section className="mx-auto max-w-3xl px-s-8 py-s-16">
        <span className="eyebrow eyebrow-coral">Phase 2 lands here</span>
        <h1 className="mt-s-2">
          Drop a resume. <span className="serif-italic" style={{ color: "var(--brand-coral-deep)" }}>We&rsquo;ll handle the rest.</span>
        </h1>
        <p className="mt-s-4 max-w-xl text-[15px] text-fg-2">
          Resume upload + AI extraction will live here. For now you&rsquo;re
          entered as an Employee.
        </p>
      </section>
    </main>
  );
}
