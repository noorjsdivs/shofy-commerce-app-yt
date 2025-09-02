"use client";
import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { ProductType } from "../../../type";
import EnhancedProductCard from "../EnhancedProductCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface ItemsProps {
  currentItems: ProductType[];
  view: "grid" | "list";
}

function Items({ currentItems, view }: ItemsProps) {
  if (view === "list") {
    return (
      <div className="space-y-4">
        {currentItems?.map((item: ProductType) => (
          <EnhancedProductCard key={item.id} product={item} view="list" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {currentItems?.map((item: ProductType) => (
        <EnhancedProductCard key={item.id} product={item} view="grid" />
      ))}
    </div>
  );
}

interface PaginationProps {
  itemsPerPage: number;
  products: ProductType[];
  view: "grid" | "list";
  currentSort: string;
}

const EnhancedPagination = ({
  itemsPerPage,
  products,
  view,
  currentSort,
}: PaginationProps) => {
  const [itemOffset, setItemOffset] = useState(0);
  const [sortedProducts, setSortedProducts] = useState<ProductType[]>(products);

  // Sort products based on currentSort
  useEffect(() => {
    let sorted = [...products];

    switch (currentSort) {
      case "price-low":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        sorted.sort((a, b) => b.id - a.id);
        break;
      case "name-az":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name-za":
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        // Keep original order
        break;
    }

    setSortedProducts(sorted);
    setItemOffset(0); // Reset to first page when sorting changes
  }, [products, currentSort]);

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = sortedProducts.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(sortedProducts.length / itemsPerPage);
  const currentPage = Math.floor(itemOffset / itemsPerPage) + 1;

  const handlePageClick = (event: any) => {
    const newOffset = (event.selected * itemsPerPage) % sortedProducts.length;
    setItemOffset(newOffset);

    // Scroll to top when page changes
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Show loading state if no products
  if (!sortedProducts || sortedProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-center">
          <div className="w-64 h-64 mx-auto mb-6 bg-gray-100 rounded-lg flex items-center justify-center">
            <svg
              className="w-20 h-20 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H6a1 1 0 00-1 1v1m16 8l-3-3m-1 0L16 10m1 0L16 10"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No products found
          </h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your filters or search terms
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Products Grid/List */}
      <Items currentItems={currentItems} view={view} />

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="mt-12 flex flex-col items-center">
          {/* Pagination Info */}
          <div className="text-sm text-gray-600 mb-4">
            Page {currentPage} of {pageCount} ({sortedProducts.length} total
            products)
          </div>

          {/* Pagination Controls */}
          <ReactPaginate
            nextLabel={
              <span className="flex items-center gap-1">
                Next <FaChevronRight className="w-3 h-3" />
              </span>
            }
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            marginPagesDisplayed={2}
            pageCount={pageCount}
            previousLabel={
              <span className="flex items-center gap-1">
                <FaChevronLeft className="w-3 h-3" /> Previous
              </span>
            }
            pageClassName="hidden sm:block"
            pageLinkClassName="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 border border-gray-300 hover:border-gray-400 transition-colors"
            previousClassName="mr-1"
            previousLinkClassName="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 border border-gray-300 hover:border-gray-400 transition-colors rounded-l-md"
            nextClassName="ml-1"
            nextLinkClassName="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 border border-gray-300 hover:border-gray-400 transition-colors rounded-r-md"
            breakLabel="..."
            breakClassName="hidden sm:block"
            breakLinkClassName="px-3 py-2 text-sm text-gray-700"
            containerClassName="flex items-center"
            activeClassName="bg-blue-500 text-white border-blue-500"
            renderOnZeroPageCount={null}
            disabledClassName="opacity-50 cursor-not-allowed"
          />

          {/* Jump to page (for large number of pages) */}
          {pageCount > 10 && (
            <div className="mt-4 flex items-center gap-2 text-sm">
              <span className="text-gray-600">Jump to page:</span>
              <input
                type="number"
                min={1}
                max={pageCount}
                value={currentPage}
                onChange={(e) => {
                  const page = parseInt(e.target.value);
                  if (page >= 1 && page <= pageCount) {
                    const newOffset =
                      ((page - 1) * itemsPerPage) % sortedProducts.length;
                    setItemOffset(newOffset);
                  }
                }}
                className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-600">of {pageCount}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EnhancedPagination;
