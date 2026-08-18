import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token");
  const path = request.nextUrl.pathname;

  if (path.startsWith("/auth/login") && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (path.startsWith("/auth/login") && !token) {
    return NextResponse.next();
  }

  if (path.startsWith("/api") || path.startsWith("/_next") || path.startsWith("/favicon")) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
