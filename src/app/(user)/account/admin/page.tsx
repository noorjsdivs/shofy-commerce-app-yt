import Button from "@/components/ui/Button";
import { FiLock, FiExternalLink } from "react-icons/fi";
import { MdDashboard } from "react-icons/md";

export default function AdminDashboardPage() {
  return (
    <div className="bg-white rounded-lg shadow p-8 max-w-2xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <MdDashboard className="h-16 w-16 text-theme-color" />
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md">
              <FiLock className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Admin Dashboard
        </h2>
        <p className="text-lg text-theme-color font-semibold">
          Premium Feature
        </p>
      </div>

      {/* Content Section */}
      <div className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <p className="text-lg text-gray-700 mb-4">
            🚀 The Admin Dashboard is available in the{" "}
            <span className="font-semibold text-theme-color">
              Premium Version
            </span>
          </p>
          <p className="text-gray-600 mb-6">
            Unlock powerful admin features including:
          </p>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-center mb-2">
                <div className="w-3 h-3 bg-theme-color rounded-full mr-2"></div>
                <span className="font-medium text-gray-800">
                  User Management
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Complete user control & analytics
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-center mb-2">
                <div className="w-3 h-3 bg-theme-color rounded-full mr-2"></div>
                <span className="font-medium text-gray-800">
                  Order Management
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Advanced order tracking system
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-center mb-2">
                <div className="w-3 h-3 bg-theme-color rounded-full mr-2"></div>
                <span className="font-medium text-gray-800">
                  Analytics Dashboard
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Real-time insights & reports
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-center mb-2">
                <div className="w-3 h-3 bg-theme-color rounded-full mr-2"></div>
                <span className="font-medium text-gray-800">
                  Admin Controls
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Full system administration
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Button
            href="https://buymeacoffee.com/reactbd/e/448682"
            size="lg"
            className="inline-flex items-center bg-gradient-to-r from-theme-color to-theme-color/80 hover:from-theme-color/90 hover:to-theme-color text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
          >
            🎯 Upgrade to Premium
            <FiExternalLink className="ml-2 h-4 w-4" />
          </Button>

          <p className="text-sm text-gray-500 mt-4">
            Get instant access to all premium features and support the
            development!
          </p>
        </div>
      </div>
    </div>
  );
}
