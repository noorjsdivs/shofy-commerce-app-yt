import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { UserRole, getDefaultDashboardRoute } from "@/lib/rbac/roles";

// Define protected routes and their required roles
// Using array to ensure proper order (more specific routes first)
const PROTECTED_ROUTES: Array<{ route: string; roles: UserRole[] }> = [
  { route: "/account/admin", roles: ["admin"] },
  { route: "/admin", roles: ["admin"] },
  { route: "/delivery", roles: ["admin", "deliveryman"] },
  { route: "/packer", roles: ["admin", "packer"] },
  { route: "/accountant", roles: ["admin", "accountant"] },
  {
    route: "/account",
    roles: ["admin", "deliveryman", "packer", "accountant", "user"],
  },
];

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
  // More specific routes are checked first due to array order
  for (const { route, roles } of PROTECTED_ROUTES) {
    if (pathname.startsWith(route)) {
      return roles.includes(userRole);
    }
  }
  return true; // Allow access to unprotected routes
}
