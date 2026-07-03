import { NextResponse } from "next/server";

const protectedRoutes = ["/dashboard", "/habits", "/tasks", "/challenges", "/journal", "/calendar", "/analytics", "/settings", "/admin"];

function decodeJwtPayload(token) {
  try {
    const [, payload] = token.split(".");
    return JSON.parse(Buffer.from(payload, "base64").toString("utf8"));
  } catch {
    return null;
  }
}

export function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;

  const isProtected = protectedRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");

  if (!isProtected) {
    if (token && (pathname === "/login" || pathname === "/register")) {
      const payload = decodeJwtPayload(token);
      return NextResponse.redirect(new URL(payload?.role === "ADMIN" ? "/admin" : "/dashboard", request.url));
    }

    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const payload = decodeJwtPayload(token);
  if (isAdminRoute && payload?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
