"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import {
  USER_ROLES,
  ORDER_STATUSES,
  PAYMENT_STATUSES,
} from "@/lib/rbac/permissions";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  total: number;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    image?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface OrdersStats {
  totalOrders: number;
  activeOrders: number;
  completedOrders: number;
  totalSpent: number;
}

export default function UserDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrdersStats>({
    totalOrders: 0,
    activeOrders: 0,
    completedOrders: 0,
    totalSpent: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Check authentication
  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user) {
      router.push("/auth/signin");
      return;
    }

    fetchOrders();
  }, [session, status]);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/user/orders");
      if (!response.ok) throw new Error("Failed to fetch orders");

      const data = await response.json();
      setOrders(data);

      // Calculate stats
      const newStats = {
        totalOrders: data.length,
        activeOrders: data.filter(
          (order: Order) =>
            ![
              ORDER_STATUSES.DELIVERED,
              ORDER_STATUSES.COMPLETED,
              ORDER_STATUSES.CANCELLED,
            ].includes(order.status as any)
        ).length,
        completedOrders: data.filter((order: Order) =>
          [ORDER_STATUSES.DELIVERED, ORDER_STATUSES.COMPLETED].includes(
            order.status as any
          )
        ).length,
        totalSpent: data.reduce(
          (sum: number, order: Order) => sum + order.total,
          0
        ),
      };
      setStats(newStats);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.orderNumber
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case ORDER_STATUSES.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case ORDER_STATUSES.CONFIRMED:
        return "bg-blue-100 text-blue-800";
      case ORDER_STATUSES.PROCESSING:
        return "bg-indigo-100 text-indigo-800";
      case ORDER_STATUSES.PACKED:
        return "bg-purple-100 text-purple-800";
      case ORDER_STATUSES.SHIPPED:
        return "bg-orange-100 text-orange-800";
      case ORDER_STATUSES.OUT_FOR_DELIVERY:
        return "bg-cyan-100 text-cyan-800";
      case ORDER_STATUSES.DELIVERED:
      case ORDER_STATUSES.COMPLETED:
        return "bg-green-100 text-green-800";
      case ORDER_STATUSES.CANCELLED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case PAYMENT_STATUSES.PAID:
        return "bg-green-100 text-green-800";
      case PAYMENT_STATUSES.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case PAYMENT_STATUSES.FAILED:
        return "bg-red-100 text-red-800";
      case PAYMENT_STATUSES.REFUNDED:
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatStatus = (status: string) => {
    return status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const getOrderProgress = (status: string) => {
    const statusOrder = [
      ORDER_STATUSES.PENDING,
      ORDER_STATUSES.CONFIRMED,
      ORDER_STATUSES.PROCESSING,
      ORDER_STATUSES.PACKED,
      ORDER_STATUSES.SHIPPED,
      ORDER_STATUSES.OUT_FOR_DELIVERY,
      ORDER_STATUSES.DELIVERED,
      ORDER_STATUSES.COMPLETED,
    ];

    const currentIndex = statusOrder.indexOf(status as any);
    return currentIndex >= 0
      ? ((currentIndex + 1) / statusOrder.length) * 100
      : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="mt-2 text-gray-600">
            Track your orders and view purchase history
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 flex flex-wrap gap-4">
          <Link
            href="/products"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Continue Shopping
          </Link>
          <Link
            href="/account"
            className="bg-white text-gray-700 px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Account Settings
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 text-indigo-600 text-2xl flex items-center justify-center">
                  📦
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Total Orders
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.totalOrders}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 text-yellow-600 text-2xl flex items-center justify-center">
                  🚀
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Active Orders
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.activeOrders}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 text-green-600 text-2xl flex items-center justify-center">
                  ✅
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.completedOrders}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 text-blue-600 text-2xl flex items-center justify-center">
                  💰
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Spent</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ${stats.totalSpent.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by order number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Order #{order.orderNumber}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="mt-4 lg:mt-0 flex flex-col sm:flex-row gap-2">
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {formatStatus(order.status)}
                    </span>
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(
                        order.paymentStatus
                      )}`}
                    >
                      Payment: {formatStatus(order.paymentStatus)}
                    </span>
                  </div>
                </div>

                {/* Order Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Order Progress</span>
                    <span>{Math.round(getOrderProgress(order.status))}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getOrderProgress(order.status)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-4">
                    {order.items.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <span className="text-2xl">📦</span>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 truncate max-w-32">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500">
                          +{order.items.length - 3} more items
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-200">
                  <div className="text-lg font-semibold text-gray-900">
                    Total: ${order.total.toFixed(2)}
                  </div>
                  <div className="mt-4 sm:mt-0 flex space-x-3">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                    >
                      View Details
                    </button>
                    {order.status === ORDER_STATUSES.DELIVERED && (
                      <button className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                        Leave Review
                      </button>
                    )}
                    {order.status === ORDER_STATUSES.PENDING && (
                      <button className="text-red-600 hover:text-red-900 text-sm font-medium">
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <div className="mx-auto h-12 w-12 text-gray-400 text-4xl flex items-center justify-center">
              📦
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No orders found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "You haven't placed any orders yet."}
            </p>
            {!searchTerm && statusFilter === "all" && (
              <div className="mt-6">
                <Link
                  href="/products"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Start Shopping
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-gray-600/50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-medium text-gray-900">
                Order Details - {selectedOrder.orderNumber}
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Order Info */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Order Information
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <p>
                      <strong>Order Number:</strong> {selectedOrder.orderNumber}
                    </p>
                    <p>
                      <strong>Status:</strong>
                      <span
                        className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          selectedOrder.status
                        )}`}
                      >
                        {formatStatus(selectedOrder.status)}
                      </span>
                    </p>
                    <p>
                      <strong>Payment Status:</strong>
                      <span
                        className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(
                          selectedOrder.paymentStatus
                        )}`}
                      >
                        {formatStatus(selectedOrder.paymentStatus)}
                      </span>
                    </p>
                    <p>
                      <strong>Order Date:</strong>{" "}
                      {new Date(selectedOrder.createdAt).toLocaleString()}
                    </p>
                    <p>
                      <strong>Total Amount:</strong> $
                      {selectedOrder.total.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Shipping Address
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p>{selectedOrder.shippingAddress.fullName}</p>
                    <p>{selectedOrder.shippingAddress.address}</p>
                    <p>
                      {selectedOrder.shippingAddress.city},{" "}
                      {selectedOrder.shippingAddress.state}{" "}
                      {selectedOrder.shippingAddress.zipCode}
                    </p>
                    <p>{selectedOrder.shippingAddress.country}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Order Items</h4>
                <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <span className="text-xl">📦</span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {item.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500">
                            ${item.price.toFixed(2)} each
                          </p>
                        </div>
                      </div>
                    ))}
                    <div className="border-t border-gray-300 pt-3 mt-3">
                      <div className="flex justify-between items-center font-semibold text-lg">
                        <span>Total:</span>
                        <span>${selectedOrder.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
