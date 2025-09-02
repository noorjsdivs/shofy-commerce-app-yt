"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  USER_ROLES,
  hasPermission,
  getAvailableStatusUpdates,
  ORDER_STATUSES,
} from "@/lib/rbac/permissions";
import RoleProtectedRoute from "@/components/auth/RoleProtectedRoute";

interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
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
  }>;
  createdAt: string;
  updatedAt: string;
}

interface OrdersStats {
  totalOrders: number;
  readyForShipping: number;
  inTransit: number;
  delivered: number;
}

function DeliveryDashboardContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrdersStats>({
    totalOrders: 0,
    readyForShipping: 0,
    inTransit: 0,
    delivered: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Check authentication and role
  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user) {
      router.push("/auth/signin");
      return;
    }

    // @ts-ignore
    if (
      session.user.role !== USER_ROLES.DELIVERYMAN &&
      session.user.role !== USER_ROLES.ADMIN
    ) {
      router.push("/account");
      return;
    }

    fetchOrders();
  }, [session, status]);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/admin/orders");
      if (!response.ok) throw new Error("Failed to fetch orders");

      const data = await response.json();

      // Filter orders relevant to delivery (packed, shipped, out for delivery)
      const deliveryOrders = data.filter((order: Order) =>
        [
          ORDER_STATUSES.PACKED,
          ORDER_STATUSES.SHIPPED,
          ORDER_STATUSES.OUT_FOR_DELIVERY,
          ORDER_STATUSES.DELIVERED,
        ].includes(order.status as any)
      );

      setOrders(deliveryOrders);

      // Calculate stats
      const newStats = {
        totalOrders: deliveryOrders.length,
        readyForShipping: deliveryOrders.filter(
          (o: Order) => o.status === ORDER_STATUSES.PACKED
        ).length,
        inTransit: deliveryOrders.filter((o: Order) =>
          [ORDER_STATUSES.SHIPPED, ORDER_STATUSES.OUT_FOR_DELIVERY].includes(
            o.status as any
          )
        ).length,
        delivered: deliveryOrders.filter(
          (o: Order) => o.status === ORDER_STATUSES.DELIVERED
        ).length,
      };
      setStats(newStats);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setIsUpdatingStatus(true);
    try {
      const response = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          status: newStatus,
        }),
      });

      if (!response.ok) throw new Error("Failed to update order status");

      toast.success("Order status updated successfully");
      fetchOrders(); // Refresh the data
      setSelectedOrder(null);
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userEmail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case ORDER_STATUSES.PACKED:
        return "bg-yellow-100 text-yellow-800";
      case ORDER_STATUSES.SHIPPED:
        return "bg-blue-100 text-blue-800";
      case ORDER_STATUSES.OUT_FOR_DELIVERY:
        return "bg-purple-100 text-purple-800";
      case ORDER_STATUSES.DELIVERED:
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatStatus = (status: string) => {
    return status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
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
          <h1 className="text-3xl font-bold text-gray-900">
            Delivery Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Manage order deliveries and track shipments
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 text-indigo-600 text-2xl flex items-center justify-center">
                  🚚
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
                  📍
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Ready for Shipping
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.readyForShipping}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 text-blue-600 text-2xl flex items-center justify-center">
                  ⏰
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">In Transit</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.inTransit}
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
                <p className="text-sm font-medium text-gray-500">Delivered</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.delivered}
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
                placeholder="Search by order number, customer name, or email..."
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
                <option value="all">All Statuses</option>
                <option value="packed">Ready for Shipping</option>
                <option value="shipped">Shipped</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delivery Address
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
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.orderNumber}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.userName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.userEmail}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {formatStatus(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {order.shippingAddress.fullName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.shippingAddress.address},{" "}
                        {order.shippingAddress.city}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.shippingAddress.state}{" "}
                        {order.shippingAddress.zipCode}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-indigo-600 hover:text-indigo-900 flex items-center"
                        >
                          <span className="mr-1">👁️</span>
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400 text-4xl flex items-center justify-center">
                🚚
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No orders found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "No delivery orders available at the moment."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-gray-600/50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Order Details - {selectedOrder.orderNumber}
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="sr-only">Close</span>✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Customer Info */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Customer Information
                </h4>
                <div className="bg-gray-50 p-3 rounded">
                  <p>
                    <strong>Name:</strong> {selectedOrder.userName}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedOrder.userEmail}
                  </p>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Shipping Address
                </h4>
                <div className="bg-gray-50 p-3 rounded">
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

              {/* Order Items */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Order Items</h4>
                <div className="bg-gray-50 p-3 rounded space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span>
                        {item.name} (x{item.quantity})
                      </span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 font-medium">
                    <div className="flex justify-between">
                      <span>Total:</span>
                      <span>${selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Update */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Update Status
                </h4>
                <div className="flex flex-wrap gap-2">
                  {getAvailableStatusUpdates(
                    session?.user?.role as any,
                    selectedOrder.status
                  ).map((status) => (
                    <button
                      key={status}
                      onClick={() =>
                        updateOrderStatus(selectedOrder.id, status)
                      }
                      disabled={isUpdatingStatus}
                      className="px-3 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 disabled:opacity-50"
                    >
                      Mark as {formatStatus(status)}
                    </button>
                  ))}
                </div>
                {getAvailableStatusUpdates(
                  session?.user?.role as any,
                  selectedOrder.status
                ).length === 0 && (
                  <p className="text-sm text-gray-500">
                    No status updates available for this order.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DeliveryDashboard() {
  return (
    <RoleProtectedRoute
      allowedRoles={[USER_ROLES.DELIVERYMAN, USER_ROLES.ADMIN]}
    >
      <DeliveryDashboardContent />
    </RoleProtectedRoute>
  );
}
