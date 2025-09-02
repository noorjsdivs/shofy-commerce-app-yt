"use client";
import React, { useEffect, useState } from "react";
import { ProductType, StateType } from "../../type";
import AddToCartButton from "./AddToCartButton";
import Link from "next/link";
import ProductPrice from "./ProductPrice";
import { FaStar, FaEye } from "react-icons/fa";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import { addToFavorite } from "@/redux/shofySlice";
import toast from "react-hot-toast";

interface Props {
  product: ProductType;
}

const ProductCard = ({ product }: Props) => {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const { favorite } = useSelector((state: StateType) => state?.shopy);
  const [isFavorite, setIsFavorite] = useState(false);

  const regularPrice = product?.price;
  const discountedPrice =
    product?.price - (product?.price * product?.discountPercentage) / 100;

  // Check if product is in favorites
  useEffect(() => {
    if (session?.user) {
      const isInFavorites = favorite?.some((item) => item.id === product.id);
      setIsFavorite(!!isInFavorites);
    }
  }, [favorite, product.id, session?.user]);

  const handleFavoriteClick = () => {
    if (session?.user) {
      dispatch(addToFavorite(product));
      if (isFavorite) {
        toast.success("Removed from favorites");
      } else {
        toast.success("Added to favorites");
      }
    } else {
      toast.error("Please login to add to favorites");
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl hover:shadow-xl hover:shadow-black/10 transition-all duration-300 overflow-hidden group transform hover:-translate-y-1 relative">
      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Link
          href={{
            pathname: `/products/${product?.id}`,
            query: { id: product?.id },
          }}
        >
          <img
            src={product?.images[0]}
            alt={product?.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </Link>

        {product?.discountPercentage > 0 && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg z-10 animate-pulse">
            -{Math.round(product.discountPercentage)}% OFF
          </div>
        )}

        {/* Stock Badge */}
        {product?.stock <= 5 && product?.stock > 0 && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg">
            Only {product.stock} left!
          </div>
        )}

        {product?.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg">
              OUT OF STOCK
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
          <button
            onClick={handleFavoriteClick}
            className="p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-red-50 hover:text-red-500 transform hover:scale-110 transition-all duration-200"
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            {isFavorite ? (
              <MdFavorite className="w-4 h-4 text-red-500" />
            ) : (
              <MdFavoriteBorder className="w-4 h-4" />
            )}
          </button>
          <Link
            href={`/products/${product.id}`}
            className="p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-blue-50 hover:text-blue-500 transform hover:scale-110 transition-all duration-200"
            title="View details"
          >
            <FaEye className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
            {product?.category}
          </p>
          {product?.brand && (
            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full font-medium">
              {product.brand}
            </span>
          )}
        </div>

        <Link
          href={{
            pathname: `/products/${product?.id}`,
            query: { id: product?.id },
          }}
        >
          <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-1 mb-3 leading-tight">
            {product?.title}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(product?.rating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-600 ml-1">
              ({product?.rating})
            </span>
          </div>

          {product?.stock > 0 && (
            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium">
              In Stock
            </span>
          )}
        </div>

        {/* Price */}
        <div className="mb-4">
          <ProductPrice
            regularPrice={regularPrice}
            discountedPrice={discountedPrice}
            product={product}
          />
        </div>

        {/* Add to Cart Button */}
        <AddToCartButton
          product={product}
          variant="outline"
          size="sm"
          className="w-full group-hover:variant-primary transition-all duration-300"
        />
      </div>
    </div>
  );
};

export default ProductCard;
