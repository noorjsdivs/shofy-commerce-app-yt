"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import EnhancedProductCard from "../EnhancedProductCard";
import ActiveFilters from "./ActiveFilters";
import { BsGridFill } from "react-icons/bs";
import { ImList } from "react-icons/im";

interface InfiniteProductListProps {
  products: any[];
  currentSort: string;
  itemsPerPage?: number;
}

const InfiniteProductList = ({
  products,
  currentSort,
  itemsPerPage = 12,
}: InfiniteProductListProps) => {
  const [displayedProducts, setDisplayedProducts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const observer = useRef<IntersectionObserver | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Reset when products change
  useEffect(() => {
    setCurrentPage(1);
    setDisplayedProducts(products.slice(0, itemsPerPage));
    setHasMore(products.length > itemsPerPage);
  }, [products, itemsPerPage]);

  // Sort products
  const sortProducts = useCallback(
    (productsToSort: any[]) => {
      const sorted = [...productsToSort];
      switch (currentSort) {
        case "price-low":
          return sorted.sort((a, b) => a.price - b.price);
        case "price-high":
          return sorted.sort((a, b) => b.price - a.price);
        case "name-asc":
          return sorted.sort((a, b) => a.title.localeCompare(b.title));
        case "name-desc":
          return sorted.sort((a, b) => b.title.localeCompare(a.title));
        case "rating":
          return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        default:
          return sorted;
      }
    },
    [currentSort]
  );

  // Handle sort change
  const handleSortChange = (sortValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (sortValue === "default") {
      params.delete("sort");
    } else {
      params.set("sort", sortValue);
    }
    router.push(`/products?${params.toString()}`);
  };

  // Load more products
  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setTimeout(() => {
      const nextPage = currentPage + 1;
      const startIndex = (nextPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const newProducts = products.slice(startIndex, endIndex);

      if (newProducts.length > 0) {
        setDisplayedProducts((prev) => [...prev, ...newProducts]);
        setCurrentPage(nextPage);
        setHasMore(endIndex < products.length);
      } else {
        setHasMore(false);
      }
      setIsLoading(false);
    }, 500);
  }, [currentPage, products, itemsPerPage, isLoading, hasMore]);

  // Intersection Observer for infinite scroll
  const lastProductElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, loadMore]
  );

  const sortedProducts = sortProducts(displayedProducts);

  const sortOptions = [
    { value: "default", label: "Default" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "name-asc", label: "Name: A to Z" },
    { value: "name-desc", label: "Name: Z to A" },
    { value: "rating", label: "Highest Rated" },
  ];

  return (
    <div className="space-y-6">
      {/* Active Filters */}
      <ActiveFilters />

      {/* Header with controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-4 bg-white border border-gray-200 rounded-lg">
        <div className="text-sm text-gray-600">
          Showing {sortedProducts.length} of {products.length} products
        </div>

        <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="sort"
              className="text-sm text-gray-600 whitespace-nowrap"
            >
              Sort by:
            </label>
            <select
              id="sort"
              value={currentSort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded ${
                viewMode === "grid"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
              title="Grid View"
            >
              <BsGridFill className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded ${
                viewMode === "list"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
              title="List View"
            >
              <ImList className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid/List */}
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            : "space-y-4"
        }
      >
        {sortedProducts.map((product, index) => (
          <div
            key={`${product.id}-${index}`}
            ref={
              index === sortedProducts.length - 1 ? lastProductElementRef : null
            }
            className={viewMode === "list" ? "w-full" : ""}
          >
            <EnhancedProductCard product={product} view={viewMode} />
          </div>
        ))}
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Loading more products...</span>
        </div>
      )}

      {/* No more products message */}
      {!hasMore && products.length > itemsPerPage && (
        <div className="text-center py-8 text-gray-500">
          You&apos;ve reached the end of the products list.
        </div>
      )}

      {/* No products found */}
      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No products found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default InfiniteProductList;
