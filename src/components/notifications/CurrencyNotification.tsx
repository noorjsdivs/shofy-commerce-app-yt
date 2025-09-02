"use client";
import { useEffect, useState } from "react";
import { FiCheck, FiX } from "react-icons/fi";

interface CurrencyNotificationProps {
  isOpen: boolean;
  onClose: () => void;
  currencyName: string;
  currencySymbol: string;
  currencyCode: string;
}

const CurrencyNotification = ({
  isOpen,
  onClose,
  currencyName,
  currencySymbol,
  currencyCode,
}: CurrencyNotificationProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setProgress(100);

      // Start progress animation
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev <= 0) {
            clearInterval(progressInterval);
            return 0;
          }
          return prev - 100 / 30; // 30 steps for 3 seconds
        });
      }, 100);

      // Auto close after 3 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 3000);

      return () => {
        clearTimeout(timer);
        clearInterval(progressInterval);
      };
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // Wait for animation to complete
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop - subtle overlay */}
      <div className="fixed inset-0 z-50 pointer-events-none" />

      {/* Notification Modal */}
      <div
        className={`fixed bottom-6 right-6 z-50 transform transition-all duration-300 ease-out ${
          isVisible
            ? "translate-y-0 opacity-100 scale-100"
            : "translate-y-4 opacity-0 scale-95"
        }`}
      >
        <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden min-w-80 max-w-sm backdrop-blur-sm">
          {/* Header with success indicator */}
          <div className="bg-gradient-to-r from-theme-color to-sky-color px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <FiCheck className="text-white text-sm" />
              </div>
              <h3 className="text-white font-semibold text-sm">
                Currency Updated
              </h3>
            </div>
            <button
              onClick={handleClose}
              className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/20 backdrop-blur-sm"
            >
              <FiX className="text-sm" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-theme-color/10 to-sky-color/10 rounded-lg flex items-center justify-center border border-theme-color/20">
                <span className="text-xl font-bold text-theme-color">
                  {currencySymbol}
                </span>
              </div>
              <div>
                <p className="text-gray-900 font-medium text-sm">
                  Switched to {currencyName}
                </p>
                <p className="text-gray-500 text-xs">Code: {currencyCode}</p>
              </div>
            </div>

            <div className="bg-light-bg border border-theme-color/20 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-theme-color rounded-full flex items-center justify-center">
                  <FiCheck className="text-white text-xs" />
                </div>
                <p className="text-theme-color text-sm font-medium">
                  All prices updated automatically!
                </p>
              </div>
              <p className="text-light-text text-xs mt-1 ml-6">
                Product prices have been converted to {currencyCode}
              </p>
            </div>
          </div>

          {/* Progress bar for auto-close */}
          <div className="h-1 bg-gray-200">
            <div
              className="h-full bg-gradient-to-r from-theme-color to-blue-600 transition-all duration-100 ease-linear"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CurrencyNotification;
