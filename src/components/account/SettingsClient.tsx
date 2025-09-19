"use client";

import { signOut } from "next-auth/react";

export default function SettingsClient() {
  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      // TODO: Implement account deletion
      console.log("Delete account requested");
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-600">
          Manage your account security and preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* Privacy Settings */}
        <div className="bg-white rounded-lg shadow p-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Privacy & Security
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3">
              <div>
                <div className="font-medium text-gray-900">
                  Two-Factor Authentication
                </div>
                <div className="text-sm text-gray-500">
                  Add an extra layer of security to your account
                </div>
              </div>
              <button className="px-4 py-2 text-theme-color border border-theme-color rounded-lg hover:bg-theme-color hover:text-white transition-colors">
                Enable
              </button>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <div className="font-medium text-gray-900">Login Activity</div>
                <div className="text-sm text-gray-500">
                  View recent login attempts and active sessions
                </div>
              </div>
              <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                View Activity
              </button>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <div className="font-medium text-gray-900">Data Export</div>
                <div className="text-sm text-gray-500">
                  Download a copy of your account data
                </div>
              </div>
              <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Export Data
              </button>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-white rounded-lg shadow p-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Account Actions
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3">
              <div>
                <div className="font-medium text-gray-900">Sign Out</div>
                <div className="text-sm text-gray-500">
                  Sign out of your account on this device
                </div>
              </div>
              <button
                onClick={() => signOut()}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Sign Out
              </button>
            </div>

            <div className="flex items-center justify-between py-3 border-t border-gray-200">
              <div>
                <div className="font-medium text-red-600">Delete Account</div>
                <div className="text-sm text-gray-500">
                  Permanently delete your account and all associated data
                </div>
              </div>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>

        {/* App Information */}
        <div className="bg-white rounded-lg shadow p-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">About</h3>

          <div className="space-y-2 text-sm text-gray-500">
            <div>Version: 1.0.0</div>
            <div>Last Updated: {new Date().toLocaleDateString()}</div>
            <div className="flex space-x-4">
              <a href="#" className="text-theme-color hover:underline">
                Terms of Service
              </a>
              <a href="#" className="text-theme-color hover:underline">
                Privacy Policy
              </a>
              <a href="#" className="text-theme-color hover:underline">
                Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
