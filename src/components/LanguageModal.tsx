import { FiX, FiGlobe } from "react-icons/fi";

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LanguageModal = ({ isOpen, onClose }: LanguageModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background overlay */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white shadow-xl rounded-lg overflow-hidden z-10">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiGlobe className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Language Selection
              </h3>
              <p className="text-sm text-gray-600">
                Choose your preferred language
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
          {/* Current Language */}
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-sm font-semibold text-green-700">EN</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">
                  English (Current)
                </h4>
                <p className="text-sm text-gray-600">Fully supported</p>
              </div>
            </div>
          </div>

          {/* Coming Soon Languages */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 mb-3">Coming Soon</h4>

            {[
              { code: "ES", name: "Español", status: "Coming Soon" },
              { code: "FR", name: "Français", status: "Coming Soon" },
              { code: "DE", name: "Deutsch", status: "Coming Soon" },
              { code: "IT", name: "Italiano", status: "Coming Soon" },
              { code: "PT", name: "Português", status: "Coming Soon" },
            ].map((lang) => (
              <div
                key={lang.code}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg opacity-60"
              >
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-sm font-semibold text-gray-500">
                    {lang.code}
                  </span>
                </div>
                <div className="flex-1">
                  <h5 className="font-medium text-gray-700">{lang.name}</h5>
                  <p className="text-sm text-gray-500">{lang.status}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Currently supported:</strong> English only. We&apos;re
              working on adding more languages soon!
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageModal;
