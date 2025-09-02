"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { USER_ROLES, getDashboardRoute } from "@/lib/rbac/permissions";

export default function DashboardNavigation() {
  const { data: session } = useSession();

  if (!session?.user) {
    return null;
  }

  // @ts-ignore
  const userRole = session.user.role || USER_ROLES.USER;
  const dashboardRoute = getDashboardRoute(userRole as any);

  const getDashboardLabel = (role: string) => {
    switch (role) {
      case USER_ROLES.ADMIN:
        return "Admin Dashboard";
      case USER_ROLES.ACCOUNT:
        return "Accounting Dashboard";
      case USER_ROLES.PACKER:
        return "Packer Dashboard";
      case USER_ROLES.DELIVERYMAN:
        return "Delivery Dashboard";
      case USER_ROLES.USER:
      default:
        return "My Account";
    }
  };

  const getDashboardIcon = (role: string) => {
    switch (role) {
      case USER_ROLES.ADMIN:
        return "⚙️";
      case USER_ROLES.ACCOUNT:
        return "💰";
      case USER_ROLES.PACKER:
        return "📦";
      case USER_ROLES.DELIVERYMAN:
        return "🚚";
      case USER_ROLES.USER:
      default:
        return "👤";
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <Link
        href={dashboardRoute}
        className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
      >
        <span className="text-lg">{getDashboardIcon(userRole)}</span>
        <span className="hidden sm:inline">{getDashboardLabel(userRole)}</span>
      </Link>

      {/* Additional quick access for admin */}
      {userRole === USER_ROLES.ADMIN && (
        <div className="hidden md:flex items-center space-x-2">
          <Link
            href="/account-dashboard"
            className="flex items-center space-x-1 text-sm text-gray-600 hover:text-indigo-600 transition-colors"
          >
            <span>💰</span>
            <span>Accounting</span>
          </Link>
          <Link
            href="/packer-dashboard"
            className="flex items-center space-x-1 text-sm text-gray-600 hover:text-indigo-600 transition-colors"
          >
            <span>📦</span>
            <span>Packing</span>
          </Link>
          <Link
            href="/delivery-dashboard"
            className="flex items-center space-x-1 text-sm text-gray-600 hover:text-indigo-600 transition-colors"
          >
            <span>🚚</span>
            <span>Delivery</span>
          </Link>
        </div>
      )}
    </div>
  );
}
