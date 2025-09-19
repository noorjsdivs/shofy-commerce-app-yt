"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Container from "@/components/Container";
import { FiLoader, FiShield } from "react-icons/fi";
import Link from "next/link";

interface AdminProtectedRouteProps {
  children: React.ReactNode;
  fallbackPath?: string;
  loadingMessage?: string;
}

const AdminProtectedRoute = ({
  children,
  fallbackPath = "/account",
  loadingMessage = "Checking admin permissions...",
}: AdminProtectedRouteProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (status === "loading") {
      return; // Still loading
    }

    // Check if user is not authenticated
    if (status === "unauthenticated" || !session?.user) {
      setIsRedirecting(true);
      const timer = setTimeout(() => {
        router.push("/auth/signin");
      }, 1500);
      return () => clearTimeout(timer);
    }

    // Check if user is authenticated but not admin
    if (session?.user && session.user.role !== "admin") {
      setIsRedirecting(true);
      const timer = setTimeout(() => {
        router.push(fallbackPath);
      }, 1500);
      return () => clearTimeout(timer);
    } else if (session?.user?.role === "admin") {
      setIsRedirecting(false);
    }
  }, [session, status, router, fallbackPath]);

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <Container className="py-8">
        <div className="flex flex-col items-center justify-center min-h-96">
          <FiLoader className="animate-spin text-4xl text-theme-color mb-4" />
          <p className="text-gray-600">{loadingMessage}</p>
        </div>
      </Container>
    );
  }

  // Show redirect message when unauthenticated
  if (status === "unauthenticated" || !session?.user) {
    return (
      <Container className="py-8">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Authentication Required
          </h1>
          <p className="text-gray-600 mb-6">
            You need to be signed in to access this page.
          </p>

          <div className="flex items-center justify-center space-x-4 mb-6">
            <FiLoader className="animate-spin text-xl text-theme-color" />
            <span className="text-gray-500">Redirecting to sign in...</span>
          </div>

          <Link
            href="/auth/signin"
            className="inline-block bg-theme-color text-white px-6 py-2 rounded hover:bg-theme-color/80"
          >
            Sign In
          </Link>
        </div>
      </Container>
    );
  }

  // Show access denied message for non-admin users
  if (session?.user && session.user.role !== "admin" && !isRedirecting) {
    return (
      <Container className="py-8">
        <div className="text-center">
          <div className="text-6xl mb-4">🛡️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Admin Access Required
          </h1>
          <p className="text-gray-600 mb-6">
            You need admin privileges to access this page.
          </p>

          {/* Debug information */}
          <div className="bg-gray-100 p-4 rounded mb-4 text-sm text-left max-w-md mx-auto">
            <div className="mb-2">
              <strong>Current User:</strong> {session.user.email}
            </div>
            <div className="mb-2">
              <strong>Current Role:</strong> {session.user.role || "No role"}
            </div>
            <div>
              <strong>Required Role:</strong> admin
            </div>
          </div>

          <div className="flex items-center justify-center space-x-4 mb-6">
            <FiShield className="text-xl text-red-500" />
            <span className="text-gray-500">
              Access denied - Redirecting...
            </span>
          </div>

          <div className="space-x-4">
            <Link
              href="/account"
              className="inline-block bg-theme-color text-white px-6 py-2 rounded hover:bg-theme-color/80"
            >
              Go to Account
            </Link>
            <Link
              href="/"
              className="inline-block bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
            >
              Go Home
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  // Show redirecting message
  if (isRedirecting) {
    return (
      <Container className="py-8">
        <div className="flex flex-col items-center justify-center min-h-96">
          <FiLoader className="animate-spin text-4xl text-theme-color mb-4" />
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </Container>
    );
  }

  // Render children if user is admin
  return <>{children}</>;
};

export default AdminProtectedRoute;
