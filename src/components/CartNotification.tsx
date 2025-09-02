"use client";
import { useEffect, useState } from "react";
import { FaShoppingCart, FaCheck } from "react-icons/fa";

interface CartNotificationProps {
  show: boolean;
  productName: string;
  onHide: () => void;
}

const CartNotification = ({
  show,
  productName,
  onHide,
}: CartNotificationProps) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onHide();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onHide]);

  if (!show) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-5 duration-300">
      <div className="bg-green-500 text-white p-4 rounded-lg shadow-lg max-w-sm flex items-center gap-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
            <FaCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="flex-1">
          <p className="font-medium text-sm">Added to cart!</p>
          <p className="text-green-100 text-xs truncate">{productName}</p>
        </div>
        <button
          onClick={onHide}
          className="flex-shrink-0 text-green-200 hover:text-white transition-colors"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default CartNotification;
