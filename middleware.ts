import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession, ROLE_HOME, type Role } from "@/lib/auth";

const HR_PATHS       = ["/search", "/review"];
const EMPLOYEE_PATHS = ["/upload", "/profile"];

function pathMatchesPrefix(pathname: string, prefixes: string[]): boolean {
  return prefixes.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

function pathRequiresRole(pathname: string): Role | null {
  if (pathMatchesPrefix(pathname, HR_PATHS))       return "hr";
  if (pathMatchesPrefix(pathname, EMPLOYEE_PATHS)) return "employee";
  return null;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const required = pathRequiresRole(pathname);
  if (!required) return NextResponse.next();

  const token   = req.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySession(token);

  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (session.role !== required) {
    // Logged in as the wrong role — send them to their own home.
    const url = req.nextUrl.clone();
    url.pathname = ROLE_HOME[session.role];
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/search/:path*", "/review/:path*", "/upload/:path*", "/profile/:path*"],
};
