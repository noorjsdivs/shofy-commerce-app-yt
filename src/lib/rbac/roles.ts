// Role-based access control types and utilities

export type UserRole =
  | "user"
  | "admin"
  | "deliveryman"
  | "packer"
  | "accountant";

export interface RolePermissions {
  // Order management
  canViewOrders: boolean;
  canCreateOrders: boolean;
  canUpdateOrders: boolean;
  canDeleteOrders: boolean;
  canChangeOrderStatus: boolean;

  // Product management
  canViewProducts: boolean;
  canCreateProducts: boolean;
  canUpdateProducts: boolean;
  canDeleteProducts: boolean;

  // User management
  canViewUsers: boolean;
  canCreateUsers: boolean;
  canUpdateUsers: boolean;
  canDeleteUsers: boolean;
  canChangeUserRoles: boolean; // Dashboard access
  canAccessAdminDashboard: boolean;
  canAccessDeliveryDashboard: boolean;
  canAccessPackerDashboard: boolean;
  canAccessUserDashboard: boolean;
  canAccessAccountantDashboard: boolean;

  // Specific actions
  canManageInventory: boolean;
  canViewAnalytics: boolean;
  canManageSettings: boolean;
  canProcessPayments: boolean;
  canManageShipping: boolean;
  canViewFinancials: boolean;
  canManageAccounts: boolean;
  canGenerateReports: boolean;
  canViewTransactions: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  admin: {
    // Full access to everything
    canViewOrders: true,
    canCreateOrders: true,
    canUpdateOrders: true,
    canDeleteOrders: true,
    canChangeOrderStatus: true,
    canViewProducts: true,
    canCreateProducts: true,
    canUpdateProducts: true,
    canDeleteProducts: true,
    canViewUsers: true,
    canCreateUsers: true,
    canUpdateUsers: true,
    canDeleteUsers: true,
    canChangeUserRoles: true,
    canAccessAdminDashboard: true,
    canAccessDeliveryDashboard: true,
    canAccessPackerDashboard: true,
    canAccessUserDashboard: true,
    canAccessAccountantDashboard: true,
    canManageInventory: true,
    canViewAnalytics: true,
    canManageSettings: true,
    canProcessPayments: true,
    canManageShipping: true,
    canViewFinancials: true,
    canManageAccounts: true,
    canGenerateReports: true,
    canViewTransactions: true,
  },
  deliveryman: {
    // Delivery-specific permissions
    canViewOrders: true,
    canCreateOrders: false,
    canUpdateOrders: true, // Can update delivery status
    canDeleteOrders: false,
    canChangeOrderStatus: true, // Can change to delivered, out for delivery, etc.
    canViewProducts: true,
    canCreateProducts: false,
    canUpdateProducts: false,
    canDeleteProducts: false,
    canViewUsers: false,
    canCreateUsers: false,
    canUpdateUsers: false,
    canDeleteUsers: false,
    canChangeUserRoles: false,
    canAccessAdminDashboard: false,
    canAccessDeliveryDashboard: true,
    canAccessPackerDashboard: false,
    canAccessUserDashboard: true,
    canAccessAccountantDashboard: false,
    canManageInventory: false,
    canViewAnalytics: false,
    canManageSettings: false,
    canProcessPayments: false,
    canManageShipping: true,
    canViewFinancials: false,
    canManageAccounts: false,
    canGenerateReports: false,
    canViewTransactions: false,
  },
  packer: {
    // Packer-specific permissions
    canViewOrders: true,
    canCreateOrders: false,
    canUpdateOrders: true, // Can update packing status
    canDeleteOrders: false,
    canChangeOrderStatus: true, // Can change to packed, ready for shipping, etc.
    canViewProducts: true,
    canCreateProducts: false,
    canUpdateProducts: false,
    canDeleteProducts: false,
    canViewUsers: false,
    canCreateUsers: false,
    canUpdateUsers: false,
    canDeleteUsers: false,
    canChangeUserRoles: false,
    canAccessAdminDashboard: false,
    canAccessDeliveryDashboard: false,
    canAccessPackerDashboard: true,
    canAccessUserDashboard: true,
    canAccessAccountantDashboard: false,
    canManageInventory: true, // Can manage stock for packing
    canViewAnalytics: false,
    canManageSettings: false,
    canProcessPayments: false,
    canManageShipping: false,
    canViewFinancials: false,
    canManageAccounts: false,
    canGenerateReports: false,
    canViewTransactions: false,
  },
  user: {
    // Regular user permissions
    canViewOrders: true, // Own orders only
    canCreateOrders: true,
    canUpdateOrders: false,
    canDeleteOrders: false,
    canChangeOrderStatus: false,
    canViewProducts: true,
    canCreateProducts: false,
    canUpdateProducts: false,
    canDeleteProducts: false,
    canViewUsers: false,
    canCreateUsers: false,
    canUpdateUsers: false, // Can update own profile
    canDeleteUsers: false,
    canChangeUserRoles: false,
    canAccessAdminDashboard: false,
    canAccessDeliveryDashboard: false,
    canAccessPackerDashboard: false,
    canAccessUserDashboard: true,
    canAccessAccountantDashboard: false,
    canManageInventory: false,
    canViewAnalytics: false,
    canManageSettings: false,
    canProcessPayments: false,
    canManageShipping: false,
    canViewFinancials: false,
    canManageAccounts: false,
    canGenerateReports: false,
    canViewTransactions: false,
  },
  accountant: {
    // Accountant-specific permissions
    canViewOrders: true, // For financial tracking
    canCreateOrders: false,
    canUpdateOrders: false,
    canDeleteOrders: false,
    canChangeOrderStatus: false,
    canViewProducts: true, // For pricing and cost analysis
    canCreateProducts: false,
    canUpdateProducts: false,
    canDeleteProducts: false,
    canViewUsers: true, // For customer account management
    canCreateUsers: false,
    canUpdateUsers: false,
    canDeleteUsers: false,
    canChangeUserRoles: false,
    canAccessAdminDashboard: false,
    canAccessDeliveryDashboard: false,
    canAccessPackerDashboard: false,
    canAccessUserDashboard: true,
    canAccessAccountantDashboard: true,
    canManageInventory: false,
    canViewAnalytics: true, // Financial analytics
    canManageSettings: false,
    canProcessPayments: true,
    canManageShipping: false,
    canViewFinancials: true,
    canManageAccounts: true,
    canGenerateReports: true,
    canViewTransactions: true,
  },
};

export const ORDER_STATUSES = {
  // General statuses
  PENDING: "pending",
  CONFIRMED: "confirmed",
  CANCELLED: "cancelled",

  // Packer statuses
  PROCESSING: "processing",
  PACKED: "packed",
  READY_FOR_SHIPPING: "ready_for_shipping",

  // Deliveryman statuses
  OUT_FOR_DELIVERY: "out_for_delivery",
  DELIVERED: "delivered",
  DELIVERY_FAILED: "delivery_failed",
  RETURNED: "returned",
} as const;

export type OrderStatus = (typeof ORDER_STATUSES)[keyof typeof ORDER_STATUSES];

// Status transitions allowed by each role
export const ROLE_STATUS_TRANSITIONS: Record<UserRole, OrderStatus[]> = {
  admin: Object.values(ORDER_STATUSES), // Can change to any status
  packer: [
    ORDER_STATUSES.PROCESSING,
    ORDER_STATUSES.PACKED,
    ORDER_STATUSES.READY_FOR_SHIPPING,
  ],
  deliveryman: [
    ORDER_STATUSES.OUT_FOR_DELIVERY,
    ORDER_STATUSES.DELIVERED,
    ORDER_STATUSES.DELIVERY_FAILED,
    ORDER_STATUSES.RETURNED,
  ],
  user: [], // Users cannot change order status
  accountant: [], // Accountants cannot change order status (view only)
};

// Utility functions
export function hasPermission(
  userRole: UserRole,
  permission: keyof RolePermissions
): boolean {
  return ROLE_PERMISSIONS[userRole][permission];
}

export function canAccessDashboard(
  userRole: UserRole,
  dashboardType: "admin" | "delivery" | "packer" | "accountant" | "user"
): boolean {
  const permissionMap = {
    admin: "canAccessAdminDashboard",
    delivery: "canAccessDeliveryDashboard",
    packer: "canAccessPackerDashboard",
    accountant: "canAccessAccountantDashboard",
    user: "canAccessUserDashboard",
  } as const;

  return hasPermission(userRole, permissionMap[dashboardType]);
}

export function canChangeOrderStatus(
  userRole: UserRole,
  fromStatus: OrderStatus,
  toStatus: OrderStatus
): boolean {
  if (!hasPermission(userRole, "canChangeOrderStatus")) {
    return false;
  }

  const allowedStatuses = ROLE_STATUS_TRANSITIONS[userRole];
  return allowedStatuses.includes(toStatus);
}

export function getRoleDisplayName(role: UserRole): string {
  const displayNames = {
    admin: "Administrator",
    deliveryman: "Delivery Person",
    packer: "Packer",
    user: "Customer",
    accountant: "Accountant",
  };

  return displayNames[role];
}

export function getRoleBadgeColor(role: UserRole): string {
  const colors = {
    admin: "bg-red-100 text-red-800",
    deliveryman: "bg-blue-100 text-blue-800",
    packer: "bg-green-100 text-green-800",
    user: "bg-gray-100 text-gray-800",
    accountant: "bg-purple-100 text-purple-800",
  };

  return colors[role];
}

// Utility to redirect users to appropriate dashboard based on role
export function getDefaultDashboardRoute(role: UserRole): string {
  switch (role) {
    case "admin":
      return "/admin";
    case "deliveryman":
      return "/delivery";
    case "packer":
      return "/packer";
    case "accountant":
      return "/accountant";
    case "user":
    default:
      return "/account";
  }
}
