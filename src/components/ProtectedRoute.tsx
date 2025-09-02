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
    if (status === "loading") return; // Still loading

    if (status === "unauthenticated" || !session?.user) {
      setIsRedirecting(true);
      // Add a small delay to show the message before redirecting
      const timer = setTimeout(() => {
        router.push(fallbackPath);
      }, 1500);

      return () => clearTimeout(timer);
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
  if (status === "unauthenticated" || !session?.user || isRedirecting) {
    return (
      <Container className="py-8">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Authentication Required
          </h1>
          <p className="text-gray-600 mb-6">
            You need to be signed in to access this page. Redirecting to sign
            in...
          </p>
          <div className="flex items-center justify-center space-x-4">
            <FiLoader className="animate-spin text-xl text-theme-color" />
            <span className="text-gray-500">Redirecting...</span>
          </div>
          <div className="mt-6">
            <Link
              href="/auth/signin"
              className="text-theme-color hover:text-theme-color/80 underline"
            >
              Click here if not redirected automatically
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  // Render children if authenticated
  return <>{children}</>;
};

export default ProtectedRoute;
