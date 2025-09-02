"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  USER_ROLES,
  hasPermission,
  getDashboardRoute,
  ORDER_STATUSES,
} from "@/lib/rbac/permissions";
import MainLoader from "@/components/MainLoader";
import {
  FiPackage,
  FiClock,
  FiCheck,
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiAlertCircle,
} from "react-icons/fi";
import PriceFormat from "@/components/PriceFormat";

interface Order {
  id: string;
  orderId: string;
  amount: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
  items: any[];
  customerEmail: string;
  customerName: string;
  packingNotes?: string;
}

export default function PackerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingOrders, setUpdatingOrders] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user) {
      router.push("/auth/signin");
      return;
    }

    const userRole = session.user.role as string;

    if (userRole !== USER_ROLES.PACKER && userRole !== USER_ROLES.ADMIN) {
      router.push(getDashboardRoute(userRole as any));
      return;
    }

    fetchOrders();
  }, [session, status, router]);

  useEffect(() => {
    let filtered = [...orders];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/orders");

      if (response.ok) {
        const data = await response.json();
        const allOrders: Order[] = [];

        // Combine orders from users
        if (data.users && Array.isArray(data.users)) {
          data.users.forEach((user: any) => {
            if (user.orders && Array.isArray(user.orders)) {
              user.orders.forEach((order: any) => {
                allOrders.push({
                  ...order,
                  customerName: user.name,
                  customerEmail: user.email,
                });
              });
            }
          });
        }

        // Add standalone orders if they exist
        if (data.standaloneOrders && Array.isArray(data.standaloneOrders)) {
          allOrders.push(...data.standaloneOrders);
        }

        // Filter orders relevant for packer (processing orders that need packing)
        const packerOrders = allOrders.filter(
          (order) =>
            order.status === ORDER_STATUSES.PROCESSING ||
            order.status === ORDER_STATUSES.PACKED
        );

        setOrders(packerOrders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsPacked = async (orderId: string) => {
    setUpdatingOrders((prev) => new Set(prev).add(orderId));

    try {
      const response = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          status: ORDER_STATUSES.PACKED,
          packingNotes: `Packed by ${
            session?.user?.name || "Packer"
          } on ${new Date().toLocaleString()}`,
        }),
      });

      if (response.ok) {
        await fetchOrders();
      } else {
        alert("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Error updating order");
    } finally {
      setUpdatingOrders((prev) => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

  const getPendingCount = () =>
    orders.filter((order) => order.status === ORDER_STATUSES.PROCESSING).length;
  const getPackedCount = () =>
    orders.filter((order) => order.status === ORDER_STATUSES.PACKED).length;

  if (status === "loading" || loading) {
    return <MainLoader />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Packer Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage order packing and preparation
              </p>
            </div>
            <button
              onClick={fetchOrders}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <FiRefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FiClock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Pending Packing
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {getPendingCount()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FiCheck className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Packed Today
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {getPackedCount()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FiPackage className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Orders
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {orders.length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search by Order ID, Customer..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="all">All Status</option>
                  <option value="processing">Pending Packing</option>
                  <option value="packed">Packed</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
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
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
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
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FiPackage className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            #{order.orderId || order.id.slice(-8)}
                          </div>
                          <div className="text-sm text-gray-500">
                            <PriceFormat amount={Number(order.amount) || 0} />
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.items?.length || 0} items
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          order.status === ORDER_STATUSES.PROCESSING
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === ORDER_STATUSES.PACKED
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.status === ORDER_STATUSES.PROCESSING
                          ? "Ready to Pack"
                          : order.status === ORDER_STATUSES.PACKED
                          ? "Packed"
                          : order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {order.status === ORDER_STATUSES.PROCESSING ? (
                        <button
                          onClick={() => handleMarkAsPacked(order.id)}
                          disabled={updatingOrders.has(order.id)}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                        >
                          {updatingOrders.has(order.id) ? (
                            <>
                              <FiClock className="mr-2 h-4 w-4 animate-spin" />
                              Packing...
                            </>
                          ) : (
                            <>
                              <FiCheck className="mr-2 h-4 w-4" />
                              Mark as Packed
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="text-green-600 flex items-center">
                          <FiCheck className="mr-1 h-4 w-4" />
                          Packed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && !loading && (
            <div className="text-center py-12">
              <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No orders to pack
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== "all"
                  ? "No orders match your search criteria"
                  : "All orders are packed or no orders ready for packing"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
