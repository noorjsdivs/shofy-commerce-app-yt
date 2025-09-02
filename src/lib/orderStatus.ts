// Order Status Management System
export const ORDER_STATUSES = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  PACKED: "packed",
  OUT_FOR_DELIVERY: "out_for_delivery",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
} as const;

export const PAYMENT_STATUSES = {
  PENDING: "pending",
  PAID: "paid",
  FAILED: "failed",
  REFUNDED: "refunded",
} as const;

export const PAYMENT_METHODS = {
  ONLINE: "online",
  CASH: "cash",
} as const;

export type OrderStatus = (typeof ORDER_STATUSES)[keyof typeof ORDER_STATUSES];
export type PaymentStatus =
  (typeof PAYMENT_STATUSES)[keyof typeof PAYMENT_STATUSES];
export type PaymentMethod =
  (typeof PAYMENT_METHODS)[keyof typeof PAYMENT_METHODS];

// Role-based order visibility
export const getVisibleOrderStatuses = (userRole: string) => {
  switch (userRole) {
    case "admin":
      return Object.values(ORDER_STATUSES); // Admin can see all orders
    case "packer":
      return [
        ORDER_STATUSES.PENDING,
        ORDER_STATUSES.CONFIRMED,
        ORDER_STATUSES.PACKED,
      ];
    case "deliveryman":
      return [
        ORDER_STATUSES.PACKED,
        ORDER_STATUSES.OUT_FOR_DELIVERY,
        ORDER_STATUSES.DELIVERED,
      ];
    case "account":
      return Object.values(ORDER_STATUSES); // Accountant can see all for financial tracking
    default:
      return []; // Regular users don't access admin order management
  }
};

// Role-based status update permissions
export const canUpdateOrderStatus = (
  userRole: string,
  currentStatus: OrderStatus,
  newStatus: OrderStatus
): boolean => {
  switch (userRole) {
    case "admin":
      // Admin can update any status to any status
      return true;

    case "packer":
      // Packer can: pending -> confirmed, confirmed -> packed
      return (
        (currentStatus === ORDER_STATUSES.PENDING &&
          newStatus === ORDER_STATUSES.CONFIRMED) ||
        (currentStatus === ORDER_STATUSES.CONFIRMED &&
          newStatus === ORDER_STATUSES.PACKED)
      );

    case "deliveryman":
      // Deliveryman can: packed -> out_for_delivery, out_for_delivery -> delivered
      return (
        (currentStatus === ORDER_STATUSES.PACKED &&
          newStatus === ORDER_STATUSES.OUT_FOR_DELIVERY) ||
        (currentStatus === ORDER_STATUSES.OUT_FOR_DELIVERY &&
          newStatus === ORDER_STATUSES.DELIVERED)
      );

    case "account":
      // Accountant can only cancel orders for financial reasons
      return newStatus === ORDER_STATUSES.CANCELLED;

    default:
      return false;
  }
};

// Role-based payment status update permissions
export const canUpdatePaymentStatus = (
  userRole: string,
  paymentMethod: PaymentMethod,
  currentPaymentStatus: PaymentStatus,
  newPaymentStatus: PaymentStatus
): boolean => {
  switch (userRole) {
    case "admin":
      // Admin can update any payment status
      return true;

    case "deliveryman":
      // Deliveryman can only mark cash payments as paid upon delivery
      return (
        paymentMethod === PAYMENT_METHODS.CASH &&
        currentPaymentStatus === PAYMENT_STATUSES.PENDING &&
        newPaymentStatus === PAYMENT_STATUSES.PAID
      );

    case "account":
      // Accountant can manage all payment statuses
      return true;

    default:
      return false;
  }
};

// Get next possible statuses for a role
export const getNextPossibleStatuses = (
  userRole: string,
  currentStatus: OrderStatus
): OrderStatus[] => {
  const possibleStatuses: OrderStatus[] = [];

  Object.values(ORDER_STATUSES).forEach((status) => {
    if (
      canUpdateOrderStatus(userRole, currentStatus, status) &&
      status !== currentStatus
    ) {
      possibleStatuses.push(status);
    }
  });

  return possibleStatuses;
};

// Get status display information
export const getStatusDisplayInfo = (status: OrderStatus) => {
  switch (status) {
    case ORDER_STATUSES.PENDING:
      return {
        label: "Pending",
        color: "bg-yellow-100 text-yellow-800",
        icon: "⏳",
        description: "Order placed, awaiting confirmation",
      };
    case ORDER_STATUSES.CONFIRMED:
      return {
        label: "Confirmed",
        color: "bg-blue-100 text-blue-800",
        icon: "✅",
        description: "Order confirmed, ready for packing",
      };
    case ORDER_STATUSES.PACKED:
      return {
        label: "Packed",
        color: "bg-purple-100 text-purple-800",
        icon: "📦",
        description: "Order packed, ready for delivery",
      };
    case ORDER_STATUSES.OUT_FOR_DELIVERY:
      return {
        label: "Out for Delivery",
        color: "bg-indigo-100 text-indigo-800",
        icon: "🚚",
        description: "Order out for delivery",
      };
    case ORDER_STATUSES.DELIVERED:
      return {
        label: "Delivered",
        color: "bg-green-100 text-green-800",
        icon: "✅",
        description: "Order successfully delivered",
      };
    case ORDER_STATUSES.CANCELLED:
      return {
        label: "Cancelled",
        color: "bg-red-100 text-red-800",
        icon: "❌",
        description: "Order cancelled",
      };
    default:
      return {
        label: "Unknown",
        color: "bg-gray-100 text-gray-800",
        icon: "❓",
        description: "Unknown status",
      };
  }
};

// Get payment status display information
export const getPaymentStatusDisplayInfo = (
  status: PaymentStatus,
  method: PaymentMethod
) => {
  switch (status) {
    case PAYMENT_STATUSES.PENDING:
      return {
        label:
          method === PAYMENT_METHODS.CASH
            ? "Cash on Delivery"
            : "Payment Pending",
        color: "bg-yellow-100 text-yellow-800",
        icon: method === PAYMENT_METHODS.CASH ? "💵" : "⏳",
      };
    case PAYMENT_STATUSES.PAID:
      return {
        label: "Paid",
        color: "bg-green-100 text-green-800",
        icon: "✅",
      };
    case PAYMENT_STATUSES.FAILED:
      return {
        label: "Payment Failed",
        color: "bg-red-100 text-red-800",
        icon: "❌",
      };
    case PAYMENT_STATUSES.REFUNDED:
      return {
        label: "Refunded",
        color: "bg-gray-100 text-gray-800",
        icon: "↩️",
      };
    default:
      return {
        label: "Unknown",
        color: "bg-gray-100 text-gray-800",
        icon: "❓",
      };
  }
};

// Validate status transition
export const isValidStatusTransition = (
  currentStatus: OrderStatus,
  newStatus: OrderStatus
): boolean => {
  const validTransitions: Record<OrderStatus, OrderStatus[]> = {
    [ORDER_STATUSES.PENDING]: [
      ORDER_STATUSES.CONFIRMED,
      ORDER_STATUSES.CANCELLED,
    ],
    [ORDER_STATUSES.CONFIRMED]: [
      ORDER_STATUSES.PACKED,
      ORDER_STATUSES.CANCELLED,
    ],
    [ORDER_STATUSES.PACKED]: [
      ORDER_STATUSES.OUT_FOR_DELIVERY,
      ORDER_STATUSES.CANCELLED,
    ],
    [ORDER_STATUSES.OUT_FOR_DELIVERY]: [
      ORDER_STATUSES.DELIVERED,
      ORDER_STATUSES.CANCELLED,
    ],
    [ORDER_STATUSES.DELIVERED]: [], // Final status
    [ORDER_STATUSES.CANCELLED]: [], // Final status
  };

  return validTransitions[currentStatus]?.includes(newStatus) || false;
};
