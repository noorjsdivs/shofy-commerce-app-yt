"use client";
import { useState } from "react";
import Pagination from "./Pagination";
import ProductBanner from "./ProductBanner";

const PaginationProductList = ({ products }: any) => {
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const itemsPerPageFromBanner = (itemsPerPage: any) => {
    setItemsPerPage(itemsPerPage);
  };
  return (
    <div className="w-full mdl:w-[80%] lgl:w-[75%] h-full flex flex-col gap-10">
      <ProductBanner itemsPerPageFromBanner={itemsPerPageFromBanner} />
      <Pagination itemsPerPage={itemsPerPage} products={products} />
    </div>
  );
};

export default PaginationProductList;
