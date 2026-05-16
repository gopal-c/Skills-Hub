"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ROLE_COOKIE, ROLE_HOME, type Role } from "@/lib/auth";

export async function enterAs(role: Role) {
  cookies().set(ROLE_COOKIE, role, {
    httpOnly: true,
    sameSite: "lax",
    secure:   process.env.NODE_ENV === "production",
    path:     "/",
    maxAge:   60 * 60 * 24 * 7, // 7 days
  });
  redirect(ROLE_HOME[role]);
}

export async function clearRole() {
  cookies().delete(ROLE_COOKIE);
  redirect("/");
}
