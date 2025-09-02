"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { FiArrowRight, FiPackage } from "react-icons/fi";

interface Category {
  slug: string;
  name: string;
  url: string;
  count?: number;
}

interface InfiniteCategoryGridProps {
  initialCategories: Category[];
  totalProducts?: number;
}

// Category skeleton component
const CategorySkeleton = () => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full animate-pulse">
    <div className="h-32 lg:h-40 bg-gray-200"></div>
    <div className="p-3 lg:p-4">
      <div className="h-4 lg:h-5 bg-gray-200 rounded mb-2"></div>
      <div className="h-3 bg-gray-200 rounded mb-1"></div>
      <div className="h-3 bg-gray-200 rounded w-3/4 mb-3"></div>
      <div className="flex items-center justify-between">
        <div className="h-3 bg-gray-200 rounded w-20"></div>
        <div className="h-3 w-3 bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>
);

// Category images mapping
const categoryImages: { [key: string]: string } = {
  beauty:
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop",
  fragrances:
    "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=300&fit=crop",
  furniture:
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
  groceries:
    "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&h=200&fit=crop&crop=center",
  "home-decoration":
    "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop",
  "kitchen-accessories":
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
  laptops:
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop",
  "mens-shirts":
    "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=300&fit=crop",
  "mens-shoes":
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop",
  "mens-watches":
    "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=400&h=300&fit=crop",
  "mobile-accessories":
    "https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=400&h=300&fit=crop",
  motorcycle:
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
  "skin-care":
    "https://images.unsplash.com/photo-1555820585-c5ae44394b79?w=400&h=300&fit=crop",
  smartphones:
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop",
  "sports-accessories":
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
  sunglasses:
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop",
  tablets:
    "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=300&fit=crop",
  tops: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=300&fit=crop",
  vehicle:
    "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
  "womens-bags":
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
  "womens-dresses":
    "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=300&fit=crop",
  "womens-jewellery":
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop",
  "womens-shoes":
    "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=300&fit=crop",
  "womens-watches":
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
};

// Category descriptions
const categoryDescriptions: { [key: string]: string } = {
  beauty: "Explore premium beauty products and cosmetics",
  fragrances: "Discover luxurious fragrances and perfumes",
  furniture: "Transform your space with stylish furniture",
  groceries: "Fresh groceries and everyday essentials",
  "home-decoration": "Beautiful decor items for your home",
  "kitchen-accessories": "Essential tools for your kitchen",
  laptops: "High-performance laptops and computers",
  "mens-shirts": "Stylish shirts for the modern man",
  "mens-shoes": "Comfortable and fashionable footwear",
  "mens-watches": "Elegant timepieces for men",
  "mobile-accessories": "Accessories for your mobile devices",
  motorcycle: "Motorcycle gear and accessories",
  "skin-care": "Premium skincare products",
  smartphones: "Latest smartphones and devices",
  "sports-accessories": "Gear up for your favorite sports",
  sunglasses: "Stylish eyewear and sunglasses",
  tablets: "Tablets and digital accessories",
  tops: "Trendy tops and casual wear",
  vehicle: "Automotive accessories and parts",
  "womens-bags": "Fashionable bags and handbags",
  "womens-dresses": "Elegant dresses for every occasion",
  "womens-jewellery": "Beautiful jewelry and accessories",
  "womens-shoes": "Stylish footwear for women",
  "womens-watches": "Elegant watches for women",
};

const CategoryCard: React.FC<{ category: Category; index: number }> = ({
  category,
  index,
}) => {
  const categoryName = category.name
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
  const categorySlug = category.slug;
  const image =
    categoryImages[categorySlug] ||
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop";
  const description =
    categoryDescriptions[categorySlug] ||
    "Discover amazing products in this category";
  const productCount = category.count || 0;
  const isDisabled = productCount === 0;

  const cardContent = (
    <div
      className={`relative bg-white rounded-2xl shadow-md overflow-hidden h-full border transition-all duration-500 ${
        isDisabled
          ? "border-gray-200 opacity-60 cursor-not-allowed"
          : "group border-gray-100 hover:border-blue-200 hover:shadow-2xl transform hover:-translate-y-3 hover:scale-[1.02]"
      }`}
    >
      {/* Image Container */}
      <div className="relative h-36 lg:h-44 overflow-hidden">
        <img
          src={image}
          alt={categoryName}
          className={`w-full h-full object-cover transition-transform duration-700 ${
            isDisabled
              ? "filter grayscale"
              : "group-hover:scale-110 filter group-hover:brightness-110"
          }`}
          loading="lazy"
        />

        {/* Multi-layered Overlay - Only for enabled categories */}
        {!isDisabled && (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </>
        )}

        {/* Product Count Badge */}
        <div
          className={`absolute top-3 left-3 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg transition-transform duration-300 ${
            isDisabled
              ? "bg-gray-500"
              : "bg-gradient-to-r from-blue-600 to-blue-700 transform group-hover:scale-110"
          }`}
        >
          {productCount} items
        </div>

        {/* Category Icon with Enhanced Animation - Only for enabled categories */}
        {!isDisabled && (
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 translate-y-[-4px] group-hover:translate-x-0 group-hover:translate-y-0 group-hover:rotate-12">
            <FiPackage className="w-4 h-4 text-blue-600" />
          </div>
        )}

        {/* Disabled Overlay */}
        {isDisabled && (
          <div className="absolute inset-0 bg-gray-900/30 flex items-center justify-center">
            <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2">
              <span className="text-gray-700 text-sm font-medium">
                Out of Stock
              </span>
            </div>
          </div>
        )}

        {/* Shimmer Effect - Only for enabled categories */}
        {!isDisabled && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </div>
        )}
      </div>

      {/* Content with Enhanced Typography */}
      <div className="p-4 lg:p-5 relative">
        <h3
          className={`text-base lg:text-lg font-bold mb-2 transition-colors duration-300 line-clamp-1 ${
            isDisabled
              ? "text-gray-500"
              : "text-gray-900 group-hover:text-blue-600 group-hover:tracking-wide"
          }`}
        >
          {categoryName}
        </h3>
        <p
          className={`text-sm lg:text-base mb-4 line-clamp-2 transition-colors duration-300 ${
            isDisabled
              ? "text-gray-400"
              : "text-gray-600 group-hover:text-gray-700"
          }`}
        >
          {isDisabled ? "Currently no products available" : description}
        </p>

        {/* Enhanced Action Button */}
        <div className="flex items-center justify-between">
          <span
            className={`text-sm font-medium transition-colors duration-300 ${
              isDisabled
                ? "text-gray-400"
                : "text-gray-500 group-hover:text-blue-600"
            }`}
          >
            {isDisabled ? "Not Available" : "View Products"}
          </span>
          <div
            className={`flex items-center transition-all duration-300 ${
              isDisabled
                ? "text-gray-400"
                : "text-blue-600 group-hover:text-blue-700 transform group-hover:scale-110"
            }`}
          >
            <div
              className={`rounded-full p-2 transition-colors duration-300 ${
                isDisabled
                  ? "bg-gray-100"
                  : "bg-blue-50 group-hover:bg-blue-100"
              }`}
            >
              <FiArrowRight
                className={`w-4 h-4 transition-transform duration-300 ${
                  isDisabled ? "" : "transform group-hover:translate-x-1"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Bottom Glow Effect - Only for enabled categories */}
        {!isDisabled && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
        )}
      </div>

      {/* Enhanced Border Effect - Only for enabled categories */}
      {!isDisabled && (
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-300 rounded-2xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
      )}

      {/* Corner Accent - Only for enabled categories */}
      {!isDisabled && (
        <div className="absolute top-0 right-0 w-0 h-0 border-l-[30px] border-l-transparent border-t-[30px] border-t-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
      )}
    </div>
  );

  // Conditionally wrap with Link or return the content directly
  if (isDisabled) {
    return cardContent;
  }

  return <Link href={`/products?category=${categorySlug}`}>{cardContent}</Link>;
};

const InfiniteCategoryGrid: React.FC<InfiniteCategoryGridProps> = ({
  initialCategories,
  totalProducts = 0,
}) => {
  const [categories, setCategories] = useState<Category[]>(
    initialCategories.slice(0, 12)
  );
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialCategories.length > 12);
  const [page, setPage] = useState(1);
  const totalBrands = Math.floor(totalProducts / 20);

  const loadMoreCategories = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    // Simulate API delay
    setTimeout(() => {
      const nextPageStart = page * 12;
      const nextPageEnd = (page + 1) * 12;
      const nextPageCategories = initialCategories.slice(
        nextPageStart,
        nextPageEnd
      );

      if (nextPageCategories.length > 0) {
        setCategories((prev) => [...prev, ...nextPageCategories]);
        setPage((prev) => prev + 1);

        if (nextPageEnd >= initialCategories.length) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }

      setLoading(false);
    }, 1000);
  }, [loading, hasMore, page, initialCategories]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1000
      ) {
        loadMoreCategories();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMoreCategories]);

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="text-center bg-gray-50 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {initialCategories.length}
            </div>
            <div className="text-gray-600">Total Categories</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {totalProducts}+
            </div>
            <div className="text-gray-600">Products</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {totalBrands}+
            </div>
            <div className="text-gray-600">Brands</div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {categories.map((category, index) => (
          <CategoryCard
            key={`${category.slug}-${index}`}
            category={category}
            index={index}
          />
        ))}

        {/* Loading Skeletons */}
        {loading &&
          Array.from({ length: 12 }).map((_, index) => (
            <CategorySkeleton key={`skeleton-${index}`} />
          ))}
      </div>

      {/* Loading/End Message */}
      <div className="text-center py-8">
        {loading && (
          <div className="flex items-center justify-center gap-2">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-600">Loading more categories...</span>
          </div>
        )}

        {!hasMore && !loading && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
            <div className="text-2xl font-bold text-gray-900 mb-2">
              🎉 You&apos;ve seen it all!
            </div>
            <p className="text-gray-600 mb-6">
              You&apos;ve explored all our {initialCategories.length}{" "}
              categories. Ready to start shopping?
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              Browse All Products
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>

      {/* Call to Action - Only show if more categories available */}
      {hasMore && !loading && (
        <div className="text-center mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Can&apos;t find what you&apos;re looking for?
          </h3>
          <p className="text-gray-600 mb-6">
            Browse all our products or use our search feature to find exactly
            what you need.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              View All Products
            </Link>
            <Link
              href="/products?search="
              className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium border border-gray-300 transition-colors duration-200"
            >
              Search Products
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfiniteCategoryGrid;
