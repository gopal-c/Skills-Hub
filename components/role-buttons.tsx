"use client";

import { useState } from "react";
import Image from "next/image";
import { LoginModal } from "@/components/login-modal";

type Picked = "hr" | "employee" | null;

export function RoleButtons() {
  const [picked, setPicked] = useState<Picked>(null);
  const open = picked !== null;
  const prefillEmail = picked === "hr" ? "hr@demo.com" : picked === "employee" ? "employee@demo.com" : "";

  return (
    <>
      <section className="relative z-10 mx-auto grid max-w-3xl gap-s-4 px-s-8 pb-s-20 md:grid-cols-2">
        <button
          type="button"
          onClick={() => setPicked("hr")}
          className="group relative flex h-full w-full flex-col items-start gap-s-4 overflow-hidden rounded-xl bg-bg-surface p-s-6 text-left shadow-3 transition-all duration-base ease-out hover:-translate-y-px hover:shadow-4"
        >
          <Image
            src="/assets/glow-indigo.png"
            alt=""
            aria-hidden
            width={280}
            height={280}
            className="pointer-events-none absolute -right-16 -top-16 h-[280px] w-[280px] opacity-35"
          />
          <span className="eyebrow eyebrow-indigo relative">HR · Hiring</span>
          <h3 className="relative text-fg-1">
            Find the right person, <span className="serif-italic" style={{ color: "var(--brand-indigo-deep)" }}>fast.</span>
          </h3>
          <p className="relative text-[14px] text-fg-2">
            Ask in plain English. Get ranked matches with a reason for each.
          </p>
          <span className="relative mt-auto inline-flex items-center gap-s-2 text-[13px] font-medium text-indigo-deep transition-transform duration-base group-hover:translate-x-1">
            Enter as HR &rarr;
          </span>
        </button>

        <button
          type="button"
          onClick={() => setPicked("employee")}
          className="group relative flex h-full w-full flex-col items-start gap-s-4 overflow-hidden rounded-xl bg-bg-surface p-s-6 text-left shadow-3 transition-all duration-base ease-out hover:-translate-y-px hover:shadow-4"
        >
          <Image
            src="/assets/glow-coral.png"
            alt=""
            aria-hidden
            width={280}
            height={280}
            className="pointer-events-none absolute -right-16 -top-16 h-[280px] w-[280px] opacity-35"
          />
          <span className="eyebrow eyebrow-coral relative">Employee</span>
          <h3 className="relative text-fg-1">
            Show what you can do, <span className="serif-italic" style={{ color: "var(--brand-coral-deep)" }}>in seconds.</span>
          </h3>
          <p className="relative text-[14px] text-fg-2">
            Drop a resume. We&rsquo;ll extract your skills, projects, and proficiency.
          </p>
          <span className="relative mt-auto inline-flex items-center gap-s-2 text-[13px] font-medium text-coral-deep transition-transform duration-base group-hover:translate-x-1">
            Enter as Employee &rarr;
          </span>
        </button>
      </section>

      <LoginModal
        open={open}
        onOpenChange={(v) => setPicked(v ? picked : null)}
        prefillEmail={prefillEmail}
        showEmployeeLinks={picked === "employee"}
      />
    </>
  );
}
