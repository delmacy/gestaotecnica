import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE } from "@/modules/auth/constants";

const publicPrefixes = ["/auth", "/blocked"];

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isPublic = publicPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

  if (isPublic) return NextResponse.next();

  // Note: This proxy simply validates the existence of the session cookie for early rejection.
  // Profile-based authorization must be handled at the route/page level using
  // requireCurrentUser() and requireAccessProfile().
  const hasSession = Boolean(request.cookies.get(AUTH_COOKIE)?.value);

  if (hasSession) return NextResponse.next();

  const loginUrl = new URL("/auth/login", request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
