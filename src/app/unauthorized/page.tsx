"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import Container from "@/components/Container";
import { getDefaultDashboardRoute, getRoleDisplayName } from "@/lib/rbac/roles";
import { FiAlertTriangle } from "react-icons/fi";

export default function Unauthorized() {
  const { data: session } = useSession();
  const userRole = session?.user?.role || "user";
  const defaultRoute = getDefaultDashboardRoute(userRole);
  const roleDisplayName = getRoleDisplayName(userRole);

  return (
    <Container>
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="flex justify-center mb-6">
            <FiAlertTriangle className="text-red-500 text-6xl" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>

          <p className="text-gray-600 mb-6">
            You don&apos;t have permission to access this page. Your current
            role is{" "}
            <span className="font-semibold text-sky-600">
              {roleDisplayName}
            </span>
            .
          </p>

          <div className="space-y-3">
            <Link
              href={defaultRoute}
              className="block w-full bg-sky-600 text-white py-2 px-4 rounded-lg hover:bg-sky-700 transition-colors duration-200"
            >
              Go to My Dashboard
            </Link>

            <Link
              href="/"
              className="block w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              Return to Home
            </Link>
          </div>

          <p className="text-sm text-gray-500 mt-6">
            If you believe this is an error, please contact your administrator.
          </p>
        </div>
      </div>
    </Container>
  );
}
