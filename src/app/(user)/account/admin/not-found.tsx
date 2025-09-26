import Button from "@/components/ui/Button";
import { FiLock, FiExternalLink, FiArrowLeft } from "react-icons/fi";
import { MdError } from "react-icons/md";
import Link from "next/link";

export default function AdminNotFound() {
  return (
    <div className="bg-white rounded-lg shadow p-8 max-w-2xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <MdError className="h-16 w-16 text-red-500" />
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md">
              <FiLock className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Page Not Available
        </h2>
        <p className="text-lg text-red-600 font-semibold">
          Premium Feature Only
        </p>
      </div>

      {/* Content Section */}
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-lg text-gray-700 mb-4">
            🚫 This admin page is only available in the{" "}
            <span className="font-semibold text-theme-color">
              Premium Version
            </span>
          </p>
          <p className="text-gray-600 mb-6">
            The page you&apos;re trying to access has been restricted to premium
            users only.
          </p>

          {/* Info Box */}
          <div className="bg-white rounded-lg p-4 border border-red-200 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">
              Available in Premium:
            </h3>
            <div className="grid grid-cols-1 gap-2 text-sm text-gray-600">
              <div className="flex items-center justify-center">
                <div className="w-2 h-2 bg-theme-color rounded-full mr-2"></div>
                <span>Advanced User Management</span>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-2 h-2 bg-theme-color rounded-full mr-2"></div>
                <span>Complete Order Management System</span>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-2 h-2 bg-theme-color rounded-full mr-2"></div>
                <span>Detailed Analytics & Reports</span>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-2 h-2 bg-theme-color rounded-full mr-2"></div>
                <span>Full Administrative Controls</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Section */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/account/admin">
            <Button
              variant="outline"
              size="lg"
              className="inline-flex items-center"
            >
              <FiArrowLeft className="mr-2 h-4 w-4" />
              Back to Admin Dashboard
            </Button>
          </Link>

          <Button
            href="https://buymeacoffee.com/reactbd/e/448682"
            size="lg"
            className="inline-flex items-center bg-gradient-to-r from-theme-color to-theme-color/80 hover:from-theme-color/90 hover:to-theme-color text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
          >
            🎯 Upgrade to Premium
            <FiExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <p className="text-sm text-gray-500 text-center mt-4">
          Unlock all premium features with a one-time purchase!
        </p>
      </div>
    </div>
  );
}
