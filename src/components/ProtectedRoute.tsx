"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Container from "@/components/Container";
import { FiLoader } from "react-icons/fi";
import Link from "next/link";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallbackPath?: string;
  loadingMessage?: string;
}

const ProtectedRoute = ({
  children,
  fallbackPath = "/auth/signin",
  loadingMessage = "Checking authentication...",
}: ProtectedRouteProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (status === "loading") {
      return; // Still loading
    }

    if (status === "unauthenticated" || !session?.user) {
      setIsRedirecting(true);
      // Add a small delay to show the message before redirecting
      const timer = setTimeout(() => {
        router.push(fallbackPath);
      }, 1500);

      return () => clearTimeout(timer);
    } else {
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
  if (
    status === "unauthenticated" ||
    (!session?.user && status === "authenticated") ||
    isRedirecting
  ) {
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

          {/* Debug information */}
          <div className="bg-gray-100 p-4 rounded mb-4 text-sm text-left">
            <div>
              <strong>Status:</strong> {status}
            </div>
            <div>
              <strong>Has Session:</strong> {session ? "Yes" : "No"}
            </div>
            <div>
              <strong>Has User:</strong> {session?.user ? "Yes" : "No"}
            </div>
            {session?.user && (
              <div>
                <strong>User Email:</strong> {session.user.email}
              </div>
            )}
          </div>

          <div className="flex items-center justify-center space-x-4 mb-6">
            <FiLoader className="animate-spin text-xl text-theme-color" />
            <span className="text-gray-500">Checking authentication...</span>
          </div>

          <div className="space-x-4">
            <Link
              href="/auth/signin"
              className="inline-block bg-theme-color text-white px-6 py-2 rounded hover:bg-theme-color/80"
            >
              Sign In
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="inline-block bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </Container>
    );
  }

  // Render children if authenticated
  return <>{children}</>;
};

export default ProtectedRoute;
