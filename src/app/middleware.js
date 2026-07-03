import { NextResponse } from "next/server";

const protectedRoutes = ["/dashboard", "/habits", "/tasks", "/challenges", "/journal", "/calendar", "/analytics", "/settings", "/admin"];

export function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;

  if (protectedRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/habits", "/tasks", "/challenges", "/journal", "/calendar", "/analytics", "/settings", "/admin"],
};
