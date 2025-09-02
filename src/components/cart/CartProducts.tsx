"use client";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { ProductType, StateType } from "../../../type";
import Container from "../Container";
import CartProduct from "./CartProduct";
import CartSummary from "./CartSummary";
import CartSkeleton from "./CartSkeleton";
import Link from "next/link";

const CartProducts = () => {
  const { cart } = useSelector((state: StateType) => state?.shopy);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading state for cart initialization
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <Container>
        <CartSkeleton />
      </Container>
    );
  }

  return (
    <Container>
      {cart?.length > 0 ? (
        <>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Shopping Cart
          </h1>
          <div className="mt-10 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-1 2">
            <section className="lg:col-span-7">
              <div className=" divide-y divide-gray-200 border-b border-t border-gray-200">
                {cart?.map((product: ProductType) => (
                  <CartProduct key={product?.id} product={product} />
                ))}
              </div>
            </section>
            <CartSummary cart={cart} />
          </div>
        </>
      ) : (
        <div className="bg-white h-96 my-10 flex flex-col gap-4 items-center justify-center py-5 rounded-lg border border-gray-200 drop-shadow-2xl">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Shopping Cart
          </h1>
          <p className="text-base max-w-[700px] text-center text-gray-600 tracking-wide leading-6">
            Your cart is empty. Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Voluptate in ab blanditiis officiis deleniti, amet
            omnis esse quisquam voluptates, eveniet, illo magnam error odit modi
            cumque minima a fugit aut.
          </p>
          <Link
            className="bg-sky-color/90 text-gray-100 px-8 py-4 rounded-md hover:bg-sky-color duration-200 uppercase text-sm font-semibold tracking-wide"
            href="/"
          >
            go to shopping
          </Link>
        </div>
      )}
    </Container>
  );
};

export default CartProducts;
