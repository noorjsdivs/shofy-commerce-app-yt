import { UserRole, OrderStatus } from "@/lib/rbac/roles";

type Review = {
  reviewerName: string;
  rating: number;
  comment: string;
  reviewerEmail: string;
};
export interface ProductType {
  availabilityStatus: string;
  brand: string;
  category: string;
  description: string;
  dimensions: {
    depth: number;
    height: number;
    width: number;
  };
  discountPercentage: number;
  id: number;
  images: string[];
  meta: {
    createdAt: string;
    updatedAt: string;
    barcode: string;
    qrCode: string;
  };
  minimumOrderQuantity: number;
  price: number;
  rating: number;
  returnPolicy: string;
  reviews: Review[];
  shippingInformation: string;
  sku: string;
  stock: number;
  tags: string[];
  thumbnail: string;
  title: string;
  warrantyInformation: string;
  weight: number;
  quantity?: number;
}

export interface StateType {
  shopy: {
    cart: ProductType[];
    favorite: ProductType[];
    userInfo: any;
  };
}

export interface Address {
  id?: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  emailVerified: boolean;
  provider?: string;
  profile: {
    firstName: string;
    lastName: string;
    phone: string;
    addresses: Address[];
  };
  preferences: {
    newsletter: boolean;
    notifications: boolean;
  };
  cart: ProductType[];
  wishlist: ProductType[];
  orders: OrderData[];
}

export interface OrderData {
  id: string;
  userId: string;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: Address;
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  trackingNumber?: string;
  assignedDeliveryman?: string;
  assignedPacker?: string;
  statusHistory: OrderStatusHistory[];
  createdAt: string;
  updatedAt: string;
  deliveryDate?: string;
  packedAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  notes?: string;
}

export interface OrderItem {
  productId: number;
  title: string;
  price: number;
  quantity: number;
  thumbnail: string;
  sku: string;
}

export interface OrderStatusHistory {
  status: OrderStatus;
  changedBy: string;
  changedByRole: UserRole;
  timestamp: string;
  notes?: string;
}
