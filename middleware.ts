import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, ROLE_HOME, verifySession, type Role } from "@/lib/auth";

const HR_ONLY        = ["/search", "/review"];
const EMPLOYEE_ONLY  = ["/upload", "/me"];
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

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/search/:path*",
    "/review/:path*",
    "/upload/:path*",
    "/profile/:path*",
    "/me/:path*",
    "/employees/:path*",
  ],
};
