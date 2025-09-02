"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { FaChevronDown } from "react-icons/fa";

interface ColorProps {
  allProducts?: any[];
}

const Color = ({ allProducts = [] }: ColorProps) => {
  const [isOpen, setIsOpen] = useState(false); // Collapsed by default
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentColor = searchParams.get("color");

  const handleColorClick = (color: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("color", color);
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`/products${query}`);
  };

  // Extract unique colors from products
  const extractColors = () => {
    const colorSet = new Set<string>();
    const colorMap = new Map<string, string>();

    // Predefined color mapping for common colors
    const colorMapping: { [key: string]: string } = {
      red: "#dc2626",
      blue: "#3b82f6",
      green: "#22c55e",
      yellow: "#f59e0b",
      black: "#000000",
      white: "#ffffff",
      gray: "#a3a3a3",
      grey: "#a3a3a3",
      purple: "#9333ea",
      pink: "#ec4899",
      orange: "#f97316",
      brown: "#92400e",
      navy: "#1e40af",
      maroon: "#991b1b",
      silver: "#d1d5db",
      gold: "#f59e0b",
      beige: "#f5f5dc",
      tan: "#d2b48c",
      cream: "#fffdd0",
      ivory: "#fffff0",
    };

    allProducts.forEach((product) => {
      if (product.title) {
        Object.keys(colorMapping).forEach((color) => {
          if (product.title.toLowerCase().includes(color.toLowerCase())) {
            colorSet.add(color);
            colorMap.set(color, colorMapping[color]);
          }
        });
      }
    });

    return Array.from(colorSet).map((color) => ({
      title: color.charAt(0).toUpperCase() + color.slice(1),
      base: colorMap.get(color) || "#9ca3af",
    }));
  };

  const colors = extractColors();

  return (
    <div className="w-full">
      {/* Accordion Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-3 px-0 text-left focus:outline-none group"
      >
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
          Shop by Color
        </h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FaChevronDown className="w-4 h-4 text-gray-500" />
        </motion.div>
      </button>

      {/* Accordion Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-2 pb-4">
              <div className="space-y-2">
                {colors.map((color, index) => {
                  const isActive = currentColor === color.title;
                  return (
                    <div key={index} className="flex items-center">
                      <input
                        type="radio"
                        id={`color-${color.title}`}
                        name="color"
                        checked={isActive}
                        onChange={() => {}}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                      />
                      <button
                        onClick={() => handleColorClick(color.title)}
                        className="ml-2 text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors flex-1 flex items-center gap-2 text-left"
                      >
                        <span
                          style={{ background: color.base }}
                          className="w-3 h-3 rounded-full border border-gray-300"
                        ></span>
                        {color.title}
                      </button>
                    </div>
                  );
                })}
                {colors.length === 0 && (
                  <div className="text-gray-400 italic text-sm">
                    No colors available
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Color;
