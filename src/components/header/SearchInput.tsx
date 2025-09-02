"use client";

import { useEffect, useRef, useState } from "react";
import { RiCloseLine, RiSearchLine } from "react-icons/ri";
import { ProductType } from "../../../type";
import Link from "next/link";
import { CiSearch } from "react-icons/ci";
import { useProductSearch } from "@/hooks/useProductSearch";

const SearchInput = () => {
  const [isInputFocused, setIsInputFocused] = useState(false);
  const searchContainerRef = useRef(null);

  const {
    search,
    setSearch,
    filteredProducts,
    suggestedProducts,
    isLoading,
    hasSearched,
    clearSearch,
  } = useProductSearch({ debounceDelay: 300 });
  // Effect to detect click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        // @ts-ignore
        !searchContainerRef.current.contains(event.target)
      ) {
        setIsInputFocused(false); // Hide the list if clicking outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleClearSearch = () => {
    clearSearch();
    setIsInputFocused(false);
  };

  const handleProductClick = () => {
    clearSearch();
    setIsInputFocused(false);
  };

  return (
    <div
      ref={searchContainerRef}
      className="hidden md:inline-flex flex-1 h-10 relative"
    >
      <input
        type="text"
        placeholder="Search products here..."
        className="w-full h-full outline-hidden border-2 border-theme-color px-4"
        value={search}
        onChange={handleSearchChange}
        onFocus={() => setIsInputFocused(true)}
      />
      {search && (
        <RiCloseLine
          onClick={handleClearSearch}
          className="text-xl absolute top-2.5 right-12 text-gray-500 hover:text-red-500 cursor-pointer duration-200"
        />
      )}

      {isInputFocused && (
        <div className="absolute left-0 top-12 w-full mx-auto h-auto max-h-96 bg-white rounded-md overflow-y-scroll cursor-pointer text-black shadow-lg border border-gray-200 z-50">
          {search ? (
            // Show search results or loading when user has typed something
            isLoading ? (
              <div className="py-8 px-5 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-theme-color border-t-transparent"></div>
                  <div className="flex space-x-1">
                    <div
                      className="w-2 h-2 bg-theme-color rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-theme-color rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-theme-color rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-3">
                  Searching for &quot;{search}&quot;...
                </p>
              </div>
            ) : filteredProducts?.length > 0 ? (
              <div className="flex flex-col">
                {filteredProducts?.map((item: ProductType) => (
                  <Link
                    key={item?.id}
                    href={{
                      pathname: `/products/${item?.id}`,
                      query: { id: item?.id },
                    }}
                    onClick={handleProductClick}
                    className="flex items-center gap-x-2 text-base font-medium hover:bg-light-text/30 px-3 py-1.5 border-b border-gray-100 last:border-b-0"
                  >
                    <CiSearch className="text-lg text-gray-400" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {item?.title}
                      </p>
                      {item?.category && (
                        <p className="text-xs text-gray-500">
                          in {item.category}
                        </p>
                      )}
                    </div>
                    {item?.price && (
                      <span className="text-sm font-semibold text-theme-color">
                        ${item.price}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            ) : hasSearched ? (
              <div className="py-10 px-5">
                <p className="text-base text-center">
                  Nothing matched with{" "}
                  <span className="font-semibold underline underline-offset-2 decoration-1">
                    &quot;{search}&quot;
                  </span>
                  <br />
                  <span className="text-sm text-gray-500">
                    Please try again.
                  </span>
                </p>
              </div>
            ) : null
          ) : (
            // Show suggested/trending products when search is empty
            suggestedProducts?.length > 0 && (
              <div className="flex flex-col">
                <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Trending Products
                  </p>
                </div>
                {suggestedProducts?.map((item: ProductType) => (
                  <Link
                    key={item?.id}
                    href={{
                      pathname: `/products/${item?.id}`,
                      query: { id: item?.id },
                    }}
                    onClick={handleProductClick}
                    className="flex items-center gap-x-2 text-base font-medium hover:bg-light-text/30 px-3 py-1.5 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="w-4 h-4 bg-gradient-to-r from-theme-color to-blue-600 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {item?.title}
                      </p>
                      {item?.category && (
                        <p className="text-xs text-gray-500">
                          in {item.category}
                        </p>
                      )}
                    </div>
                    {item?.price && (
                      <span className="text-sm font-semibold text-theme-color">
                        ${item.price}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            )
          )}
        </div>
      )}

      <span className="w-10 h-10 bg-theme-color/80 inline-flex items-center justify-center text-white absolute top-0 right-0 border border-theme-color hover:bg-theme-color duration-200 cursor-pointer">
        <RiSearchLine />
      </span>
    </div>
  );
};

export default SearchInput;
