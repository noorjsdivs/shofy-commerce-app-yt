export const config = {
  matcher: [
    "/account/:path*",
    "/cart/:path*",
    "/auth/:path*",
    "/success/:path*",
    "/checkout/:path*",
    "/admin/:path*",
    "/delivery-dashboard/:path*",
    "/packer-dashboard/:path*",
    "/account-dashboard/:path*",
    "/user-dashboard/:path*",
    "/dashboard/:path*",
  ],
};

import { NextResponse } from "next/server";
import { auth } from "./auth";
import { checkRouteAccess } from "@/lib/rbac/middleware";
import { UserRole, getDefaultDashboardRoute } from "@/lib/rbac/roles";

const protectedRoutes = [
  "/account",
  "/checkout",
  "/success",
  "/admin",
  "/delivery-dashboard",
  "/packer-dashboard",
  "/account-dashboard",
  "/user-dashboard",
  "/dashboard",
];
const authRoutes = ["/auth/signin", "/auth/register"];

export async function middleware(request: any) {
  const { pathname } = request.nextUrl;
  const session = await auth();

  // Log for debugging (remove in production)
  console.log(
    `Middleware: ${pathname}, User: ${
      session?.user?.email || "Not logged in"
    }, Role: ${session?.user?.role || "No role"}`
  );

  // Restrict protected routes to logged-in users
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!session?.user) {
      console.log(`Redirecting ${pathname} to signin - No session`);
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }

    // Check role-based access
    const userRole = session.user.role as UserRole;
    if (!checkRouteAccess(pathname, userRole)) {
      console.log(`Access denied for role ${userRole} to ${pathname}`);
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  // Prevent access to auth pages for logged-in users
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (session?.user) {
      const userRole = session.user.role as UserRole;
      const dashboardRoute = getDefaultDashboardRoute(userRole);
      return NextResponse.redirect(new URL(dashboardRoute, request.url));
    }
  }

  // Handle success page - ensure user is logged in and has session_id
  if (pathname.startsWith("/success")) {
    if (!session?.user) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }

    const sessionId = request.nextUrl.searchParams.get("session_id");
    if (!sessionId) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Handle checkout page - ensure user is logged in
  if (pathname.startsWith("/checkout")) {
    if (!session?.user) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
  }

  return NextResponse.next();
}
