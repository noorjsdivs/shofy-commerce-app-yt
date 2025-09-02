"use client";

import Link from "next/link";
import { FaLock, FaCrown, FaArrowRight } from "react-icons/fa";

interface PaidVersionOnlyProps {
  featureName?: string;
}

export default function PaidVersionOnly({
  featureName = "Admin Dashboard",
}: PaidVersionOnlyProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-200">
          {/* Icon */}
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full mx-auto flex items-center justify-center shadow-lg">
              <FaCrown className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-md">
              <FaLock className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Premium Feature
          </h1>

          {/* Description */}
          <p className="text-gray-600 mb-2 leading-relaxed">
            The{" "}
            <span className="font-semibold text-gray-900">{featureName}</span>{" "}
            is available only in the paid version.
          </p>

          <p className="text-sm text-gray-500 mb-8">
            Unlock advanced admin features, analytics, and more with our premium
            package.
          </p>

          {/* Features List */}
          <div className="bg-gray-50 rounded-lg p-4 mb-8 text-left">
            <h3 className="font-semibold text-gray-800 mb-3 text-center">
              Premium Features Include:
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Complete Admin Dashboard
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Advanced Analytics
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Order Management
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                User Management
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Premium Support
              </li>
            </ul>
          </div>

          {/* Purchase Button */}
          <Link
            href="https://buymeacoffee.com/reactbd/e/448682"
            className="inline-flex items-center justify-center w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl group"
          >
            <FaCrown className="w-5 h-5 mr-2" />
            Purchase Now
            <FaArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Support Text */}
          <p className="text-xs text-gray-500 mt-4">
            One-time purchase • Lifetime access • 30-day money-back guarantee
          </p>
        </div>
      </div>
    </div>
  );
}
