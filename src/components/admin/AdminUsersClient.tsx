"use client";

import { useState, useEffect } from "react";
import { AdminTableSkeleton } from "./AdminSkeletons";
import { USER_ROLES } from "@/lib/rbac/permissions";
import { toast } from "react-hot-toast";
import {
  FiEdit2,
  FiTrash2,
  FiSave,
  FiX,
  FiUser,
  FiMail,
  FiCalendar,
  FiShield,
  FiUserCheck,
} from "react-icons/fi";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  orders?: number;
  totalSpent?: number;
}

export default function AdminUsersClient() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", role: "" });
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setEditForm({
      name: user.name || "",
      email: user.email || "",
      role: user.role || "user",
    });
    setShowEditModal(true);
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;

    try {
      const response = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: editingUser.id,
          ...editForm,
        }),
      });

      if (response.ok) {
        toast.success(`User ${editForm.name} updated successfully`);
        await fetchUsers(); // Refresh the data
        setEditingUser(null);
        setEditForm({ name: "", email: "", role: "" });
        setShowEditModal(false);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        toast.success("User deleted successfully");
        await fetchUsers(); // Refresh the data
        setShowDeleteModal(false);
        setUserToDelete(null);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  const confirmDeleteUser = (user: User) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case USER_ROLES.ADMIN:
        return "Administrator";
      case USER_ROLES.ACCOUNT:
        return "Accountant";
      case USER_ROLES.PACKER:
        return "Packer";
      case USER_ROLES.DELIVERYMAN:
        return "Delivery Person";
      case USER_ROLES.USER:
      default:
        return "User";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case USER_ROLES.ADMIN:
        return "bg-red-100 text-red-800";
      case USER_ROLES.ACCOUNT:
        return "bg-blue-100 text-blue-800";
      case USER_ROLES.PACKER:
        return "bg-yellow-100 text-yellow-800";
      case USER_ROLES.DELIVERYMAN:
        return "bg-purple-100 text-purple-800";
      case USER_ROLES.USER:
      default:
        return "bg-green-100 text-green-800";
    }
  };

  if (loading) {
    return <AdminTableSkeleton rows={5} />;
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center mb-4 sm:mb-0">
            <FiShield className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600 mr-2" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Users Management
            </h2>
            <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              {users.length} users
            </span>
          </div>
          <div className="text-sm text-gray-600">
            <FiUserCheck className="inline h-4 w-4 mr-1" />
            <span className="hidden sm:inline">
              Role assignment & user management
            </span>
            <span className="sm:hidden">Manage users</span>
          </div>
        </div>
      </div>

      {/* Mobile-friendly table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Orders
              </th>
              <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Spent
              </th>
              <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 sm:px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
                      {user.name ? (
                        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <span className="text-xs sm:text-sm font-medium text-indigo-800">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      ) : (
                        <FiUser className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
                      )}
                    </div>
                    <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {user.name || "No Name"}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500 flex items-center truncate">
                        <FiMail className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      {/* Mobile role display */}
                      <div className="sm:hidden mt-1">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(
                            user.role
                          )}`}
                        >
                          {getRoleDisplayName(user.role)}
                        </span>
                      </div>
                      {/* Mobile stats */}
                      <div className="md:hidden mt-1 text-xs text-gray-500">
                        {user.orders || 0} orders • $
                        {(user.totalSpent || 0).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="hidden sm:table-cell px-6 py-4">
                  <div className="flex items-center">
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getRoleColor(
                        user.role
                      )}`}
                    >
                      {getRoleDisplayName(user.role)}
                    </span>
                  </div>
                </td>
                <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.orders || 0} orders
                </td>
                <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${(user.totalSpent || 0).toFixed(2)}
                </td>
                <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <FiCalendar className="h-4 w-4 mr-1" />
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "N/A"}
                  </div>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="inline-flex items-center justify-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                      title="Edit User"
                    >
                      <FiEdit2 size={14} className="mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => confirmDeleteUser(user)}
                      className="inline-flex items-center justify-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                      title="Delete User"
                    >
                      <FiTrash2 size={14} className="mr-1" />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && !loading && (
        <div className="px-6 py-12 text-center">
          <FiUser className="mx-auto h-12 w-12 text-gray-400" />
          <p className="text-gray-500 mt-4">No users found</p>
          <p className="text-sm text-gray-400 mt-2">
            Users will appear here once they register
          </p>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div
          className="fixed inset-0 bg-black/50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowEditModal(false);
              setEditingUser(null);
              setEditForm({ name: "", email: "", role: "" });
            }
          }}
        >
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50">
              <div className="flex items-center">
                <FiEdit2 className="h-6 w-6 text-indigo-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">
                  Edit User Details
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingUser(null);
                  setEditForm({ name: "", email: "", role: "" });
                }}
                className="text-gray-400 hover:text-gray-600 focus:outline-none p-1 rounded-full hover:bg-gray-100 transition-colors"
                title="Close modal"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* User Avatar Section */}
              <div className="flex flex-col items-center">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold text-white">
                    {editForm.name
                      ? editForm.name.charAt(0).toUpperCase()
                      : editingUser.name
                      ? editingUser.name.charAt(0).toUpperCase()
                      : "U"}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  User ID: {editingUser.id}
                </p>
              </div>

              {/* Personal Information Section */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                  <FiUser className="h-4 w-4 mr-2 text-gray-600" />
                  Personal Information
                </h4>

                <div className="space-y-4">
                  {/* Name Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        placeholder="Enter full name"
                        required
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) =>
                          setEditForm({ ...editForm, email: e.target.value })
                        }
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        placeholder="Enter email address"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      This will be the user&apos;s login email
                    </p>
                  </div>
                </div>
              </div>

              {/* Role & Permissions Section */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                  <FiShield className="h-4 w-4 mr-2 text-amber-600" />
                  Role & Permissions
                </h4>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    User Role <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiShield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <select
                      value={editForm.role}
                      onChange={(e) =>
                        setEditForm({ ...editForm, role: e.target.value })
                      }
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition-colors"
                      required
                    >
                      <option value={USER_ROLES.USER}>
                        👤 User - Basic customer access
                      </option>
                      <option value={USER_ROLES.PACKER}>
                        📦 Packer - Order fulfillment
                      </option>
                      <option value={USER_ROLES.DELIVERYMAN}>
                        🚚 Delivery Person - Shipping & delivery
                      </option>
                      <option value={USER_ROLES.ACCOUNT}>
                        💰 Accountant - Financial management
                      </option>
                      <option value={USER_ROLES.ADMIN}>
                        ⚡ Administrator - Full system access
                      </option>
                    </select>
                  </div>
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-xs text-blue-800">
                      <strong>Current:</strong>{" "}
                      {getRoleDisplayName(editingUser.role)} →
                      <strong> New:</strong> {getRoleDisplayName(editForm.role)}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      User will be notified of role changes via email
                    </p>
                  </div>
                </div>
              </div>

              {/* User Statistics Section */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                  <FiUserCheck className="h-4 w-4 mr-2 text-green-600" />
                  Account Statistics
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-white rounded-lg border border-green-100">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Total Orders
                    </p>
                    <p className="text-xl font-bold text-gray-900">
                      {editingUser.orders || 0}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg border border-green-100">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Total Spent
                    </p>
                    <p className="text-xl font-bold text-green-600">
                      ${(editingUser.totalSpent || 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg border border-green-100">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Member Since
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {editingUser.createdAt
                        ? new Date(editingUser.createdAt).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg border border-green-100">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Current Role
                    </p>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(
                        editingUser.role
                      )}`}
                    >
                      {getRoleDisplayName(editingUser.role)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0 px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={handleSaveUser}
                disabled={!editForm.name.trim() || !editForm.email.trim()}
                className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <FiSave className="mr-2 h-4 w-4" />
                Save Changes
              </button>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingUser(null);
                  setEditForm({ name: "", email: "", role: "" });
                }}
                className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-sm"
              >
                <FiX className="mr-2 h-4 w-4" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && userToDelete && (
        <div
          className="fixed inset-0 bg-black/50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowDeleteModal(false);
              setUserToDelete(null);
            }
          }}
        >
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Delete User</h3>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setUserToDelete(null);
                }}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                  <FiTrash2 className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">
                    Are you sure?
                  </h4>
                  <p className="text-sm text-gray-500">
                    This action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    {userToDelete.name ? (
                      <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-red-800">
                          {userToDelete.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    ) : (
                      <FiUser className="h-10 w-10 text-red-400" />
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-red-900">
                      {userToDelete.name || "No Name"}
                    </div>
                    <div className="text-sm text-red-700">
                      {userToDelete.email}
                    </div>
                    <div className="text-xs text-red-600 mt-1">
                      Role: {getRoleDisplayName(userToDelete.role)} •
                      {userToDelete.orders || 0} orders • $
                      {(userToDelete.totalSpent || 0).toFixed(2)} spent
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600">
                Deleting this user will permanently remove their account, order
                history, and all associated data. This action cannot be undone.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0 px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => handleDeleteUser(userToDelete.id)}
                className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                <FiTrash2 className="mr-2 h-4 w-4" />
                Delete User
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setUserToDelete(null);
                }}
                className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <FiX className="mr-2 h-4 w-4" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
