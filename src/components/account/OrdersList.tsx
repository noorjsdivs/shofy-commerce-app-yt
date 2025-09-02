"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import PriceFormat from "@/components/PriceFormat";
import {
  FiEye,
  FiX,
  FiPackage,
  FiCalendar,
  FiCreditCard,
} from "react-icons/fi";
import Link from "next/link";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  images: string[];
  total: number;
}

interface Order {
  id: string;
  orderId: string;
  amount: string;
  currency: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
  items: OrderItem[];
  customerEmail: string;
  customerName: string;
}

interface OrdersListProps {
  showHeader?: boolean;
  onOrdersChange?: (orders: Order[]) => void;
}

export default function OrdersList({
  showHeader = false,
  onOrdersChange,
}: OrdersListProps) {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (session?.user?.email) {
      fetchOrders();
    }
  }, [session?.user?.email]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/user/profile?email=${encodeURIComponent(
          session?.user?.email || ""
        )}`
      );
      const data = await response.json();

      if (data.orders && Array.isArray(data.orders)) {
        const sortedOrders = data.orders.sort(
          (a: Order, b: Order) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setOrders(sortedOrders);
        onOrdersChange?.(sortedOrders);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const openOrderModal = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeOrderModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  const OrderDetailsModal = () => {
    if (!selectedOrder || !isModalOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Background overlay */}
        <div
          className="absolute inset-0 bg-black/50 transition-opacity"
          onClick={closeOrderModal}
        ></div>

        {/* Modal */}
        <div className="relative w-full max-w-4xl bg-white shadow-xl rounded-lg overflow-hidden z-10 max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Order Details - {selectedOrder.orderId}
              </h3>
              <p className="text-sm text-gray-600">
                Placed on {formatDate(selectedOrder.createdAt)}
              </p>
            </div>
            <button
              onClick={closeOrderModal}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="px-6 py-4 max-h-96 overflow-y-auto">
            {/* Order Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FiPackage className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(
                      selectedOrder.status
                    )}`}
                  >
                    {selectedOrder.status}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FiCreditCard className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="font-semibold text-gray-900">
                    <PriceFormat amount={parseFloat(selectedOrder.amount)} />
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FiCalendar className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Status</p>
                  <p className="font-medium text-gray-900 capitalize">
                    {selectedOrder.paymentStatus}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Items ({selectedOrder.items.length})
              </h4>
              <div className="space-y-4">
                {selectedOrder.items.map((item, index) => (
                  <div
                    key={`${item.id}-${index}`}
                    className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-shrink-0">
                      {item.images && item.images[0] ? (
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gray-300 rounded-lg flex items-center justify-center">
                          <span className="text-lg font-medium text-gray-600">
                            {item.name?.charAt(0)?.toUpperCase() || "P"}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900 mb-1">
                        {item.name}
                      </h5>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>Quantity: {item.quantity}</span>
                        <span>
                          Unit Price: <PriceFormat amount={item.price} />
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
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeOrderModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              {selectedOrder.status.toLowerCase() === "confirmed" &&
                selectedOrder.paymentStatus.toLowerCase() === "paid" && (
                  <Link
                    href={`/account/orders/${selectedOrder.id}`}
                    className="px-4 py-2 text-sm font-medium text-white bg-theme-color rounded-md hover:bg-theme-color/90 transition-colors"
                  >
                    Track Order
                  </Link>
                )}
              {selectedOrder.paymentStatus.toLowerCase() === "pending" && (
                <Link
                  href={`/checkout?orderId=${selectedOrder.id}`}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
                >
                  Pay Now
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {showHeader && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Order History</h2>
            <p className="text-gray-600">Track and manage your orders</p>
          </div>
        )}
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="h-6 bg-gray-200 rounded w-32"></div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-2">⚠️</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Error Loading Orders
        </h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={fetchOrders}
          className="px-4 py-2 bg-theme-color text-white rounded-lg hover:bg-theme-color/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        {showHeader && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Order History</h2>
            <p className="text-gray-600">Track and manage your orders</p>
          </div>
        )}
        <div className="text-6xl mb-4">🛍️</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Orders Yet
        </h3>
        <p className="text-gray-600 mb-6">
          Looks like you haven&apos;t placed any orders yet. Start shopping to
          see your orders here.
        </p>
        <Link
          href="/products"
          className="inline-block px-6 py-3 bg-theme-color text-white rounded-lg hover:bg-theme-color/90 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div>
      {showHeader && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Order History</h2>
          <p className="text-gray-600">
            {orders.length} order{orders.length !== 1 ? "s" : ""} found
          </p>
        </div>
      )}

      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <div className="overflow-hidden bg-white shadow ring-1 ring-black ring-opacity-5 rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        #{order.orderId}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.customerEmail}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(order.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex -space-x-2 overflow-hidden">
                        {order.items.slice(0, 3).map((item, index) => (
                          <div
                            key={index}
                            className="inline-block h-8 w-8 rounded-full ring-2 ring-white overflow-hidden"
                          >
                            {item.images && item.images[0] ? (
                              <img
                                src={item.images[0]}
                                alt={item.name}
                                className="h-8 w-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium text-gray-600">
                                  {item.name?.charAt(0)?.toUpperCase() || "P"}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {order.items.length} item
                        {order.items.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">
                      Payment: {order.paymentStatus}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      <PriceFormat amount={parseFloat(order.amount)} />
                    </div>
                    <div className="text-xs text-gray-500 uppercase">
                      {order.currency}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openOrderModal(order)}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                      >
                        <FiEye className="w-3 h-3 mr-1" />
                        View Details
                      </button>
                      {order.status.toLowerCase() === "confirmed" &&
                        order.paymentStatus.toLowerCase() === "paid" && (
                          <Link
                            href={`/account/orders/${order.id}`}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-theme-color hover:bg-theme-color/90 transition-colors"
                          >
                            Track
                          </Link>
                        )}
                      {order.paymentStatus.toLowerCase() === "pending" && (
                        <Link
                          href={`/checkout?orderId=${order.id}`}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 transition-colors"
                        >
                          Pay Now
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-lg shadow border border-gray-200 p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  #{order.orderId}
                </h3>
                <p className="text-xs text-gray-500">
                  {formatDate(order.createdAt)}
                </p>
              </div>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </div>

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-1 overflow-hidden">
                  {order.items.slice(0, 2).map((item, index) => (
                    <div
                      key={index}
                      className="inline-block h-6 w-6 rounded-full ring-1 ring-white overflow-hidden"
                    >
                      {item.images && item.images[0] ? (
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="h-6 w-6 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-6 w-6 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">
                            {item.name?.charAt(0)?.toUpperCase() || "P"}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <span className="text-xs text-gray-600">
                  {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  <PriceFormat amount={parseFloat(order.amount)} />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-xs text-gray-500">
                Payment: {order.paymentStatus}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => openOrderModal(order)}
                  className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  View Details
                </button>
                {order.status.toLowerCase() === "confirmed" &&
                  order.paymentStatus.toLowerCase() === "paid" && (
                    <Link
                      href={`/account/orders/${order.id}`}
                      className="px-3 py-1 text-xs bg-theme-color text-white rounded hover:bg-theme-color/90 transition-colors"
                    >
                      Track
                    </Link>
                  )}
                {order.paymentStatus.toLowerCase() === "pending" && (
                  <Link
                    href={`/checkout?orderId=${order.id}`}
                    className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    Pay Now
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal />
    </div>
  );
}
