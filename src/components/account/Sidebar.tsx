"use client";

import React, { useEffect, useState } from "react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: string;
}

export default function Sidebar({
  isOpen,
  onClose,
  title,
  children,
  width = "w-96",
}: SidebarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle visibility and animation states
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Small delay to ensure DOM is ready for animation
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      // Wait for animation to complete before hiding
      setTimeout(() => setIsVisible(false), 350);
    }
  }, [isOpen]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay with staggered animation */}
      <div
        className={`
          fixed inset-0 z-40 transition-all duration-300 ease-out
          ${isAnimating ? "bg-black/50" : "bg-black/0"}
        `}
        onClick={onClose}
        style={{
          backdropFilter: isAnimating ? "blur(2px)" : "blur(0px)",
          WebkitBackdropFilter: isAnimating ? "blur(2px)" : "blur(0px)",
        }}
      />

      {/* Sidebar with enhanced animations */}
      <div
        className={`
          fixed inset-y-0 right-0 z-50
          ${width}
          bg-white shadow-2xl
          flex flex-col
          transform transition-all duration-350 ease-out
          ${
            isAnimating
              ? "translate-x-0 opacity-100"
              : "translate-x-full opacity-0"
          }
        `}
        style={{
          transitionProperty: "transform, opacity, box-shadow",
          transitionTimingFunction: "cubic-bezier(0.4, 0.0, 0.2, 1)",
        }}
      >
        {/* Header with slide-in animation */}
        <div
          className={`
            flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50 flex-shrink-0
            transition-all duration-400 ease-out
            ${
              isAnimating
                ? "translate-y-0 opacity-100"
                : "-translate-y-4 opacity-0"
            }
          `}
          style={{
            transitionDelay: isAnimating ? "100ms" : "0ms",
          }}
        >
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
            aria-label="Close"
          >
            <svg
              className="w-5 h-5 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content with slide-in animation */}
        <div
          className={`
            flex-1 overflow-y-auto
            transition-all duration-400 ease-out
            ${
              isAnimating
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }
          `}
          style={{
            transitionDelay: isAnimating ? "200ms" : "0ms",
          }}
        >
          <div className="p-6">{children}</div>
        </div>
      </div>
    </>
  );
}
