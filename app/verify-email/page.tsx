import Link from "next/link";
import Image from "next/image";
import { getProfileByWorkEmailToken, verifyWorkEmail } from "@/lib/store";
import { ResendForm } from "./resend-form";

export const dynamic = "force-dynamic";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const token = searchParams.token;
  const profile = token ? await getProfileByWorkEmailToken(token) : undefined;
  if (profile) {
    await verifyWorkEmail(profile.id);
  }

  return (
    <div data-theme="dark" className="theme-shell">
      <div className="theme-glow g1" aria-hidden />
      <div className="theme-glow g2" aria-hidden />
      <div className="theme-glow g3" aria-hidden />

      <header className="relative z-[1] mx-auto flex max-w-6xl items-center px-s-8 py-s-6">
        <Link href="/" className="flex items-center">
          <Image src="/assets/logo-wordmark-dark.svg" alt="SkillsHub" width={140} height={32} />
        </Link>
      </header>

      <main className="upload-v2 relative z-[1] mx-auto max-w-[520px] px-s-8 pb-s-20 pt-s-8">
        {profile ? (
          <section className="form-card text-center">
            <h2>Email verified</h2>
            <p className="lede">
              Thanks, {profile.name}. Your account is now waiting on HR approval — you&rsquo;ll be able
              to sign in once it&rsquo;s reviewed.
            </p>
            <div className="form-actions">
              <Link href="/" className="btn-primary">Back to home</Link>
            </div>
          </section>
        ) : (
          <section className="form-card text-center">
            <h2>Link expired or invalid</h2>
            <p className="lede">
              That verification link isn&rsquo;t valid anymore. Enter your email below and we&rsquo;ll
              send a new one.
            </p>
            <ResendForm />
          </section>
        )}
      </main>
    </div>
  );
}
