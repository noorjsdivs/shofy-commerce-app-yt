"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AccountantRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the new account dashboard route
    router.replace("/account-dashboard");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">
          Redirecting to Account Dashboard...
        </p>
      </div>
    </div>
  );
}
