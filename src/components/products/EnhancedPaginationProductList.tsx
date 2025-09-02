"use client";
import { useState } from "react";
import ProductsHeader from "./ProductsHeader";
import EnhancedPagination from "./EnhancedPagination";
import MobileFilters from "./MobileFilters";
import { ProductType } from "../../../type";

interface Props {
  products: ProductType[];
}

const EnhancedPaginationProductList = ({ products }: Props) => {
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [currentView, setCurrentView] = useState<"grid" | "list">("grid");
  const [currentSort, setCurrentSort] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const handleViewChange = (view: "grid" | "list") => {
    setCurrentView(view);
  };

  const handleSortChange = (sort: string) => {
    setCurrentSort(sort);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters);
  };

  return (
    <div className="w-full mdl:w-[80%] lgl:w-[75%] h-full flex flex-col">
      {/* Products Header */}
      <ProductsHeader
        totalProducts={products.length}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onViewChange={handleViewChange}
        onSortChange={handleSortChange}
        onItemsPerPageChange={handleItemsPerPageChange}
        onToggleMobileFilters={toggleMobileFilters}
        currentView={currentView}
        currentSort={currentSort}
      />

      {/* Products List with Pagination */}
      <EnhancedPagination
        itemsPerPage={itemsPerPage}
        products={products}
        view={currentView}
        currentSort={currentSort}
      />

      {/* Mobile Filters */}
      <MobileFilters
        isOpen={showMobileFilters}
        onClose={() => setShowMobileFilters(false)}
      />
    </div>
  );
};

export default EnhancedPaginationProductList;
