import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE } from "@/modules/auth/constants";

const protectedPrefixes = ["/admin", "/workspace-config"];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isProtected = protectedPrefixes.some((prefix) =>
    pathname.startsWith(prefix),
  );

  if (!isProtected) return NextResponse.next();

  const hasSession = Boolean(request.cookies.get(AUTH_COOKIE)?.value);

  if (hasSession) return NextResponse.next();

  const loginUrl = new URL("/auth/login", request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/workspace-config/:path*", "/workspace-config"],
};
