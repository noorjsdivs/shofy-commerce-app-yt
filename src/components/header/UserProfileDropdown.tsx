"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { FaUser, FaBox, FaHeart, FaCog, FaSignOutAlt } from "react-icons/fa";
import { signOut } from "next-auth/react";

interface UserProfileDropdownProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

const UserProfileDropdown = ({ user }: UserProfileDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fallbackImage =
    "https://res.cloudinary.com/dlbqw7atu/image/upload/v1747734054/userImage_dhytay.png";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200); // Small delay to prevent accidental closing
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    {
      href: "/account",
      icon: FaUser,
      label: "My Profile",
    },
    {
      href: "/account/orders",
      icon: FaBox,
      label: "My Orders",
    },
    {
      href: "/favorite",
      icon: FaHeart,
      label: "Wishlist",
    },
    {
      href: "/account/settings",
      icon: FaCog,
      label: "Settings",
    },
  ];

  return (
    <div
      ref={dropdownRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Profile Trigger */}
      <div
        onClick={toggleDropdown}
        className="flex items-center gap-2 cursor-pointer group"
      >
        <Link href="/account" className="flex items-center">
          <div className="border border-gray-500 w-10 h-10 rounded-full text-xl overflow-hidden">
            <img
              src={!user?.image ? fallbackImage : user.image}
              alt={user?.name || "User"}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        </Link>
        <div
          onClick={(e) => {
            e.preventDefault();
            toggleDropdown();
          }}
          className="text-xs group-hover:text-sky-color cursor-pointer duration-300"
        >
          <p>Hello, {user?.name}</p>
          <p>view profile</p>
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 pt-1 w-48">
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-2 animate-in fade-in-0 zoom-in-95 duration-200">
            {/* User Info Header */}
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-sky-color transition-colors duration-200"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 my-1"></div>

            {/* Sign Out */}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
            >
              <FaSignOutAlt className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;
