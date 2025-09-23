"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Container from "@/components/Container";
import PriceFormat from "@/components/PriceFormat";
import { loadStripe } from "@stripe/stripe-js";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  FiPackage,
  FiMapPin,
  FiCreditCard,
  FiArrowLeft,
  FiLoader,
  FiTruck,
} from "react-icons/fi";
import Link from "next/link";

const CheckoutPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [existingOrder, setExistingOrder] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "cod" | null>(
    null
  );
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  // Get order ID from URL params
  const existingOrderId = searchParams.get("orderId");
  const paymentCancelled = searchParams.get("cancelled");

  useEffect(() => {
    // Always expect an order ID for this new flow
    if (existingOrderId) {
      fetchExistingOrder();
    } else {
      // Redirect to cart if no order ID
      router.push("/cart");
    }
  }, [existingOrderId, router]);

  // Clean up cancelled parameter from URL after showing notification
  useEffect(() => {
    if (paymentCancelled) {
      const timer = setTimeout(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("cancelled");
        const newUrl = `/checkout?orderId=${existingOrderId}`;
        router.replace(newUrl);
      }, 5000); // Remove after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [paymentCancelled, existingOrderId, searchParams, router]);

  const fetchExistingOrder = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/user/profile?email=${encodeURIComponent(
          session?.user?.email || ""
        )}`
      );
      const data = await response.json();

      if (data.orders) {
        const order = data.orders.find((o: any) => o.id === existingOrderId);
        if (order) {
          setExistingOrder(order);
        } else {
          // Order not found, redirect to orders page
          router.push("/account/orders");
        }
      } else {
        // No orders found, redirect to orders page
        router.push("/account/orders");
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      // On error, redirect to orders page
      router.push("/account/orders");
    } finally {
      setLoading(false);
    }
  };

  const handleCashOnDelivery = async () => {
    try {
      setPaymentProcessing(true);

      // Update order payment status to completed for COD
      const response = await fetch("/api/orders/update-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: existingOrder.id,
          paymentStatus: "cash_on_delivery",
          status: "confirmed",
        }),
      });

      if (response.ok) {
        // Redirect to order details page
        router.push(`/account/orders/${existingOrder.id}`);
      } else {
        throw new Error("Failed to update order");
      }
    } catch (error) {
      console.error("Error processing COD:", error);
      alert("Failed to process Cash on Delivery. Please try again.");
    } finally {
      setPaymentProcessing(false);
    }
  };

  const handleStripePayment = async () => {
    try {
      setPaymentProcessing(true);
      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
      );

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: existingOrder.items,
          email: session?.user?.email,
          shippingAddress: existingOrder.shippingAddress,
          orderId: existingOrder.id,
          orderAmount: existingOrder.amount,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Checkout API error:", errorData);
        throw new Error(errorData.error || "Failed to create checkout session");
      }

      const checkoutSession = await response.json();

      if (!checkoutSession.id) {
        throw new Error("No session ID returned from checkout");
      }

      const result: any = await stripe?.redirectToCheckout({
        sessionId: checkoutSession.id,
      });

      if (result.error) {
        console.error("Stripe redirect error:", result.error);
        alert(result.error.message);
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      alert(
        `Payment processing failed: ${
          error instanceof Error ? error.message : "Please try again."
        }`
      );
    } finally {
      setPaymentProcessing(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-8">
        <div className="flex items-center justify-center min-h-96">
          <FiLoader className="animate-spin text-4xl text-theme-color" />
          <span className="ml-4 text-lg">Loading order details...</span>
        </div>
      </Container>
    );
  }

  if (!session?.user) {
    return (
      <Container className="py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Please Sign In
          </h1>
          <p className="text-gray-600 mb-6">
            You need to be signed in to complete your order.
          </p>
          <Link
            href="/auth/signin"
            className="bg-theme-color text-white px-6 py-3 rounded-lg hover:bg-theme-color/90 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </Container>
    );
  }

  if (!existingOrder) {
    return (
      <Container className="py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Order not found
          </h1>
          <p className="text-gray-600 mb-6">
            The order you&apos;re looking for could not be found.
          </p>
          <Link
            href="/account/orders"
            className="bg-theme-color text-white px-6 py-3 rounded-lg hover:bg-theme-color/90 transition-colors"
          >
            View Orders
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <ProtectedRoute loadingMessage="Loading checkout...">
      <Container className="py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              href="/account/orders"
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Order #{existingOrder?.orderId || existingOrderId}
              </h1>
              <p className="text-gray-600">Choose your payment method</p>
            </div>
          </div>
        </div>

        {/* Payment Cancelled Notification */}
        {paymentCancelled && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Payment Cancelled
                </h3>
                <div className="mt-1 text-sm text-yellow-700">
                  <p>
                    Your payment was cancelled. You can try the payment again
                    when you&apos;re ready.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiPackage className="w-5 h-5 mr-2" />
                Order Items ({existingOrder?.items?.length || 0})
              </h3>

              <div className="space-y-4">
                {existingOrder?.items?.map((item: any, index: number) => (
                  <div
                    key={`order-${item.id}-${index}`}
                    className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex-shrink-0">
                      {item.images && item.images[0] ? (
                        <img
                          src={item.images[0]}
                          alt={item.name || item.title}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gray-300 rounded-lg flex items-center justify-center">
                          <span className="text-lg font-medium text-gray-600">
                            {(item.name || item.title)
                              ?.charAt(0)
                              ?.toUpperCase() || "P"}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">
                        {item.name || item.title}
                      </h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>Qty: {item.quantity}</span>
                        <span>
                          <PriceFormat amount={item.price} />
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        <PriceFormat amount={item.total} />
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiMapPin className="w-5 h-5 mr-2" />
                Shipping Address
              </h3>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900">
                  {existingOrder?.shippingAddress?.name}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {existingOrder?.shippingAddress?.address}
                </p>
                <p className="text-sm text-gray-600">
                  {existingOrder?.shippingAddress?.city},{" "}
                  {existingOrder?.shippingAddress?.state}{" "}
                  {existingOrder?.shippingAddress?.zipCode}
                </p>
                <p className="text-sm text-gray-600">
                  {existingOrder?.shippingAddress?.country}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Options & Order Summary */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiCreditCard className="w-5 h-5 mr-2" />
                Order Summary
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount</span>
                  <PriceFormat
                    amount={parseFloat(existingOrder?.amount || "0")}
                    className="font-semibold text-theme-color"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Choose Payment Method
              </h3>

              <div className="space-y-3">
                {/* Cash on Delivery */}
                <div
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                    paymentMethod === "cod"
                      ? "border-theme-color bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setPaymentMethod("cod")}
                >
                  <div className="flex items-center">
                    <FiTruck className="w-5 h-5 mr-3 text-gray-600" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        Cash on Delivery
                      </h4>
                      <p className="text-sm text-gray-600">
                        Pay when your order is delivered
                      </p>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border-2 ${
                        paymentMethod === "cod"
                          ? "border-theme-color bg-theme-color"
                          : "border-gray-300"
                      }`}
                    >
                      {paymentMethod === "cod" && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stripe Payment */}
                <div
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                    paymentMethod === "stripe"
                      ? "border-theme-color bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setPaymentMethod("stripe")}
                >
                  <div className="flex items-center">
                    <FiCreditCard className="w-5 h-5 mr-3 text-gray-600" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        Pay with Card
                      </h4>
                      <p className="text-sm text-gray-600">
                        Secure payment via Stripe
                      </p>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border-2 ${
                        paymentMethod === "stripe"
                          ? "border-theme-color bg-theme-color"
                          : "border-gray-300"
                      }`}
                    >
                      {paymentMethod === "stripe" && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6">
                {paymentMethod === "cod" ? (
                  <button
                    onClick={handleCashOnDelivery}
                    disabled={paymentProcessing}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {paymentProcessing ? (
                      <>
                        <FiLoader className="animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      "Confirm Cash on Delivery"
                    )}
                  </button>
                ) : paymentMethod === "stripe" ? (
                  <button
                    onClick={handleStripePayment}
                    disabled={paymentProcessing}
                    className="w-full bg-theme-color text-white py-3 px-4 rounded-lg hover:bg-theme-color/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {paymentProcessing ? (
                      <>
                        <FiLoader className="animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      "Pay with Card"
                    )}
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full bg-gray-300 text-gray-500 py-3 px-4 rounded-lg cursor-not-allowed"
                  >
                    Select Payment Method
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </ProtectedRoute>
  );
};

export default CheckoutPage;
