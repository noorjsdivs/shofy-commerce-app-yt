"use client";
import Brand from "./Brand";
import Category from "./Category";
import Color from "./Color";
import Price from "./Price";

const ProductsSideNav = () => {
  return (
    <div className="w-full flex flex-col gap-6">
      <Category />
      <Color />
      <Brand />
      <Price />
    </div>
  );
};

export default ProductsSideNav;
