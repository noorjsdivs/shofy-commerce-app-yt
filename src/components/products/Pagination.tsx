"use client";
import React, { useState } from "react";
import ReactPaginate from "react-paginate";
import { ProductType } from "../../../type";
import ProductCard from "../ProductCard";

function Items({ currentItems }: any) {
  return (
    <>
      {currentItems &&
        currentItems.map((item: ProductType) => (
          <div key={item.id} className="w-full">
            <ProductCard product={item} />
            {/* <Product
              _id={item.id}
              img={item.img}
              productName={item.productName}
              price={item.price}
              color={item.color}
              badge={item.badge}
              des={item.des}
            /> */}
          </div>
        ))}
    </>
  );
}

const Pagination = ({ itemsPerPage, products }: any) => {
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = useState(0);
  const [itemStart, setItemStart] = useState(1);

  // Simulate fetching items from another resources.
  // (This could be items from props; or items loaded in a local state
  // from an API endpoint with useEffect and useState)
  const endOffset = itemOffset + itemsPerPage;
  //   console.log(`Loading items from ${itemOffset} to ${endOffset}`);
  const currentItems = products.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(products.length / itemsPerPage);

  // Invoke when user click to request another page.
  const handlePageClick = (event: any) => {
    const newOffset = (event.selected * itemsPerPage) % products.length;
    setItemOffset(newOffset);
    // console.log(
    //   `User requested page number ${event.selected}, which is offset ${newOffset},`
    // );
    setItemStart(newOffset);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 mdl:gap-4 lg:gap-10">
        <Items currentItems={currentItems} />
      </div>
      <div className="flex flex-col mdl:flex-row justify-center mdl:justify-between items-center">
        <ReactPaginate
          nextLabel=""
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={2}
          pageCount={pageCount}
          previousLabel=""
          pageLinkClassName="w-9 h-9 border border-lightColor hover:border-gray-500 duration-300 flex justify-center items-center"
          pageClassName="mr-6"
          containerClassName="flex text-base font-semibold font-title-font py-10"
          activeClassName="bg-black text-white"
        />

        <p className="text-base font-normal text-light-text">
          Products from {itemStart === 0 ? 1 : itemStart} to {endOffset} of{" "}
          {products.length}
        </p>
      </div>
    </div>
  );
};

export default Pagination;
