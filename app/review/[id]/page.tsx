import { notFound } from "next/navigation";
import Link from "next/link";
import { requireRole } from "@/lib/session";
import { RoleHeader } from "@/components/role-header";
import { getProfile } from "@/lib/store";
import { ProfileForm } from "@/components/profile-form";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

const STATUS_VARIANT: Record<string, "secondary" | "outline" | "destructive"> = {
  pending:  "outline",
  approved: "secondary",
  rejected: "destructive",
};

export default async function ReviewProfilePage({ params }: { params: { id: string } }) {
  const session = await requireRole("hr");
  const profile = await getProfile(params.id);
  if (!profile) notFound();

  return (
    <div data-theme="light" className="theme-shell">
      <RoleHeader session={session} eyebrow="HR · Review" />
      <section className="relative z-[1] mx-auto max-w-4xl px-s-8 py-s-10">
        <Link href="/review" className="text-[13px] text-fg-2 hover:text-fg-1">&larr; Back to queue</Link>

        <div className="mt-s-4 flex items-end justify-between gap-s-4">
          <div>
            <span className="eyebrow eyebrow-indigo">Reviewing</span>
            <h1 className="mt-s-2">{profile.name}</h1>
            <p className="mt-s-1 text-[13px] text-fg-2">{profile.email}</p>
          </div>
          <Badge variant={STATUS_VARIANT[profile.status]} className="font-mono text-[11px] uppercase">
            {profile.status}
          </Badge>
        </div>

        <div className="mt-s-8">
          <ProfileForm profile={profile} mode="review" />
        </div>
      </section>
    </div>
  );
}
