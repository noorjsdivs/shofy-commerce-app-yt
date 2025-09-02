"use client";

import Container from "@/components/Container";
import { useState } from "react";

const ProductsPageSkeleton = () => {
  const [isGridView, setIsGridView] = useState(true);

  return (
    <Container className="py-5">
      <div className="w-full h-full flex pb-20 gap-10">
        {/* Sidebar Skeleton */}
        <div className="w-full lg:w-2/12 hidden lg:inline-flex h-full">
          <div className="w-full h-fit bg-white border border-gray-200 rounded-lg p-4 space-y-6 animate-pulse">
            {/* Categories Section */}
            <div>
              <div className="h-6 bg-gray-200 rounded w-24 mb-4"></div>
              <div className="space-y-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
                ))}
              </div>
            </div>

            {/* Price Range Section */}
            <div>
              <div className="h-6 bg-gray-200 rounded w-20 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-8 bg-gray-200 rounded w-full"></div>
              </div>
            </div>

            {/* Brands Section */}
            <div>
              <div className="h-6 bg-gray-200 rounded w-16 mb-4"></div>
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
                ))}
              </div>
            </div>

            {/* Colors Section */}
            <div>
              <div className="h-6 bg-gray-200 rounded w-16 mb-4"></div>
              <div className="flex flex-wrap gap-2">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 bg-gray-200 rounded-full"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="w-full lg:w-10/12 h-full flex flex-col gap-10">
          {/* Header Controls */}
          <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="flex items-center gap-4">
              <div className="h-10 bg-gray-200 rounded w-32"></div>
              <div className="h-10 bg-gray-200 rounded w-24"></div>
            </div>
          </div>

          {/* Grid/List Toggle */}
          <div className="flex items-center justify-between animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-32"></div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsGridView(true)}
                className={`w-8 h-8 rounded ${
                  isGridView ? "bg-theme-color" : "bg-gray-200"
                }`}
              ></button>
              <button
                onClick={() => setIsGridView(false)}
                className={`w-8 h-8 rounded ${
                  !isGridView ? "bg-theme-color" : "bg-gray-200"
                }`}
              ></button>
            </div>
          </div>

          {/* Products Grid Skeleton */}
          {isGridView && (
            <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
              {[...Array(12)].map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          )}

          {/* Products List Skeleton */}
          {!isGridView && (
            <div className="w-full space-y-4">
              {[...Array(6)].map((_, index) => (
                <ProductListItemSkeleton key={index} />
              ))}
            </div>
          )}

          {/* Pagination Skeleton */}
          <div className="flex items-center justify-center gap-2 mt-8 animate-pulse">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-10 h-10 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
};

// Product Card Skeleton for Grid View
const ProductCardSkeleton = () => {
  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow animate-pulse">
      {/* Image Skeleton */}
      <div className="relative">
        <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
        {/* Wishlist button skeleton */}
        <div className="absolute top-2 right-2 w-8 h-8 bg-gray-200 rounded-full"></div>
        {/* Sale badge skeleton */}
        <div className="absolute top-2 left-2 w-12 h-6 bg-gray-200 rounded-full"></div>
      </div>

      {/* Content Skeleton */}
      <div className="space-y-3">
        {/* Category */}
        <div className="h-3 bg-gray-200 rounded w-20"></div>

        {/* Title */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
          ))}
          <div className="h-3 bg-gray-200 rounded w-8 ml-2"></div>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <div className="h-6 bg-gray-200 rounded w-16"></div>
          <div className="h-4 bg-gray-200 rounded w-12"></div>
          <div className="h-4 bg-gray-200 rounded-full w-8"></div>
        </div>

        {/* Stock indicator */}
        <div className="h-3 bg-gray-200 rounded w-16"></div>

        {/* Button */}
        <div className="h-10 bg-gray-200 rounded-lg w-full mt-4"></div>
      </div>
    </div>
  );
};

// Product List Item Skeleton for List View
const ProductListItemSkeleton = () => {
  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg p-6 shadow-sm animate-pulse">
      <div className="flex gap-6">
        {/* Image Skeleton */}
        <div className="w-40 h-40 bg-gray-200 rounded-lg flex-shrink-0"></div>

        {/* Content Skeleton */}
        <div className="flex-1 space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>

          {/* Features/Specs */}
          <div className="flex gap-4">
            <div className="h-6 bg-gray-200 rounded-full w-16"></div>
            <div className="h-6 bg-gray-200 rounded-full w-20"></div>
            <div className="h-6 bg-gray-200 rounded-full w-14"></div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-4 bg-gray-200 rounded w-12"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>

          {/* Price and Actions */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-3">
              <div className="h-8 bg-gray-200 rounded w-20"></div>
              <div className="h-6 bg-gray-200 rounded w-16 line-through"></div>
              <div className="h-6 bg-gray-200 rounded-full w-12"></div>
            </div>
            <div className="flex gap-3">
              <div className="h-10 bg-gray-200 rounded w-32"></div>
              <div className="h-10 bg-gray-200 rounded w-10"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPageSkeleton;
