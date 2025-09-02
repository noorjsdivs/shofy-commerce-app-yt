import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Title from "../Title";
import Button from "../ui/Button";
import PriceFormat from "../PriceFormat";
import ShippingAddressSelector from "./ShippingAddressSelector";
import { ProductType, Address } from "../../../type";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CiDeliveryTruck } from "react-icons/ci";
import { FiAlertCircle, FiLoader } from "react-icons/fi";
import { FaSignInAlt } from "react-icons/fa";
import Link from "next/link";
import { resetCart } from "@/redux/shofySlice";

interface Props {
  cart: ProductType[];
}

const CartSummary = ({ cart }: Props) => {
  const [totalAmt, setTotalAmt] = useState(0);
  const [discountAmt, setDiscountAmt] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [isFreeShipping, setIsFreeShipping] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [placing, setPlacing] = useState(false);

  const { data: session } = useSession();
  const router = useRouter();
  const dispatch = useDispatch();

  // Get free shipping threshold from environment
  const freeShippingThreshold =
    Number(process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD) || 1000;
  const standardShippingCost = 15; // Standard shipping cost

  useEffect(() => {
    let amt = 0;
    let discount = 0;
    cart?.map((item) => {
      amt += item?.price * item?.quantity!;
      discount +=
        ((item?.price * item?.discountPercentage) / 100) * item?.quantity!;
    });

    setTotalAmt(amt);
    setDiscountAmt(discount);

    // Calculate shipping cost based on order total
    const orderTotal = amt - discount;
    if (orderTotal >= freeShippingThreshold) {
      setIsFreeShipping(true);
      setShippingCost(0);
    } else {
      setIsFreeShipping(false);
      setShippingCost(standardShippingCost);
    }
  }, [cart, freeShippingThreshold]);

  const handleCheckout = async () => {
    if (!session?.user) {
      // Redirect to login page for unauthenticated users
      router.push("/auth/signin?callbackUrl=/cart");
      return;
    }

    if (!selectedAddress) {
      alert("Please select a shipping address before placing your order.");
      return;
    }

    try {
      setPlacing(true);
      // Calculate totals
      const finalTotal = totalAmt - discountAmt + shippingCost;

      // Prepare order data
      const orderData = {
        items: cart.map((item: ProductType) => ({
          id: item.id,
          name: item.title,
          price: item.price * (1 - item.discountPercentage / 100),
          quantity: item.quantity,
          images: item.images,
          total:
            item.price * (1 - item.discountPercentage / 100) * item.quantity!,
        })),
        amount: finalTotal.toString(),
        currency: "USD",
        status: "confirmed",
        paymentStatus: "pending",
        customerEmail: session?.user?.email,
        customerName: session?.user?.name,
        shippingAddress: selectedAddress,
        createdAt: new Date().toISOString(),
      };

      // Place order
      const response = await fetch("/api/orders/place", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const result = await response.json();

        // Clear cart after successful order placement
        dispatch(resetCart());

        // Navigate to checkout page with order ID for payment method selection
        router.push(`/checkout?orderId=${result.orderId}`);
      } else {
        throw new Error("Failed to place order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  const isCheckoutDisabled = session?.user && (!selectedAddress || placing);

  return (
    <section className="rounded-lg bg-gray-100 px-4 py-6 sm:p-10 lg:col-span-5 mt-16 lg:mt-0">
      <Title>Cart Summary</Title>

      {/* Show different content based on authentication status */}
      {session?.user ? (
        <>
          {/* Shipping Address Selector */}
          <ShippingAddressSelector
            selectedAddress={selectedAddress}
            onAddressSelect={setSelectedAddress}
          />

          {/* Address Required Warning */}
          {isCheckoutDisabled && (
            <div className="mb-6 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center text-orange-800">
                <FiAlertCircle className="text-orange-600 text-lg mr-2" />
                <span className="text-sm font-medium">
                  Please select a shipping address to proceed with checkout
                </span>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Login Required Message */
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start">
            <FaSignInAlt className="text-blue-600 text-lg mr-3 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-blue-800 font-medium mb-2">
                Login Required to Place Order
              </h3>
              <p className="text-blue-700 text-sm mb-3">
                You can browse and add items to your cart, but you&apos;ll need
                to sign in to complete your purchase and access checkout.
              </p>
              <Link
                href="/auth/signin?callbackUrl=/cart"
                className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium underline"
              >
                <FaSignInAlt className="w-3 h-3" />
                Sign in to continue
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Free Shipping Banner */}
      {isFreeShipping ? (
        <div className="mt-4 mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center text-green-800">
            <CiDeliveryTruck className="text-green-600 text-xl mr-2" />
            <span className="text-sm font-medium">
              🎉 Congratulations! You qualify for FREE shipping!
            </span>
          </div>
        </div>
      ) : (
        <div className="mt-4 mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center text-blue-800">
            <CiDeliveryTruck className="text-blue-600 text-xl mr-2" />
            <div className="text-sm">
              <div className="font-medium">
                Add{" "}
                <PriceFormat
                  amount={freeShippingThreshold - (totalAmt - discountAmt)}
                  className="font-bold"
                />{" "}
                more for FREE shipping!
              </div>
              <div className="text-xs text-blue-600 mt-1">
                Free shipping on orders over{" "}
                <PriceFormat amount={freeShippingThreshold} />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Title className="text-lg font-medium">Sub Total</Title>
          <PriceFormat amount={totalAmt} />
        </div>
        <div className="flex items-center justify-between">
          <Title className="text-lg font-medium">Discount</Title>
          <PriceFormat amount={discountAmt} />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Title className="text-lg font-medium">Shipping</Title>
            {isFreeShipping && (
              <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                FREE
              </span>
            )}
          </div>
          {isFreeShipping ? (
            <span className="text-green-600 font-medium">Free</span>
          ) : (
            <PriceFormat amount={shippingCost} />
          )}
        </div>
        <div className="border-t border-gray-300 pt-3 flex items-center justify-between">
          <Title className="text-lg font-bold">Total Amount</Title>
          <PriceFormat
            amount={totalAmt - discountAmt + shippingCost}
            className="text-lg font-bold text-theme-color"
          />
        </div>
        <Button
          onClick={handleCheckout}
          className={`mt-4 ${
            isCheckoutDisabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isCheckoutDisabled}
        >
          {!session?.user ? (
            "Sign in to Place Order"
          ) : placing ? (
            <>
              <FiLoader className="animate-spin mr-2" />
              Placing Order...
            </>
          ) : !selectedAddress ? (
            "Select Address to Place Order"
          ) : (
            "Place Order"
          )}
        </Button>
      </div>
    </section>
  );
};

export default CartSummary;
