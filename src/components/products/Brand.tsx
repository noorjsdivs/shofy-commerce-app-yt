"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { FaChevronDown } from "react-icons/fa";

interface BrandProps {
  brands?: string[];
}

const Brand = ({ brands = [] }: BrandProps) => {
  const [isOpen, setIsOpen] = useState(false); // Collapsed by default
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentBrand = searchParams.get("brand");

  const handleBrandClick = (brand: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("brand", brand);
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`/products${query}`);
  };

  return (
    <div className="w-full">
      {/* Accordion Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-3 px-0 text-left focus:outline-none group"
      >
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
          Shop by Brand
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
                {brands.map((brand, index) => {
                  const isActive = currentBrand === brand;
                  return (
                    <div key={index} className="flex items-center">
                      <input
                        type="radio"
                        id={`brand-${brand}`}
                        name="brand"
                        checked={isActive}
                        onChange={() => {}}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                      />
                      <button
                        onClick={() => handleBrandClick(brand)}
                        className="ml-2 text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors flex-1 text-left"
                      >
                        {brand}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Brand;
