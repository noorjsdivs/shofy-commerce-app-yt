"use client";

import { useSession } from "next-auth/react";

export default function PaymentClient() {
  const { data: session } = useSession();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payment Methods</h1>
        <p className="text-gray-600">
          Manage your saved payment methods and billing information
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-8">
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-3xl">💳</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Payment Methods
          </h3>
          <p className="text-gray-500 mb-6">
            Manage your saved payment methods and billing information
          </p>

          <div className="max-w-md mx-auto space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-6 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                    VISA
                  </div>
                  <div>
                    <div className="font-medium">•••• •••• •••• 4242</div>
                    <div className="text-sm text-gray-500">Expires 12/26</div>
                  </div>
                </div>
                <button className="text-red-600 hover:text-red-800 text-sm">
                  Remove
                </button>
              </div>
            </div>

            <button className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-theme-color hover:text-theme-color transition-colors">
              + Add New Payment Method
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
