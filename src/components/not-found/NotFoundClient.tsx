"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function NotFoundClient() {
  const router = useRouter();
  const pathname = usePathname();
  const [countdown, setCountdown] = useState(10);
  const [showCountdown, setShowCountdown] = useState(false);

  // Auto-redirect countdown (only starts when user clicks "Auto Redirect")
  useEffect(() => {
    if (!showCountdown) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          router.push("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showCountdown, router]);

  const handleAutoRedirect = () => {
    setShowCountdown(true);
  };

  const handleCancelRedirect = () => {
    setShowCountdown(false);
    setCountdown(10);
  };

  return (
    <div className="space-y-4">
      {/* Current Path Display */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-xl mx-auto">
        <p className="text-red-700">
          <span className="font-medium">Requested URL:</span>{" "}
          <code className="bg-red-100 px-2 py-1 rounded text-sm font-mono">
            {pathname}
          </code>
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Link
          href="/"
          className="px-8 py-3 bg-theme-color text-white rounded-xl hover:bg-theme-color/90 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          🏠 Back to Home
        </Link>

        <button
          onClick={() => router.back()}
          className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-medium hover:border-gray-400 transform hover:-translate-y-0.5"
        >
          ← Go Back
        </button>

        {!showCountdown ? (
          <button
            onClick={handleAutoRedirect}
            className="px-8 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            🚀 Auto Redirect
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <div className="text-center">
              <div className="text-lg font-semibold text-theme-color">
                Redirecting in {countdown}s
              </div>
              <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                <div
                  className="bg-theme-color h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${(countdown / 10) * 100}%` }}
                ></div>
              </div>
            </div>
            <button
              onClick={handleCancelRedirect}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Browser Actions */}
      <div className="flex justify-center items-center gap-4 text-sm text-gray-500">
        <span>or try</span>
        <button
          onClick={() => window.location.reload()}
          className="text-blue-600 hover:text-blue-800 underline"
        >
          refreshing the page
        </button>
      </div>
    </div>
  );
}
