import { FiX, FiTruck, FiClock, FiMapPin, FiDollarSign } from "react-icons/fi";

interface ShippingModalProps {
  isOpen: boolean;
  onClose: () => void;
  freeShippingThreshold: string;
}

const ShippingModal = ({
  isOpen,
  onClose,
  freeShippingThreshold,
}: ShippingModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background overlay */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white shadow-xl rounded-lg overflow-hidden z-10 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <FiTruck className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Free Express Shipping
              </h3>
              <p className="text-sm text-gray-600">
                Fast & reliable delivery to your doorstep
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="px-6 py-6">
          {/* Free Shipping Offer */}
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              <FiDollarSign className="w-8 h-8 text-orange-600" />
              <div>
                <h4 className="text-lg font-semibold text-gray-900">
                  Free on orders ${freeShippingThreshold}+
                </h4>
                <p className="text-sm text-gray-600">
                  Enjoy free express shipping on all orders above $
                  {freeShippingThreshold}
                </p>
              </div>
            </div>
          </div>

          {/* Shipping Details */}
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-blue-100 rounded-lg mt-1">
                <FiClock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h5 className="font-semibold text-gray-900">Delivery Time</h5>
                <p className="text-sm text-gray-600 mt-1">
                  Express shipping typically takes 1-3 business days within the
                  continental US. International orders may take 5-10 business
                  days.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-2 bg-green-100 rounded-lg mt-1">
                <FiMapPin className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h5 className="font-semibold text-gray-900">Coverage Area</h5>
                <p className="text-sm text-gray-600 mt-1">
                  We ship to all 50 US states, Canada, and most international
                  destinations. Free shipping applies to domestic orders only.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-2 bg-purple-100 rounded-lg mt-1">
                <FiTruck className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h5 className="font-semibold text-gray-900">Tracking</h5>
                <p className="text-sm text-gray-600 mt-1">
                  All express shipments include tracking information.
                  You&apos;ll receive an email with tracking details once your
                  order ships.
                </p>
              </div>
            </div>
          </div>

          {/* Additional Terms */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h5 className="font-semibold text-gray-900 mb-2">
              Terms & Conditions
            </h5>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Free shipping offer applies to standard items only</li>
              <li>• Oversized or heavy items may incur additional charges</li>
              <li>
                • Orders placed before 2 PM EST ship the same business day
              </li>
              <li>• Weekend and holiday orders ship the next business day</li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingModal;
