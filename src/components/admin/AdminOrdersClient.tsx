"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { AdminTableSkeleton } from "./AdminSkeletons";
import { toast } from "react-hot-toast";
import {
  FiPackage,
  FiTruck,
  FiCheck,
  FiClock,
  FiX,
  FiEdit2,
  FiDollarSign,
  FiUser,
  FiCalendar,
  FiMapPin,
  FiMessageSquare,
  FiRefreshCw,
  FiTrash2,
  FiSave,
  FiSearch,
  FiEye,
} from "react-icons/fi";
import {
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  PAYMENT_METHODS,
  getStatusDisplayInfo,
  getPaymentStatusDisplayInfo,
  getNextPossibleStatuses,
  canUpdatePaymentStatus,
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
} from "@/lib/orderStatus";
import PriceFormat from "@/components/PriceFormat";

interface OrderItem {
  id: string;
  title: string;
  name?: string;
  quantity: number;
  price: number;
  image?: string;
  images?: string[];
  total?: number;
}

interface Order {
  id: string;
  orderId?: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  userEmail: string;
  customerEmail?: string;
  userName?: string;
  customerName?: string;
  userId?: string;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
    phone?: string;
  };
  createdAt: string;
  updatedAt: string;
  statusHistory?: Array<{
    status: string;
    timestamp: string;
    updatedBy: string;
    userRole: string;
    notes: string;
  }>;
  deliveryNotes?: Array<{
    note: string;
    timestamp: string;
    addedBy: string;
    userRole: string;
  }>;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  completed: "bg-green-100 text-green-800",
  confirmed: "bg-blue-100 text-blue-800",
  out_for_delivery: "bg-purple-100 text-purple-800",
};

const paymentStatusColors = {
  paid: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  failed: "bg-red-100 text-red-800",
  refunded: "bg-gray-100 text-gray-800",
  partial: "bg-orange-100 text-orange-800",
};

export default function AdminOrdersClient() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [editingPayment, setEditingPayment] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [newPaymentStatus, setNewPaymentStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [userRole, setUserRole] = useState<string>("");
  const [deliveryNote, setDeliveryNote] = useState("");
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);

  // Modal states
  const [viewOrderModal, setViewOrderModal] = useState<Order | null>(null);
  const [deleteOrderModal, setDeleteOrderModal] = useState<Order | null>(null);
  const [deleteAllModal, setDeleteAllModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (session?.user?.email) {
      fetchUserRole();
    }
  }, [session]);

  // Separate effect to fetch orders after role is set
  useEffect(() => {
    if (userRole && userRole !== "" && session?.user?.email) {
      fetchOrders();
    }
  }, [userRole, session?.user?.email]);

  const fetchUserRole = async () => {
    try {
      const response = await fetch(
        `/api/user/profile?email=${encodeURIComponent(
          session?.user?.email || ""
        )}`
      );
      if (response.ok) {
        const data = await response.json();
        const role = data.role || "user";
        setUserRole(role);
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);

      // Use admin-specific endpoint if user is admin
      const endpoint =
        userRole === "admin" ? "/api/admin/orders" : "/api/orders";
      const response = await fetch(endpoint);

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to fetch orders");
        return;
      }

      const data = await response.json();

      // Handle different response formats
      if (data.orders) {
        setOrders(data.orders);
      } else if (data.users) {
        // Extract orders from users for admin endpoint
        const allOrders: Order[] = [];
        data.users.forEach((user: any) => {
          if (user.orders && Array.isArray(user.orders)) {
            user.orders.forEach((order: any) => {
              allOrders.push({
                ...order,
                userEmail: user.email,
                userName: user.name,
              });
            });
          }
        });
        setOrders(allOrders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };
  const updateOrderStatus = async (
    orderId: string,
    newStatus: OrderStatus,
    paymentStatus?: PaymentStatus
  ) => {
    try {
      setUpdatingOrder(orderId);

      const updateData: any = { orderId, status: newStatus };

      if (paymentStatus) {
        updateData.paymentStatus = paymentStatus;
      }

      if (deliveryNote.trim()) {
        updateData.deliveryNotes = deliveryNote.trim();
      }

      // Use admin-specific endpoint for updates if user is admin
      const endpoint =
        userRole === "admin" ? "/api/admin/orders" : "/api/orders";
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        toast.success(
          `Order status updated to ${getStatusDisplayInfo(newStatus).label}`
        );
        await fetchOrders();
        setDeliveryNote("");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update order");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order");
    } finally {
      setUpdatingOrder(null);
    }
  };

  const updatePaymentStatus = async (
    orderId: string,
    newPaymentStatus: PaymentStatus
  ) => {
    try {
      setUpdatingOrder(orderId);

      const response = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          paymentStatus: newPaymentStatus,
          deliveryNotes:
            deliveryNote.trim() || `Payment marked as ${newPaymentStatus}`,
        }),
      });

      if (response.ok) {
        toast.success(`Payment status updated to ${newPaymentStatus}`);
        await fetchOrders();
        setDeliveryNote("");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update payment status");
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
      toast.error("Failed to update payment status");
    } finally {
      setUpdatingOrder(null);
    }
  };

  // Filter orders based on search and filters
  useEffect(() => {
    let filtered = [...orders];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          (order.orderId || order.id)
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (order.customerName || order.userName || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (order.customerEmail || order.userEmail || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (order) => order.status.toLowerCase() === statusFilter
      );
    }

    // Payment status filter
    if (paymentFilter !== "all") {
      filtered = filtered.filter(
        (order) => order.paymentStatus.toLowerCase() === paymentFilter
      );
    }

    setFilteredOrders(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [orders, searchTerm, statusFilter, paymentFilter]);

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status }),
      });

      if (response.ok) {
        await fetchOrders();
        setEditingOrder(null);
        setNewStatus("");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleUpdatePaymentStatus = async (
    orderId: string,
    paymentStatus: string
  ) => {
    try {
      const response = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, paymentStatus }),
      });

      if (response.ok) {
        await fetchOrders();
        setEditingPayment(null);
        setNewPaymentStatus("");
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };

  const handleDeleteOrder = async (order: Order) => {
    setDeleteOrderModal(order);
  };

  const confirmDeleteOrder = async () => {
    if (!deleteOrderModal) return;

    try {
      const response = await fetch(`/api/admin/orders/${deleteOrderModal.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchOrders();
        setDeleteOrderModal(null);
      } else {
        alert("Failed to delete order");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Error deleting order");
    }
  };

  const handleDeleteAllOrders = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch("/api/admin/orders/bulk-delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        await fetchOrders();
        setDeleteAllModal(false);
      } else {
        console.error("Failed to delete all orders");
      }
    } catch (error) {
      console.error("Error deleting all orders:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Calculate pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  // Check if user is admin
  const isAdmin = session?.user?.role === "admin";

  if (loading) {
    return <AdminTableSkeleton rows={5} />;
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Orders Management ({filteredOrders.length})
          </h2>
          {isAdmin && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setDeleteAllModal(true)}
                className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                disabled={orders.length === 0}
              >
                <FiTrash2 className="mr-2 h-4 w-4" />
                Delete All
              </button>
              <button
                onClick={fetchOrders}
                className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
              >
                <FiRefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by Order ID, Customer, Email, or Tracking..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Payment Filter */}
          <div className="sm:w-48">
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Payments</option>
              <option value="paid">Paid</option>
              <option value="pending">Payment Pending</option>
              <option value="failed">Payment Failed</option>
              <option value="refunded">Refunded</option>
              <option value="partial">Partial Payment</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
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
                Payment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FiPackage className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        #{order.orderId || order.id.slice(-8)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.items?.length || 0} items
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {order.customerName || "No Name"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.customerEmail}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingOrder?.id === order.id ? (
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select Status</option>
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  ) : (
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        statusColors[
                          order.status as keyof typeof statusColors
                        ] || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingPayment?.id === order.id ? (
                    <select
                      value={newPaymentStatus}
                      onChange={(e) => setNewPaymentStatus(e.target.value)}
                      className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select Payment</option>
                      <option value="paid">Paid</option>
                      <option value="pending">Pending</option>
                      <option value="failed">Failed</option>
                      <option value="refunded">Refunded</option>
                      <option value="partial">Partial</option>
                    </select>
                  ) : (
                    <div className="space-y-1">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          paymentStatusColors[
                            order.paymentStatus as keyof typeof paymentStatusColors
                          ] || "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.paymentStatus || "Unknown"}
                      </span>
                      {order.paymentMethod && (
                        <div className="text-xs text-gray-500 capitalize">
                          {order.paymentMethod}
                        </div>
                      )}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <PriceFormat amount={order.total || 0} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {editingOrder?.id === order.id ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleUpdateStatus(order.id, newStatus)}
                        disabled={!newStatus}
                        className="p-1 text-green-600 hover:text-green-900 disabled:text-gray-400 transition-colors"
                        title="Save Status"
                      >
                        <FiSave size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setEditingOrder(null);
                          setNewStatus("");
                        }}
                        className="p-1 text-gray-600 hover:text-gray-900 transition-colors"
                        title="Cancel"
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                  ) : editingPayment?.id === order.id ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          handleUpdatePaymentStatus(order.id, newPaymentStatus)
                        }
                        disabled={!newPaymentStatus}
                        className="p-1 text-green-600 hover:text-green-900 disabled:text-gray-400 transition-colors"
                        title="Save Payment"
                      >
                        <FiSave size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setEditingPayment(null);
                          setNewPaymentStatus("");
                        }}
                        className="p-1 text-gray-600 hover:text-gray-900 transition-colors"
                        title="Cancel"
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setViewOrderModal(order)}
                        className="p-1 text-blue-600 hover:text-blue-900 transition-colors"
                        title="View Details"
                      >
                        <FiEye size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setEditingOrder(order);
                          setNewStatus(order.status);
                        }}
                        className="p-1 text-indigo-600 hover:text-indigo-900 transition-colors"
                        title="Edit Status"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setEditingPayment(order);
                          setNewPaymentStatus(order.paymentStatus);
                        }}
                        className="p-1 text-green-600 hover:text-green-900 transition-colors"
                        title="Edit Payment"
                      >
                        💳
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => handleDeleteOrder(order)}
                          className="p-1 text-red-600 hover:text-red-900 transition-colors"
                          title="Delete Order"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredOrders.length === 0 && !loading && (
        <div className="px-6 py-12 text-center">
          <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No orders</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== "all" || paymentFilter !== "all"
              ? "No orders match your search criteria"
              : "No orders have been placed yet"}
          </p>
        </div>
      )}

      {/* View Order Modal */}
      {viewOrderModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  Order Details
                </h3>
                <button
                  onClick={() => setViewOrderModal(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX size={24} />
                </button>
              </div>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <h4 className="font-medium text-gray-900">Order Information</h4>
                <dl className="mt-2 grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Order ID
                    </dt>
                    <dd className="text-sm text-gray-900">
                      #{viewOrderModal.orderId || viewOrderModal.id.slice(-8)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Status
                    </dt>
                    <dd className="text-sm text-gray-900">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          statusColors[
                            viewOrderModal.status as keyof typeof statusColors
                          ] || "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {viewOrderModal.status}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Customer
                    </dt>
                    <dd className="text-sm text-gray-900">
                      {viewOrderModal.customerName}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="text-sm text-gray-900">
                      {viewOrderModal.customerEmail}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Total Amount
                    </dt>
                    <dd className="text-sm text-gray-900">
                      <PriceFormat amount={viewOrderModal.total || 0} />
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Date</dt>
                    <dd className="text-sm text-gray-900">
                      {viewOrderModal.createdAt
                        ? new Date(viewOrderModal.createdAt).toLocaleString()
                        : "N/A"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Payment Status
                    </dt>
                    <dd className="text-sm text-gray-900">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          paymentStatusColors[
                            viewOrderModal.paymentStatus as keyof typeof paymentStatusColors
                          ] || "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {viewOrderModal.paymentStatus || "Unknown"}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Payment Method
                    </dt>
                    <dd className="text-sm text-gray-900 capitalize">
                      {viewOrderModal.paymentMethod || "Not specified"}
                    </dd>
                  </div>
                </dl>
              </div>

              {viewOrderModal.items && viewOrderModal.items.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900">Items</h4>
                  <div className="mt-2 space-y-2">
                    {viewOrderModal.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          {item.images && item.images[0] && (
                            <img
                              src={item.images[0]}
                              alt={item.name}
                              className="h-12 w-12 object-cover rounded"
                            />
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {item.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              Qty: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          <PriceFormat
                            amount={item.total || item.price * item.quantity}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {viewOrderModal.shippingAddress && (
                <div>
                  <h4 className="font-medium text-gray-900">
                    Shipping Address
                  </h4>
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-900">
                      {viewOrderModal.shippingAddress.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {viewOrderModal.shippingAddress.address}
                    </p>
                    <p className="text-sm text-gray-600">
                      {viewOrderModal.shippingAddress.city},{" "}
                      {viewOrderModal.shippingAddress.state}{" "}
                      {viewOrderModal.shippingAddress.zipCode}
                    </p>
                    <p className="text-sm text-gray-600">
                      {viewOrderModal.shippingAddress.country}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex justify-end">
                <button
                  onClick={() => setViewOrderModal(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Order Modal */}
      {deleteOrderModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="px-6 py-4">
              <h3 className="text-lg font-medium text-gray-900">
                Delete Order
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Are you sure you want to delete order #
                {deleteOrderModal.orderId || deleteOrderModal.id.slice(-8)}?
                This action cannot be undone.
              </p>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setDeleteOrderModal(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteOrder}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete All Orders Modal */}
      {deleteAllModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="px-6 py-4">
              <h3 className="text-lg font-medium text-gray-900">
                Delete All Orders
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Are you sure you want to delete ALL orders? This action will
                remove all orders from both user accounts and the orders
                collection. This action cannot be undone.
              </p>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setDeleteAllModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAllOrders}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete All"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {filteredOrders.length > ordersPerPage && (
        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {indexOfFirstOrder + 1} to{" "}
              {Math.min(indexOfLastOrder, filteredOrders.length)} of{" "}
              {filteredOrders.length} results
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-3 py-2 text-sm font-medium text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
