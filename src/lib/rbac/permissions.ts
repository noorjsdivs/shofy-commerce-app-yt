// Role-based access control constants and utilities

export const USER_ROLES = {
  ADMIN: "admin",
  ACCOUNT: "account",
  PACKER: "packer",
  DELIVERYMAN: "deliveryman",
  USER: "user",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export function getDefaultPageForRole(role: UserRole): string {
  switch (role) {
    case USER_ROLES.ADMIN:
      return "/admin";
    case USER_ROLES.ACCOUNT:
      return "/account-dashboard";
    case USER_ROLES.PACKER:
      return "/packer-dashboard";
    case USER_ROLES.DELIVERYMAN:
      return "/delivery-dashboard";
    case USER_ROLES.USER:
    default:
      return "/account";
  }
}

// Additional utility functions for user role checking
import { FirestoreUser } from "@/lib/firebase/userService";

export function hasRole(user: FirestoreUser | null, role: string): boolean {
  return user?.role === role;
}

export function hasAnyRole(
  user: FirestoreUser | null,
  roles: string[]
): boolean {
  return user ? roles.includes(user.role) : false;
}

export function isAdminUser(user: FirestoreUser | null): boolean {
  return hasRole(user, USER_ROLES.ADMIN);
}

export function canAccessAdminPanel(user: FirestoreUser | null): boolean {
  return hasAnyRole(user, [USER_ROLES.ADMIN, USER_ROLES.ACCOUNT]);
}

export function canManageOrders(user: FirestoreUser | null): boolean {
  return hasAnyRole(user, [
    USER_ROLES.ADMIN,
    USER_ROLES.ACCOUNT,
    USER_ROLES.PACKER,
  ]);
}

export function canAccessDelivery(user: FirestoreUser | null): boolean {
  return hasAnyRole(user, [
    USER_ROLES.ADMIN,
    USER_ROLES.DELIVERYMAN,
    USER_ROLES.ACCOUNT,
  ]);
}

export function getUserDisplayRole(user: FirestoreUser | null): string {
  if (!user) return "Guest";

  const roleDisplayMap: Record<string, string> = {
    [USER_ROLES.ADMIN]: "Administrator",
    [USER_ROLES.ACCOUNT]: "Account Manager",
    [USER_ROLES.PACKER]: "Packer",
    [USER_ROLES.DELIVERYMAN]: "Delivery Personnel",
    [USER_ROLES.USER]: "Customer",
  };

  return roleDisplayMap[user.role] || user.role;
}

export const ROLE_PERMISSIONS = {
  [USER_ROLES.ADMIN]: {
    orders: {
      read: true,
      create: true,
      update: true,
      delete: true,
      bulkDelete: true,
    },
    users: {
      read: true,
      create: true,
      update: true,
      delete: true,
    },
    payments: {
      read: true,
      update: true,
    },
    analytics: {
      read: true,
    },
    products: {
      read: true,
      create: true,
      update: true,
      delete: true,
    },
    dashboard: "admin",
  },
  [USER_ROLES.ACCOUNT]: {
    orders: {
      read: true,
      create: false,
      update: false,
      delete: false,
      bulkDelete: false,
    },
    payments: {
      read: true,
      update: true,
    },
    analytics: {
      read: true,
    },
    accounting: {
      read: true,
      create: true,
      update: true,
    },
    dashboard: "account",
  },
  [USER_ROLES.PACKER]: {
    orders: {
      read: true,
      create: false,
      update: true, // Can update packing status
      delete: false,
      bulkDelete: false,
    },
    packing: {
      read: true,
      update: true,
    },
    dashboard: "packer",
  },
  [USER_ROLES.DELIVERYMAN]: {
    orders: {
      read: true,
      create: false,
      update: true, // Can update delivery status
      delete: false,
      bulkDelete: false,
    },
    delivery: {
      read: true,
      update: true,
    },
    dashboard: "deliveryman",
  },
  [USER_ROLES.USER]: {
    orders: {
      read: true, // Only own orders
      create: true,
      update: false,
      delete: false,
      bulkDelete: false,
    },
    dashboard: "user",
  },
};

export const ROLE_LABELS = {
  [USER_ROLES.ADMIN]: "Administrator",
  [USER_ROLES.ACCOUNT]: "Accountant",
  [USER_ROLES.PACKER]: "Packer",
  [USER_ROLES.DELIVERYMAN]: "Delivery Person",
  [USER_ROLES.USER]: "Customer",
};

export const ROLE_COLORS = {
  [USER_ROLES.ADMIN]: "bg-red-100 text-red-800",
  [USER_ROLES.ACCOUNT]: "bg-blue-100 text-blue-800",
  [USER_ROLES.PACKER]: "bg-yellow-100 text-yellow-800",
  [USER_ROLES.DELIVERYMAN]: "bg-green-100 text-green-800",
  [USER_ROLES.USER]: "bg-gray-100 text-gray-800",
};

export const ORDER_STATUSES = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  PROCESSING: "processing",
  PACKED: "packed",
  SHIPPED: "shipped",
  OUT_FOR_DELIVERY: "out_for_delivery",
  DELIVERED: "delivered",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export const PAYMENT_STATUSES = {
  PENDING: "pending",
  PAID: "paid",
  FAILED: "failed",
  REFUNDED: "refunded",
  PARTIAL: "partial",
} as const;

// Helper functions
export function hasPermission(
  userRole: UserRole,
  resource: string,
  action: string
): boolean {
  const rolePermissions = ROLE_PERMISSIONS[userRole];
  if (!rolePermissions) return false;

  const resourcePermissions =
    rolePermissions[resource as keyof typeof rolePermissions];
  if (typeof resourcePermissions === "object" && resourcePermissions !== null) {
    return (
      resourcePermissions[action as keyof typeof resourcePermissions] === true
    );
  }

  return false;
}

export function canUpdateOrderStatus(
  userRole: UserRole,
  currentStatus: string,
  newStatus: string
): boolean {
  switch (userRole) {
    case USER_ROLES.ADMIN:
      return true; // Admin can update any status

    case USER_ROLES.PACKER:
      // Packer can mark orders as packed
      return (
        currentStatus === ORDER_STATUSES.PROCESSING &&
        newStatus === ORDER_STATUSES.PACKED
      );

    case USER_ROLES.DELIVERYMAN:
      // Delivery person can update shipping and delivery statuses
      return (
        (currentStatus === ORDER_STATUSES.PACKED &&
          newStatus === ORDER_STATUSES.SHIPPED) ||
        (currentStatus === ORDER_STATUSES.SHIPPED &&
          newStatus === ORDER_STATUSES.OUT_FOR_DELIVERY) ||
        (currentStatus === ORDER_STATUSES.OUT_FOR_DELIVERY &&
          newStatus === ORDER_STATUSES.DELIVERED)
      );

    case USER_ROLES.ACCOUNT:
      // Account can mark orders as completed after payment confirmation
      return (
        currentStatus === ORDER_STATUSES.DELIVERED &&
        newStatus === ORDER_STATUSES.COMPLETED
      );

    default:
      return false;
  }
}

export function getAvailableStatusUpdates(
  userRole: UserRole,
  currentStatus: string
): string[] {
  switch (userRole) {
    case USER_ROLES.ADMIN:
      return Object.values(ORDER_STATUSES);

    case USER_ROLES.PACKER:
      if (currentStatus === ORDER_STATUSES.PROCESSING) {
        return [ORDER_STATUSES.PACKED];
      }
      return [];

    case USER_ROLES.DELIVERYMAN:
      if (currentStatus === ORDER_STATUSES.PACKED) {
        return [ORDER_STATUSES.SHIPPED];
      }
      if (currentStatus === ORDER_STATUSES.SHIPPED) {
        return [ORDER_STATUSES.OUT_FOR_DELIVERY];
      }
      if (currentStatus === ORDER_STATUSES.OUT_FOR_DELIVERY) {
        return [ORDER_STATUSES.DELIVERED];
      }
      return [];

    case USER_ROLES.ACCOUNT:
      if (currentStatus === ORDER_STATUSES.DELIVERED) {
        return [ORDER_STATUSES.COMPLETED];
      }
      return [];

    default:
      return [];
  }
}

export function getDashboardRoute(userRole: UserRole): string {
  switch (userRole) {
    case USER_ROLES.ADMIN:
      return "/admin";
    case USER_ROLES.ACCOUNT:
      return "/account-dashboard";
    case USER_ROLES.PACKER:
      return "/packer-dashboard";
    case USER_ROLES.DELIVERYMAN:
      return "/delivery-dashboard";
    case USER_ROLES.USER:
    default:
      return "/account";
  }
}
