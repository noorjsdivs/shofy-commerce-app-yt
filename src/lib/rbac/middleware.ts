import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { UserRole, getDefaultDashboardRoute } from "@/lib/rbac/roles";

// Define protected routes and their required roles
const PROTECTED_ROUTES: Record<string, UserRole[]> = {
  "/admin": ["admin"],
  "/delivery": ["admin", "deliveryman"],
  "/packer": ["admin", "packer"],
  "/accountant": ["admin", "accountant"],
  "/account": ["admin", "deliveryman", "packer", "accountant", "user"],
};

export async function withRoleAuth(
  request: NextRequest,
  requiredRoles: UserRole[]
) {
  const token = await getToken({ req: request });

  if (!token || !token.role) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  const userRole = token.role as UserRole;

  if (!requiredRoles.includes(userRole)) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return NextResponse.next();
}

export function checkRouteAccess(
  pathname: string,
  userRole: UserRole
): boolean {
  // Check if the path starts with any protected route
  for (const [route, allowedRoles] of Object.entries(PROTECTED_ROUTES)) {
    if (pathname.startsWith(route)) {
      return allowedRoles.includes(userRole);
    }
  }
  return true; // Allow access to unprotected routes
}
