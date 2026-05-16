import { NextResponse, type NextRequest } from "next/server";
import { ROLE_COOKIE, ROLE_HOME, isValidRole, type Role } from "@/lib/auth";

const HR_ONLY        = ["/search", "/review"];
const EMPLOYEE_ONLY  = ["/upload"];
const ANY_ROLE       = ["/employees", "/profile"];

function pathMatches(pathname: string, prefixes: string[]): boolean {
  return prefixes.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

function requiredFor(pathname: string): Role | "any" | null {
  if (pathMatches(pathname, HR_ONLY))       return "hr";
  if (pathMatches(pathname, EMPLOYEE_ONLY)) return "employee";
  if (pathMatches(pathname, ANY_ROLE))      return "any";
  return null;
}

export function middleware(req: NextRequest) {
  const required = requiredFor(req.nextUrl.pathname);
  if (!required) return NextResponse.next();

  const cookie = req.cookies.get(ROLE_COOKIE)?.value;
  const role   = isValidRole(cookie) ? cookie : null;

  if (!role) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    url.search   = "";
    return NextResponse.redirect(url);
  }

  if (required !== "any" && role !== required) {
    const url = req.nextUrl.clone();
    url.pathname = ROLE_HOME[role];
    url.search   = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/search/:path*",
    "/review/:path*",
    "/upload/:path*",
    "/profile/:path*",
    "/employees/:path*",
  ],
};
