"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import ProfileEditForm from "@/components/account/ProfileEditForm";
import Sidebar from "@/components/account/Sidebar";

interface UserProfile {
  firstName: string;
  lastName: string;
  phone: string;
  addresses: Address[];
}

interface Address {
  id?: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

export default function AccountClient() {
  const { data: session, update } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [orderCount, setOrderCount] = useState(0);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [userRole, setUserRole] = useState<string>("user");

  useEffect(() => {
    if (session?.user?.email) {
      fetchProfile();
    }
  }, [session?.user?.email]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(
        `/api/user/profile?email=${encodeURIComponent(
          session?.user?.email || ""
        )}`
      );
      const data = await response.json();

      if (data.profile) {
        setProfile(data.profile);
      }

      if (data.orders && Array.isArray(data.orders)) {
        setOrderCount(data.orders.length);
      }

      // Set user role
      if (data.role) {
        setUserRole(data.role);
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (updatedProfile: any) => {
    setUpdateLoading(true);
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session?.user?.email,
          profile: {
            firstName: updatedProfile.firstName,
            lastName: updatedProfile.lastName,
            phone: updatedProfile.phone,
          },
          name: `${updatedProfile.firstName} ${updatedProfile.lastName}`,
          image: updatedProfile.image,
          currentPassword: updatedProfile.currentPassword,
          newPassword: updatedProfile.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setProfile(data.profile);

        // Update session with new data
        await update({
          ...session,
          user: {
            ...session?.user,
            name: data.name,
            image: data.image,
          },
        });

        setIsEditProfileOpen(false);
      } else {
        throw new Error(data.error || "Failed to update profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile. Please try again.");
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8">
        <div className="animate-pulse">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 rounded w-48"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow p-8">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <div className="relative">
              {session?.user?.image ? (
                <img
                  src={session.user.image}
                  alt={session?.user?.name || "Profile"}
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-2xl font-semibold text-gray-600">
                    {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {session?.user?.name || "User"}
              </h2>
              <p className="text-gray-600">{session?.user?.email}</p>
              {profile?.phone && (
                <p className="text-gray-500 text-sm">{profile.phone}</p>
              )}
            </div>
          </div>
          <button
            onClick={() => setIsEditProfileOpen(true)}
            className="px-6 py-2 bg-theme-color text-white rounded-lg hover:bg-theme-color/90 transition-colors"
          >
            Edit Profile
          </button>
        </div>

        {/* Profile Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-theme-color mb-2">
              {orderCount}
            </div>
            <div className="text-gray-600">Total Orders</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-theme-color mb-2">
              {profile?.addresses?.length || 0}
            </div>
            <div className="text-gray-600">Saved Addresses</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-theme-color mb-2">
              {new Date().getFullYear() - 2024 || 1}
            </div>
            <div className="text-gray-600">Years with Us</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="border-t border-gray-200 pt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Quick Actions
          </h3>
          <div
            className={`grid grid-cols-1 md:grid-cols-2 ${
              userRole === "admin" ? "lg:grid-cols-3" : "lg:grid-cols-4"
            } gap-4`}
          >
            {/* Admin Dashboard Button - Only show for admin users */}
            {userRole === "admin" && (
              <Link
                href="/account/admin"
                className="flex items-center p-4 border-2 border-red-200 bg-red-50 rounded-lg hover:border-red-400 hover:bg-red-100 transition-colors group"
              >
                <div className="mr-3 text-2xl">👑</div>
                <div>
                  <div className="font-medium text-red-800 group-hover:text-red-900">
                    Admin Dashboard
                  </div>
                  <div className="text-sm text-red-600">Super user access</div>
                </div>
              </Link>
            )}

            <Link
              href="/account/addresses"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-theme-color transition-colors group"
            >
              <div className="mr-3 text-2xl">📍</div>
              <div>
                <div className="font-medium text-gray-900 group-hover:text-theme-color">
                  Manage Addresses
                </div>
                <div className="text-sm text-gray-500">
                  {profile?.addresses?.length || 0} saved
                </div>
              </div>
            </Link>

            <Link
              href="/account/orders"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-theme-color transition-colors group"
            >
              <div className="mr-3 text-2xl">🛍️</div>
              <div>
                <div className="font-medium text-gray-900 group-hover:text-theme-color">
                  Order History
                </div>
                <div className="text-sm text-gray-500">{orderCount} orders</div>
              </div>
            </Link>

            <Link
              href="/account/payment"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-theme-color transition-colors group"
            >
              <div className="mr-3 text-2xl">💳</div>
              <div>
                <div className="font-medium text-gray-900 group-hover:text-theme-color">
                  Payment Methods
                </div>
                <div className="text-sm text-gray-500">Manage cards</div>
              </div>
            </Link>

            <Link
              href="/account/settings"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-theme-color transition-colors group"
            >
              <div className="mr-3 text-2xl">⚙️</div>
              <div>
                <div className="font-medium text-gray-900 group-hover:text-theme-color">
                  Settings
                </div>
                <div className="text-sm text-gray-500">Privacy & security</div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Edit Profile Sidebar */}
      <Sidebar
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        title="Edit Profile"
      >
        <ProfileEditForm
          profile={{
            name: session?.user?.name || "",
            email: session?.user?.email || "",
            phone: profile?.phone || "",
            image: session?.user?.image || "",
          }}
          onSubmit={handleProfileUpdate}
          onCancel={() => setIsEditProfileOpen(false)}
          loading={updateLoading}
        />
      </Sidebar>
    </>
  );
}
