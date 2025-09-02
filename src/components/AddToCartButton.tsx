"use client";

import {
  addToCart,
  decreaseQuantity,
  increaseQuantity,
} from "@/redux/shofySlice";
import { useDispatch, useSelector } from "react-redux";
import { ProductType, StateType } from "../../type";
import toast from "react-hot-toast";
import { FaPlus, FaCheck } from "react-icons/fa6";
import { FaMinus, FaShoppingCart } from "react-icons/fa";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

interface PropsType {
  product?: ProductType;
  className?: string;
  variant?: "default" | "primary" | "outline" | "minimal";
  size?: "sm" | "md" | "lg";
  showQuantity?: boolean;
}

const AddToCartButton = ({
  product,
  className,
  variant = "default",
  size = "md",
  showQuantity = true,
}: PropsType) => {
  const dispatch = useDispatch();
  const { cart } = useSelector((state: StateType) => state?.shopy);
  const [existingProduct, setExistingProduct] = useState<ProductType | null>(
    null
  );
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    const availableProduct = cart?.find((item) => item?.id === product?.id);
    if (availableProduct) {
      setExistingProduct(availableProduct);
    } else {
      setExistingProduct(null);
    }
  }, [cart, product]);

  const handleAddToCart = async () => {
    if (product && product.stock > 0) {
      setIsAdding(true);
      dispatch(addToCart(product));

      // Simulate async operation
      setTimeout(() => {
        setIsAdding(false);
        setJustAdded(true);
        toast.success(`${product?.title.substring(0, 15)}... added to cart!`, {
          duration: 2000,
          style: {
            background: "#10B981",
            color: "white",
          },
        });

        // Reset the "just added" state
        setTimeout(() => setJustAdded(false), 2000);
      }, 300);
    } else {
      toast.error("Product is out of stock!", {
        style: {
          background: "#EF4444",
          color: "white",
        },
      });
    }
  };

  const handleIncrease = () => {
    dispatch(increaseQuantity(product?.id));
    toast.success(`Quantity increased!`, {
      duration: 1500,
      style: {
        background: "#10B981",
        color: "white",
      },
    });
  };

  const handleDecrease = () => {
    if (existingProduct?.quantity! > 1) {
      dispatch(decreaseQuantity(product?.id));
      toast.success(`Quantity decreased!`, {
        duration: 1500,
        style: {
          background: "#F59E0B",
          color: "white",
        },
      });
    } else {
      toast.error("Minimum quantity is 1", {
        style: {
          background: "#EF4444",
          color: "white",
        },
      });
    }
  };

  // Base styles for different variants
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return "bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700";
      case "outline":
        return "bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white";
      case "minimal":
        return "bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300";
      default:
        return "bg-transparent border border-sky-500 text-sky-600 hover:bg-sky-500 hover:text-white";
    }
  };

  // Size styles
  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return "px-3 py-1.5 text-sm";
      case "lg":
        return "px-6 py-3 text-lg";
      default:
        return "px-4 py-2 text-base";
    }
  };

  // Check if product is out of stock
  const isOutOfStock = !product?.stock || product.stock <= 0;

  return (
    <>
      {existingProduct && showQuantity ? (
        <div className="flex items-center justify-center gap-2 bg-white rounded-lg border border-gray-200 p-1 shadow-sm">
          <button
            disabled={existingProduct?.quantity! <= 1}
            onClick={handleDecrease}
            className="flex items-center justify-center w-8 h-8 bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 rounded-md border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-100 disabled:hover:text-gray-600"
          >
            <FaMinus className="w-3 h-3" />
          </button>

          <div className="flex flex-col items-center min-w-[40px]">
            <span className="text-sm font-semibold text-gray-800">
              {existingProduct?.quantity}
            </span>
            <span className="text-xs text-gray-500">in cart</span>
          </div>

          <button
            onClick={handleIncrease}
            disabled={existingProduct?.quantity! >= (product?.stock || 0)}
            className="flex items-center justify-center w-8 h-8 bg-gray-100 hover:bg-green-100 text-gray-600 hover:text-green-600 rounded-md border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaPlus className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAdding}
          className={twMerge(
            "relative flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden",
            getVariantStyles(),
            getSizeStyles(),
            isOutOfStock &&
              "bg-gray-300 border-gray-300 text-gray-500 hover:bg-gray-300 hover:text-gray-500",
            justAdded &&
              "bg-green-500 border-green-500 text-white hover:bg-green-500 animate-pulse",
            isAdding && "cursor-not-allowed",
            className
          )}
        >
          {isAdding ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Adding...</span>
            </>
          ) : justAdded ? (
            <>
              <FaCheck className="w-4 h-4" />
              <span>Added!</span>
            </>
          ) : isOutOfStock ? (
            <span>Out of Stock</span>
          ) : (
            <>
              <FaShoppingCart className="w-4 h-4" />
              <span>Add to Cart</span>
            </>
          )}

          {/* Ripple effect */}
          {!isOutOfStock && (
            <div className="absolute inset-0 rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-white opacity-0 group-active:opacity-20 transition-opacity duration-150"></div>
            </div>
          )}
        </button>
      )}
    </>
  );
};

export default AddToCartButton;
