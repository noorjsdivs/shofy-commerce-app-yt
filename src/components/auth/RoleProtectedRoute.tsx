"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import { USER_ROLES, getDashboardRoute } from "@/lib/rbac/permissions";

interface RoleProtectedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
}

export default function RoleProtectedRoute({
  children,
  allowedRoles,
  redirectTo,
}: RoleProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user) {
      router.push("/auth/signin");
      return;
    }

    // @ts-ignore
    const userRole = session.user.role || USER_ROLES.USER;

    if (!allowedRoles.includes(userRole)) {
      // Redirect to user's appropriate dashboard or specified redirect
      const redirectRoute = redirectTo || getDashboardRoute(userRole as any);
      router.push(redirectRoute);
      return;
    }
  }, [session, status, allowedRoles, redirectTo, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  // @ts-ignore
  const userRole = session.user.role || USER_ROLES.USER;

  if (!allowedRoles.includes(userRole)) {
    return null;
  }

  return <>{children}</>;
}
