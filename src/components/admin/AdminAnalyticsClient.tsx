"use client";

import { useState, useEffect } from "react";
import { AdminCardSkeleton, AdminStatsSkeleton } from "./AdminSkeletons";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiDollarSign,
  FiShoppingCart,
  FiUsers,
  FiPackage,
  FiCalendar,
  FiBarChart,
} from "react-icons/fi";

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  averageOrderValue: number;
  revenueGrowth: number;
  ordersGrowth: number;
  usersGrowth: number;
  monthlyRevenue: Array<{ month: string; revenue: number }>;
  topProducts: Array<{ name: string; sales: number; revenue: number }>;
  ordersByStatus: Array<{ status: string; count: number; percentage: number }>;
}

export default function AdminAnalyticsClient() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/analytics");
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <AdminStatsSkeleton />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AdminCardSkeleton />
          <AdminCardSkeleton />
        </div>
        <AdminCardSkeleton />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <FiBarChart className="mx-auto h-12 w-12 text-gray-400" />
        <p className="text-gray-500 mt-4">Unable to load analytics data</p>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Revenue",
      value: `$${analytics.totalRevenue.toFixed(2)}`,
      change: analytics.revenueGrowth,
      icon: FiDollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Orders",
      value: analytics.totalOrders.toString(),
      change: analytics.ordersGrowth,
      icon: FiShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Users",
      value: analytics.totalUsers.toString(),
      change: analytics.usersGrowth,
      icon: FiUsers,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Average Order",
      value: `$${analytics.averageOrderValue.toFixed(2)}`,
      change: 0,
      icon: FiPackage,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  {stat.value}
                </p>
                {stat.change !== 0 && (
                  <div className="flex items-center mt-2">
                    {stat.change > 0 ? (
                      <FiTrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <FiTrendingDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        stat.change > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {stat.change > 0 ? "+" : ""}
                      {stat.change.toFixed(1)}%
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      from last month
                    </span>
                  </div>
                )}
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Monthly Revenue
            </h3>
            <FiCalendar className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {analytics.monthlyRevenue.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{item.month}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          (item.revenue /
                            Math.max(
                              ...analytics.monthlyRevenue.map((r) => r.revenue)
                            )) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-16 text-right">
                    ${item.revenue.toFixed(0)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Orders by Status
            </h3>
            <FiBarChart className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {analytics.ordersByStatus.map((item, index) => {
              const colors = [
                "bg-yellow-500",
                "bg-blue-500",
                "bg-indigo-500",
                "bg-green-500",
                "bg-red-500",
              ];
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        colors[index % colors.length]
                      }`}
                    />
                    <span className="text-sm text-gray-600 capitalize">
                      {item.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">
                      {item.count}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({item.percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sales
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analytics.topProducts.map((product, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          #{index + 1}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.sales} units
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${product.revenue.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {analytics.topProducts.length === 0 && (
          <div className="px-6 py-12 text-center">
            <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
            <p className="text-gray-500 mt-4">No product data available</p>
          </div>
        )}
      </div>
    </div>
  );
}
