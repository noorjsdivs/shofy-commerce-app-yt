import { NextRequest, NextResponse } from "next/server";

import {
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  PAYMENT_METHODS,
  getVisibleOrderStatuses,
  canUpdateOrderStatus,
  canUpdatePaymentStatus,
  isValidStatusTransition,
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
} from "@/lib/orderStatus";
import { hasPermission } from "@/lib/rbac/permissions";
import { db } from "@/lib/firebase/config";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { auth } from "../../../../auth";

// GET - Fetch orders based on user role
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user role
    const userDoc = await getDoc(doc(db, "users", session.user.email));
    if (!userDoc.exists()) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = userDoc.data();
    const userRole = userData.role || "user";

    // Check if user has permission to view orders
    if (!hasPermission(userRole, "orders", "read")) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const visibleStatuses = getVisibleOrderStatuses(userRole);
    if (visibleStatuses.length === 0) {
      return NextResponse.json({ orders: [] });
    }

    // Build query based on role
    let ordersQuery;

    if (userRole === "admin" || userRole === "account") {
      // Admin and accountant can see all orders
      ordersQuery = query(
        collection(db, "orders"),
        orderBy("createdAt", "desc")
      );
    } else {
      // Role-based filtering
      ordersQuery = query(
        collection(db, "orders"),
        where("status", "in", visibleStatuses),
        orderBy("createdAt", "desc")
      );
    }

    const ordersSnapshot = await getDocs(ordersQuery);
    const orders = ordersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt:
        doc.data().createdAt?.toDate?.()?.toISOString() ||
        new Date().toISOString(),
      updatedAt:
        doc.data().updatedAt?.toDate?.()?.toISOString() ||
        new Date().toISOString(),
    }));

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// PUT - Update order status
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId, status, paymentStatus, deliveryNotes } =
      await request.json();

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Get user role
    const userDoc = await getDoc(doc(db, "users", session.user.email));
    if (!userDoc.exists()) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = userDoc.data();
    const userRole = userData.role || "user";

    // Check if user has permission to update orders
    if (!hasPermission(userRole, "orders", "update")) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    // Get current order
    const orderRef = doc(db, "orders", orderId);
    const orderDoc = await getDoc(orderRef);

    if (!orderDoc.exists()) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const currentOrder = orderDoc.data();
    const currentStatus = currentOrder.status as OrderStatus;
    const currentPaymentStatus = currentOrder.paymentStatus as PaymentStatus;
    const paymentMethod = currentOrder.paymentMethod as PaymentMethod;

    const updateData: any = {
      updatedAt: serverTimestamp(),
      updatedBy: session.user.email,
    };

    // Handle order status update
    if (status && status !== currentStatus) {
      // Validate status transition
      if (!isValidStatusTransition(currentStatus, status)) {
        return NextResponse.json(
          {
            error: `Invalid status transition from ${currentStatus} to ${status}`,
          },
          { status: 400 }
        );
      }

      // Check role permissions for status update
      if (!canUpdateOrderStatus(userRole, currentStatus, status)) {
        return NextResponse.json(
          {
            error: `You don't have permission to change status from ${currentStatus} to ${status}`,
          },
          { status: 403 }
        );
      }

      updateData.status = status;

      // Add status history
      const statusHistory = currentOrder.statusHistory || [];
      statusHistory.push({
        status,
        timestamp: new Date().toISOString(),
        updatedBy: session.user.email,
        userRole,
        notes: deliveryNotes || `Status changed to ${status}`,
      });
      updateData.statusHistory = statusHistory;
    }

    // Handle payment status update
    if (paymentStatus && paymentStatus !== currentPaymentStatus) {
      // Check role permissions for payment status update
      if (
        !canUpdatePaymentStatus(
          userRole,
          paymentMethod,
          currentPaymentStatus,
          paymentStatus
        )
      ) {
        return NextResponse.json(
          {
            error: `You don't have permission to update payment status for ${paymentMethod} payments`,
          },
          { status: 403 }
        );
      }

      updateData.paymentStatus = paymentStatus;

      // Add payment history
      const paymentHistory = currentOrder.paymentHistory || [];
      paymentHistory.push({
        status: paymentStatus,
        timestamp: new Date().toISOString(),
        updatedBy: session.user.email,
        userRole,
        method: paymentMethod,
        notes: deliveryNotes || `Payment status changed to ${paymentStatus}`,
      });
      updateData.paymentHistory = paymentHistory;
    }

    // Add delivery notes if provided
    if (deliveryNotes) {
      const notes = currentOrder.deliveryNotes || [];
      notes.push({
        note: deliveryNotes,
        timestamp: new Date().toISOString(),
        addedBy: session.user.email,
        userRole,
      });
      updateData.deliveryNotes = notes;
    }

    // Update the order
    await updateDoc(orderRef, updateData);

    // Also update user's order subcollection if it exists
    try {
      if (currentOrder.userEmail) {
        const userOrderRef = doc(
          db,
          "users",
          currentOrder.userEmail,
          "orders",
          orderId
        );
        await updateDoc(userOrderRef, updateData);
      }
    } catch (error) {
      console.log("User order subcollection not found, skipping update");
    }

    return NextResponse.json({
      success: true,
      message: "Order updated successfully",
      orderId,
      updates: updateData,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}

// POST - Create new order (from checkout)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orderData = await request.json();

    // Create order with initial status
    const newOrder = {
      ...orderData,
      status: ORDER_STATUSES.PENDING,
      paymentStatus:
        orderData.paymentMethod === PAYMENT_METHODS.CASH
          ? PAYMENT_STATUSES.PENDING
          : PAYMENT_STATUSES.PAID,
      userEmail: session.user.email,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      statusHistory: [
        {
          status: ORDER_STATUSES.PENDING,
          timestamp: new Date().toISOString(),
          updatedBy: session.user.email,
          userRole: "user",
          notes: "Order placed",
        },
      ],
      paymentHistory: [
        {
          status:
            orderData.paymentMethod === PAYMENT_METHODS.CASH
              ? PAYMENT_STATUSES.PENDING
              : PAYMENT_STATUSES.PAID,
          timestamp: new Date().toISOString(),
          updatedBy: session.user.email,
          userRole: "user",
          method: orderData.paymentMethod || PAYMENT_METHODS.ONLINE,
          notes: `Order created with ${
            orderData.paymentMethod || "online"
          } payment`,
        },
      ],
    };

    // Add to orders collection
    const orderRef = doc(collection(db, "orders"));
    await updateDoc(orderRef, newOrder);

    // Add to user's orders subcollection
    const userOrderRef = doc(
      db,
      "users",
      session.user.email,
      "orders",
      orderRef.id
    );
    await updateDoc(userOrderRef, newOrder);

    return NextResponse.json({
      success: true,
      orderId: orderRef.id,
      message: "Order created successfully",
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
