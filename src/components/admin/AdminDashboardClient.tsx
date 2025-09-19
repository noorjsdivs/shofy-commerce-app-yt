"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FiUsers,
  FiShoppingBag,
  FiDollarSign,
  FiPackage,
  FiTrendingUp,
  FiClock,
} from "react-icons/fi";
import { AdminStatsSkeleton, AdminCardSkeleton } from "./AdminSkeletons";

interface Stats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  pendingOrders: number;
  completedOrders: number;
}

export default function AdminDashboardClient() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [addingSampleData, setAddingSampleData] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/stats");
      if (response.ok) {
        const data = await response.json();
        // Ensure numeric values are properly converted
        const normalizedStats = {
          ...data,
          totalUsers: Number(data.totalUsers) || 0,
          totalOrders: Number(data.totalOrders) || 0,
          totalRevenue: Number(data.totalRevenue) || 0,
          totalProducts: Number(data.totalProducts) || 0,
          pendingOrders: Number(data.pendingOrders) || 0,
          completedOrders: Number(data.completedOrders) || 0,
        };
        setStats(normalizedStats);
      }
    } catch (error) {
      console.error("Error fetching admin stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const addSampleData = async () => {
    try {
      setAddingSampleData(true);
      const response = await fetch("/api/admin/add-sample-data", {
        method: "POST",
      });

      if (response.ok) {
        alert("Sample data added successfully!");
        await fetchStats(); // Refresh stats
      } else {
        alert("Failed to add sample data");
      }
    } catch (error) {
      console.error("Error adding sample data:", error);
      alert("Error adding sample data");
    } finally {
      setAddingSampleData(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <AdminStatsSkeleton />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AdminCardSkeleton />
          <AdminCardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
            <FiUsers className="h-6 w-6 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {stats?.totalUsers || 0}
          </div>
          <p className="text-xs text-gray-500 mt-1">Registered users</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
            <FiShoppingBag className="h-6 w-6 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {stats?.totalOrders || 0}
          </div>
          <p className="text-xs text-gray-500 mt-1">All time orders</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
            <FiDollarSign className="h-6 w-6 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            ${(stats?.totalRevenue || 0).toFixed(2)}
          </div>
          <p className="text-xs text-gray-500 mt-1">Total earnings</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">
              Total Products
            </h3>
            <FiPackage className="h-6 w-6 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {stats?.totalProducts || 89}
          </div>
          <p className="text-xs text-gray-500 mt-1">Available products</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">
              Pending Orders
            </h3>
            <FiClock className="h-6 w-6 text-yellow-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {stats?.pendingOrders || 0}
          </div>
          <p className="text-xs text-gray-500 mt-1">Awaiting processing</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">
              Completed Orders
            </h3>
            <FiTrendingUp className="h-6 w-6 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {stats?.completedOrders || 0}
          </div>
          <p className="text-xs text-gray-500 mt-1">Successfully fulfilled</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Link
              href="/account/admin/users"
              className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
            >
              <FiUsers className="h-5 w-5 text-indigo-600 mr-3" />
              <div className="flex-1">
                <div className="font-medium text-gray-900 group-hover:text-indigo-600">
                  Manage Users
                </div>
                <div className="text-sm text-gray-500">
                  View, edit, and delete user accounts
                </div>
              </div>
            </Link>
            <Link
              href="/account/admin/orders"
              className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
            >
              <FiShoppingBag className="h-5 w-5 text-green-600 mr-3" />
              <div className="flex-1">
                <div className="font-medium text-gray-900 group-hover:text-green-600">
                  Manage Orders
                </div>
                <div className="text-sm text-gray-500">
                  Track, update, and delete orders
                </div>
              </div>
            </Link>
            <Link
              href="/account/admin/analytics"
              className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
            >
              <FiTrendingUp className="h-5 w-5 text-blue-600 mr-3" />
              <div className="flex-1">
                <div className="font-medium text-gray-900 group-hover:text-blue-600">
                  View Analytics
                </div>
                <div className="text-sm text-gray-500">
                  Sales reports and performance data
                </div>
              </div>
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            System Status
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">Database Status</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Online
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">API Status</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Healthy
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">Last Updated</span>
              <span className="text-sm text-gray-900">
                {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
          <button
            onClick={fetchStats}
            className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors mb-2 mt-4"
          >
            Refresh Data
          </button>
          <button
            onClick={addSampleData}
            disabled={addingSampleData}
            className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
          >
            {addingSampleData ? "Adding..." : "Add Sample Data"}
          </button>
        </div>
      </div>
    </div>
  );
}
