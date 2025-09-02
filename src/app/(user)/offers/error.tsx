"use client";
import React from "react";
import Link from "next/link";
import { FiRefreshCw, FiHome, FiShoppingBag } from "react-icons/fi";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const OffersError: React.FC<ErrorProps> = ({ error, reset }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center px-4">
        <div className="mb-8">
          <div className="text-6xl mb-4">🔥💔</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Oops! Offers Temporarily Unavailable
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            We&apos;re having trouble loading our amazing deals right now.
          </p>
          <p className="text-gray-500 mb-8">
            Don&apos;t worry, our offers will be back shortly!
          </p>

          {process.env.NODE_ENV === "development" && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-left max-w-lg mx-auto">
              <h3 className="text-red-800 font-semibold mb-2">
                Error Details:
              </h3>
              <p className="text-red-700 text-sm font-mono">{error.message}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            <FiRefreshCw className="w-5 h-5" />
            Try Again
          </button>

          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            <FiHome className="w-5 h-5" />
            Go Home
          </Link>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            <FiShoppingBag className="w-5 h-5" />
            Browse Products
          </Link>
        </div>

        <div className="mt-12 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            While you wait, check out:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <Link
              href="/products?category=bestsellers"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              🌟 Best Sellers
            </Link>
            <Link
              href="/products?category=new"
              className="text-green-600 hover:text-green-700 font-medium"
            >
              ✨ New Arrivals
            </Link>
            <Link
              href="/categories"
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              📂 All Categories
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OffersError;
