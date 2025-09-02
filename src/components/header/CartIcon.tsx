"use client";

import { useSelector } from "react-redux";
import { StateType } from "../../../type";
import Link from "next/link";
import { BiShoppingBag } from "react-icons/bi";

const CartIcon = () => {
  const { cart } = useSelector((state: StateType) => state?.shopy);
  return (
    <Link href="/cart" className="text-2xl relative">
      <BiShoppingBag />
      <span className="absolute -top-1 -right-1 text-[10px] font-medium w-4 h-4 bg-theme-color text-white rounded-full flex items-center justify-center">
        {cart?.length > 0 ? cart?.length : "0"}
      </span>
    </Link>
  );
};

export default CartIcon;
