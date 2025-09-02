import React from "react";
import Container from "../../../components/Container";
import ProductSkeleton from "../../../components/ProductSkeleton";

export default function OffersLoading() {
  return (
    <Container className="py-10">
      {/* Header Skeleton */}
      <div className="text-center mb-8">
        <div className="h-10 bg-gray-300 rounded w-64 mx-auto mb-4 animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
      </div>

      {/* Hero Section Skeleton */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-8 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="text-center">
              <div className="h-8 bg-gray-300 rounded w-16 mx-auto mb-2 animate-pulse"></div>
              <div className="h-5 bg-gray-200 rounded w-20 mx-auto animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters Section Skeleton */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <div className="h-6 bg-gray-300 rounded w-32 animate-pulse"></div>
          <div className="flex gap-4">
            <div className="h-10 bg-gray-300 rounded w-20 animate-pulse"></div>
            <div className="h-10 bg-gray-300 rounded w-32 animate-pulse"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index}>
              <div className="h-5 bg-gray-300 rounded w-24 mb-2 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Products Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 12 }).map((_, index) => (
          <ProductSkeleton key={index} variant="grid" />
        ))}
      </div>
    </Container>
  );
}
