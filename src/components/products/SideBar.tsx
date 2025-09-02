"use client";
import { FiShoppingCart } from "react-icons/fi";
import { LuEye } from "react-icons/lu";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { ProductType, StateType } from "../../../type";
import { useDispatch, useSelector } from "react-redux";
import { addToFavorite, resetFavorite } from "@/redux/shofySlice";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

interface Props {
  product: ProductType;
}

const SideBar = ({ product }: Props) => {
  const dispatch = useDispatch();
  const { favorite } = useSelector((state: StateType) => state?.shopy);
  const [existingProduct, setExistingProduct] = useState<ProductType | null>(
    null
  );
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      const availableProduct = favorite?.find(
        (item) => item?.id === product?.id
      );
      if (availableProduct) {
        setExistingProduct(availableProduct);
      } else {
        setExistingProduct(null);
      }
    }
  }, [favorite, product, dispatch, existingProduct, session?.user]);

  useEffect(() => {
    !session?.user && dispatch(resetFavorite());
  }, [session?.user, dispatch]);

  const handleFavorite = () => {
    if (session?.user) {
      dispatch(addToFavorite(product));
      if (existingProduct) {
        toast.success("Removed from favorites successfully!");
        setExistingProduct(null);
      } else {
        toast.success("Added to favorites successfully!");
        setExistingProduct(product);
      }
    } else {
      toast.error("Please login to add to favorites");
    }
  };

  return (
    <div className="absolute right-2 bottom-44 border flex flex-col text-2xl border-border-color bg-white rounded-md overflow-hidden transform translate-x-20 group-hover:translate-x-0 duration-300 z-40">
      <button className="p-2 hover:bg-sky-color/5 duration-300 hover:text-sky-color">
        <FiShoppingCart />
      </button>
      <button className="p-2 hover:bg-sky-color/5 duration-300 hover:text-sky-color border-y border-y-border-color">
        <LuEye />
      </button>
      <button
        onClick={handleFavorite}
        className="p-2 hover:bg-sky-color/5 duration-300 hover:text-sky-color"
      >
        {existingProduct ? (
          <MdFavorite className="text-sky-color" />
        ) : (
          <MdFavoriteBorder />
        )}
      </button>
    </div>
  );
};

export default SideBar;
