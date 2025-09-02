"use client";
import { useState } from "react";
import { FaFilter, FaChevronDown, FaChevronUp } from "react-icons/fa";

import Category from "./Category";
import Color from "./Color";
import Price from "./Price";
import Brand from "./Brand";

interface EnhancedProductsSideNavProps {
  categories?: any[];
  brands?: string[];
  allProducts?: any[];
}

const EnhancedProductsSideNav = ({
  categories = [],
  brands = [],
  allProducts = [],
}: EnhancedProductsSideNavProps) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Mobile Filter Toggle Header */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className="w-full bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <FaFilter className="w-4 h-4 text-gray-600" />
            <h2 className="font-semibold text-gray-900">Filters</h2>
          </div>
          {isFiltersOpen ? (
            <FaChevronUp className="w-4 h-4 text-gray-600" />
          ) : (
            <FaChevronDown className="w-4 h-4 text-gray-600" />
          )}
        </button>
      </div>

      {/* Desktop Filter Header */}
      <div className="hidden lg:block bg-gray-50 px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <FaFilter className="w-4 h-4 text-gray-600" />
          <h2 className="font-semibold text-gray-900">Filters</h2>
        </div>
      </div>

      {/* Filter Content */}
      <div className={`${isFiltersOpen ? "block" : "hidden"} lg:block`}>
        <div className="p-4 space-y-6">
          <Category categories={categories} allProducts={allProducts} />
          <Color allProducts={allProducts} />
          <Brand brands={brands} />
          <Price allProducts={allProducts} />
        </div>
      </div>
    </div>
  );
};

export default EnhancedProductsSideNav;
