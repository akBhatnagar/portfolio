import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin-login")) {
    const sessionToken = request.cookies.get("admin_session")?.value;

    if (!sessionToken) {
      const loginUrl = new URL("/admin-login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Session validation happens server-side in the admin layout via validateSession().
    // The middleware acts as a fast guard — if no cookie at all, redirect immediately.
    // Detailed session expiry/inactivity checks are in the admin layout server component.
  }

  if (pathname.startsWith("/api/admin")) {
    const sessionToken = request.cookies.get("admin_session")?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
