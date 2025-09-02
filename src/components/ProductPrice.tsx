"use client";
import { useEffect, useState } from "react";
import PriceFormat from "./PriceFormat";
import { useSelector } from "react-redux";
import { ProductType, StateType } from "../../type";

const ProductPrice = ({ regularPrice, discountedPrice, product }: any) => {
  const [existingProduct, setExistingProduct] = useState<ProductType | null>(
    null
  );
  const { cart } = useSelector((state: StateType) => state?.shopy);
  useEffect(() => {
    const availableProduct = cart?.find((item) => item?.id === product?.id);
    if (availableProduct) {
      setExistingProduct(availableProduct);
    }
  }, [cart, product]);
  return (
    <div className="flex items-center gap-2">
      <PriceFormat
        className="text-gray-500 line-through font-normal"
        amount={
          existingProduct
            ? discountedPrice * existingProduct?.quantity!
            : discountedPrice
        }
      />
      <PriceFormat
        className="font-semibold text-sky-color"
        amount={
          existingProduct
            ? regularPrice * existingProduct?.quantity!
            : regularPrice
        }
      />
    </div>
  );
};

export default ProductPrice;
