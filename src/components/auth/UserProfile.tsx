"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import {
  FaUser,
  FaSignOutAlt,
  FaCog,
  FaShoppingBag,
  FaHeart,
  FaChevronDown,
} from "react-icons/fa";

export default function UserProfile() {
  const { data: session, status } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (status === "loading") {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/auth/signin"
          className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
        >
          Sign In
        </Link>
        <span className="text-gray-300">|</span>
        <Link
          href="/auth/register"
          className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          Register
        </Link>
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        {session?.user?.image ? (
          <img
            src={session.user.image}
            alt={session.user.name || "User"}
            className="w-8 h-8 rounded-full border-2 border-gray-200"
          />
        ) : (
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <FaUser className="w-4 h-4 text-white" />
          </div>
        )}
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-700">
            {session?.user?.name?.split(" ")[0] || "User"}
          </p>
          <p className="text-xs text-gray-500 truncate max-w-32">
            {session?.user?.email}
          </p>
        </div>
        <FaChevronDown
          className={`w-3 h-3 text-gray-400 transition-transform ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4 border-b border-gray-100">
            <p className="font-medium text-gray-900">{session?.user?.name}</p>
            <p className="text-sm text-gray-500">{session?.user?.email}</p>
          </div>

          <div className="py-2">
            <Link
              href="/profile"
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsDropdownOpen(false)}
            >
              <FaUser className="w-4 h-4" />
              My Profile
            </Link>

            <Link
              href="/orders"
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsDropdownOpen(false)}
            >
              <FaShoppingBag className="w-4 h-4" />
              My Orders
            </Link>

            <Link
              href="/wishlist"
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsDropdownOpen(false)}
            >
              <FaHeart className="w-4 h-4" />
              Wishlist
            </Link>

            <Link
              href="/settings"
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsDropdownOpen(false)}
            >
              <FaCog className="w-4 h-4" />
              Settings
            </Link>
          </div>

          <div className="border-t border-gray-100">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <FaSignOutAlt className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
