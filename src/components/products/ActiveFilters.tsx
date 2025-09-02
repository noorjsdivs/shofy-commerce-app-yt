"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { FaTimes, FaUndo } from "react-icons/fa";

const ActiveFilters = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const activeFilters = [];

  // Check for active filters
  const category = searchParams.get("category");
  const brand = searchParams.get("brand");
  const color = searchParams.get("color");
  const minPrice = searchParams.get("min_price");
  const maxPrice = searchParams.get("max_price");
  const search = searchParams.get("search");

  if (category) {
    activeFilters.push({
      type: "category",
      label: "Category",
      value: category,
      displayValue:
        category === "bestsellers"
          ? "Best Sellers"
          : category === "new"
          ? "New Arrivals"
          : category === "offers"
          ? "Special Offers"
          : category.charAt(0).toUpperCase() + category.slice(1),
    });
  }

  if (brand) {
    activeFilters.push({
      type: "brand",
      label: "Brand",
      value: brand,
      displayValue: brand,
    });
  }

  if (color) {
    activeFilters.push({
      type: "color",
      label: "Color",
      value: color,
      displayValue: color,
    });
  }

  if (minPrice || maxPrice) {
    activeFilters.push({
      type: "price",
      label: "Price",
      value: `${minPrice || 0}-${maxPrice || "∞"}`,
      displayValue: `$${minPrice || 0} - $${maxPrice || "∞"}`,
    });
  }

  if (search) {
    activeFilters.push({
      type: "search",
      label: "Search",
      value: search,
      displayValue: `"${search}"`,
    });
  }

  const removeFilter = (filterType: string) => {
    const params = new URLSearchParams(searchParams.toString());

    switch (filterType) {
      case "category":
        params.delete("category");
        break;
      case "brand":
        params.delete("brand");
        break;
      case "color":
        params.delete("color");
        break;
      case "price":
        params.delete("min_price");
        params.delete("max_price");
        break;
      case "search":
        params.delete("search");
        break;
    }

    router.push(`/products?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push("/products");
  };

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900">Active Filters</h3>
        <button
          onClick={clearAllFilters}
          className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 transition-colors"
        >
          <FaUndo className="w-3 h-3" />
          Clear All
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {activeFilters.map((filter, index) => (
          <div
            key={index}
            className="inline-flex items-center gap-2 bg-blue-50 text-blue-800 text-sm px-3 py-1 rounded-full border border-blue-200"
          >
            <span className="font-medium">{filter.label}:</span>
            <span>{filter.displayValue}</span>
            <button
              onClick={() => removeFilter(filter.type)}
              className="flex items-center justify-center w-4 h-4 bg-blue-200 hover:bg-blue-300 rounded-full transition-colors ml-1"
            >
              <FaTimes className="w-2 h-2" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveFilters;
