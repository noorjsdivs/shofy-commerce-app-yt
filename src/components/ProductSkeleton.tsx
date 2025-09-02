import React from "react";

interface ProductSkeletonProps {
  variant?: "grid" | "list";
}

export default function ProductSkeleton({
  variant = "grid",
}: ProductSkeletonProps) {
  if (variant === "list") {
    // List view skeleton
    return (
      <div className="flex bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
        {/* Image skeleton */}
        <div className="w-32 h-32 bg-gray-300 rounded-lg flex-shrink-0"></div>

        {/* Content skeleton */}
        <div className="ml-4 flex-1 space-y-3">
          {/* Title skeleton */}
          <div className="h-5 bg-gray-300 rounded w-3/4"></div>

          {/* Price skeleton */}
          <div className="flex items-center space-x-2">
            <div className="h-6 bg-gray-300 rounded w-20"></div>
            <div className="h-5 bg-gray-200 rounded w-16"></div>
          </div>

          {/* Rating skeleton */}
          <div className="flex items-center space-x-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-4 h-4 bg-gray-300 rounded"></div>
            ))}
            <div className="h-4 bg-gray-300 rounded w-8 ml-2"></div>
          </div>

          {/* Buttons skeleton */}
          <div className="flex space-x-2 pt-2">
            <div className="h-10 bg-gray-300 rounded w-32"></div>
            <div className="h-10 bg-gray-300 rounded w-10"></div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view skeleton (default)
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm animate-pulse">
      {/* Image skeleton */}
      <div className="w-full h-56 bg-gray-300"></div>

      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Title skeleton */}
        <div className="h-5 bg-gray-300 rounded w-4/5"></div>

        {/* Price skeleton */}
        <div className="flex items-center space-x-2">
          <div className="h-6 bg-gray-300 rounded w-20"></div>
          <div className="h-5 bg-gray-200 rounded w-16"></div>
        </div>

        {/* Discount badge skeleton */}
        <div className="h-6 bg-gray-300 rounded w-16"></div>

        {/* Rating skeleton */}
        <div className="flex items-center space-x-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-4 h-4 bg-gray-300 rounded"></div>
          ))}
          <div className="h-4 bg-gray-300 rounded w-8 ml-2"></div>
        </div>

        {/* Buttons skeleton */}
        <div className="flex space-x-2 pt-2">
          <div className="h-10 bg-gray-300 rounded flex-1"></div>
          <div className="h-10 bg-gray-300 rounded w-10"></div>
        </div>
      </div>
    </div>
  );
}
