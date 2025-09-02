"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";

interface PriceProps {
  allProducts?: any[];
}

const Price = ({ allProducts = [] }: PriceProps) => {
  const [isOpen, setIsOpen] = useState(false); // Collapsed by default
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentMinPrice = searchParams.get("min_price");
  const currentMaxPrice = searchParams.get("max_price");

  const handlePriceClick = (minPrice: number, maxPrice: number) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("min_price", minPrice.toString());
    current.set("max_price", maxPrice.toString());
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`/products${query}`);
  };

  // Generate dynamic price ranges based on product data
  const generatePriceRanges = () => {
    if (allProducts.length === 0) return [];

    const prices = allProducts
      .map((product: any) => product.price)
      .sort((a: number, b: number) => a - b);
    const minPrice = Math.floor(prices[0] || 0);
    const maxPrice = Math.ceil(prices[prices.length - 1] || 1000);

    const ranges = [
      { min: 0, max: 50 },
      { min: 50, max: 100 },
      { min: 100, max: 200 },
      { min: 200, max: 400 },
      { min: 400, max: 600 },
      { min: 600, max: maxPrice },
    ];

    return ranges.filter((range) => range.max <= maxPrice + 100);
  };

  const priceRanges = generatePriceRanges();

  return (
    <div className="w-full">
      {/* Accordion Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-3 px-0 text-left focus:outline-none group"
      >
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
          Shop by Price
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
                {priceRanges.map((range, index) => {
                  const isActive =
                    currentMinPrice === range.min.toString() &&
                    currentMaxPrice === range.max.toString();
                  const priceRangeId = `price-${range.min}-${range.max}`;

                  return (
                    <div key={index} className="flex items-center">
                      <input
                        type="radio"
                        id={priceRangeId}
                        name="priceRange"
                        checked={isActive}
                        onChange={() => {}}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                      />
                      <button
                        onClick={() => handlePriceClick(range.min, range.max)}
                        className="ml-2 text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors flex-1 text-left"
                      >
                        ${range.min.toFixed(2)} - ${range.max.toFixed(2)}
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

export default Price;
