import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, ROLE_HOME, verifySession, type Role } from "@/lib/auth";
import { isEmployeeApproved } from "@/lib/edge-status";

const HR_ONLY        = ["/search", "/review", "/onboard"];
const EMPLOYEE_ONLY  = ["/upload", "/me", "/home", "/pending-approval"];
const ANY_ROLE       = ["/employees", "/profile"];

// Employee routes that additionally require profiles.status === 'approved'.
// /home and /pending-approval stay reachable in every state — /home is the
// hub that explains *why* you're gated, so it can't itself be gated.
const EMPLOYEE_APPROVED_ONLY = ["/upload", "/me"];

function pathMatches(pathname: string, prefixes: string[]): boolean {
  return prefixes.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

function requiredFor(pathname: string): Role | "any" | null {
  if (pathMatches(pathname, HR_ONLY))       return "hr";
  if (pathMatches(pathname, EMPLOYEE_ONLY)) return "employee";
  if (pathMatches(pathname, ANY_ROLE))      return "any";
  return null;
}

export async function middleware(req: NextRequest) {
  const required = requiredFor(req.nextUrl.pathname);
  if (!required) return NextResponse.next();

  const token   = req.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySession(token);

  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    url.search   = "";
    return NextResponse.redirect(url);
  }

  if (required !== "any" && session.role !== required) {
    const url = req.nextUrl.clone();
    url.pathname = ROLE_HOME[session.role];
    url.search   = "";
    return NextResponse.redirect(url);
  }

  if (session.role === "employee" && pathMatches(req.nextUrl.pathname, EMPLOYEE_APPROVED_ONLY)) {
    const approved = await isEmployeeApproved(session.email);
    if (!approved) {
      const url = req.nextUrl.clone();
      url.pathname = "/home";
      url.search   = "";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/search/:path*",
    "/review/:path*",
    "/onboard/:path*",
    "/upload/:path*",
    "/profile/:path*",
    "/me/:path*",
    "/home/:path*",
    "/pending-approval/:path*",
    "/employees/:path*",
  ],
};
