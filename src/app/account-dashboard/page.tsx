"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  USER_ROLES,
  hasPermission,
  getDashboardRoute,
} from "@/lib/rbac/permissions";
import MainLoader from "@/components/MainLoader";
import {
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiUsers,
  FiPackage,
  FiCreditCard,
  FiBarChart,
  FiPieChart,
} from "react-icons/fi";
import PriceFormat from "@/components/PriceFormat";

interface AccountMetrics {
  totalRevenue: number;
  todayRevenue: number;
  monthlyRevenue: number;
  totalOrders: number;
  paidOrders: number;
  pendingPayments: number;
  refunds: number;
  profitMargin: number;
  expenses: number;
  netProfit: number;
}

interface PaymentRecord {
  id: string;
  orderId: string;
  amount: number;
  method: string;
  status: string;
  date: string;
  customerName: string;
}

export default function AccountDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<AccountMetrics | null>(null);
  const [recentPayments, setRecentPayments] = useState<PaymentRecord[]>([]);

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user) {
      router.push("/auth/signin");
      return;
    }

    const userRole = session.user.role as string;

    if (userRole !== USER_ROLES.ACCOUNT && userRole !== USER_ROLES.ADMIN) {
      router.push(getDashboardRoute(userRole as any));
      return;
    }

    fetchAccountData();
  }, [session, status, router]);

  const fetchAccountData = async () => {
    try {
      setLoading(true);

      // Fetch orders for accounting calculations
      const ordersResponse = await fetch("/api/admin/orders");
      const ordersData = await ordersResponse.json();

      let allOrders: any[] = [];

      // Combine orders from users and standalone orders
      if (ordersData.users && Array.isArray(ordersData.users)) {
        ordersData.users.forEach((user: any) => {
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

      if (
        ordersData.standaloneOrders &&
        Array.isArray(ordersData.standaloneOrders)
      ) {
        allOrders.push(...ordersData.standaloneOrders);
      }

      // Calculate metrics
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const totalRevenue = allOrders.reduce(
        (sum, order) => sum + (Number(order.amount) || 0),
        0
      );

      const todayOrders = allOrders.filter(
        (order) => new Date(order.createdAt) >= today
      );
      const todayRevenue = todayOrders.reduce(
        (sum, order) => sum + (Number(order.amount) || 0),
        0
      );

      const monthlyOrders = allOrders.filter(
        (order) => new Date(order.createdAt) >= thisMonth
      );
      const monthlyRevenue = monthlyOrders.reduce(
        (sum, order) => sum + (Number(order.amount) || 0),
        0
      );

      const paidOrders = allOrders.filter(
        (order) => order.paymentStatus === "paid"
      ).length;
      const pendingPayments = allOrders.filter(
        (order) => order.paymentStatus === "pending"
      ).length;
      const refunds = allOrders.filter(
        (order) => order.paymentStatus === "refunded"
      ).length;

      // Mock calculations for profit/loss (in real app, you'd have cost data)
      const expenses = totalRevenue * 0.3; // Assume 30% expenses
      const netProfit = totalRevenue - expenses;
      const profitMargin =
        totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

      setMetrics({
        totalRevenue,
        todayRevenue,
        monthlyRevenue,
        totalOrders: allOrders.length,
        paidOrders,
        pendingPayments,
        refunds,
        profitMargin,
        expenses,
        netProfit,
      });

      // Set recent payments
      const payments = allOrders
        .filter((order) => order.paymentStatus === "paid")
        .slice(0, 10)
        .map((order) => ({
          id: order.id,
          orderId: order.orderId || order.id,
          amount: Number(order.amount) || 0,
          method: order.paymentMethod || "card",
          status: order.paymentStatus,
          date: order.createdAt,
          customerName: order.customerName || "Unknown",
        }));

      setRecentPayments(payments);
    } catch (error) {
      console.error("Error fetching account data:", error);
    } finally {
      setLoading(false);
    }
  };

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
                Account Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Financial overview and payment management
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FiDollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Revenue
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      <PriceFormat amount={metrics?.totalRevenue || 0} />
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
                  <FiTrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Today&apos;s Revenue
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      <PriceFormat amount={metrics?.todayRevenue || 0} />
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
                  <FiBarChart className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Profit Margin
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {metrics?.profitMargin.toFixed(1)}%
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
                  <FiCreditCard className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Pending Payments
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {metrics?.pendingPayments || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Financial Summary
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Total Revenue</span>
                <span className="text-sm font-medium text-gray-900">
                  <PriceFormat amount={metrics?.totalRevenue || 0} />
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Total Expenses</span>
                <span className="text-sm font-medium text-red-600">
                  -<PriceFormat amount={metrics?.expenses || 0} />
                </span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-base font-medium text-gray-900">
                    Net Profit
                  </span>
                  <span
                    className={`text-base font-medium ${
                      (metrics?.netProfit || 0) >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    <PriceFormat amount={metrics?.netProfit || 0} />
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Payment Overview
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Paid Orders</span>
                <span className="text-sm font-medium text-green-600">
                  {metrics?.paidOrders || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Pending Payments</span>
                <span className="text-sm font-medium text-yellow-600">
                  {metrics?.pendingPayments || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Refunds</span>
                <span className="text-sm font-medium text-red-600">
                  {metrics?.refunds || 0}
                </span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-base font-medium text-gray-900">
                    Total Orders
                  </span>
                  <span className="text-base font-medium text-gray-900">
                    {metrics?.totalOrders || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Payments */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Recent Payments
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentPayments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{payment.orderId.slice(-8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <PriceFormat amount={payment.amount} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {payment.method}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(payment.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {recentPayments.length === 0 && (
              <div className="text-center py-12">
                <FiCreditCard className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No payments yet
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Payment records will appear here once customers make payments.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
