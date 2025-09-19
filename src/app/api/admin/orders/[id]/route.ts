import { NextRequest, NextResponse } from "next/server";
import { hasPermission } from "@/lib/rbac/roles";
import { db } from "@/lib/firebase/config";
import {
  doc,
  updateDoc,
  getDoc,
  deleteDoc,
  collection,
  getDocs,
} from "firebase/firestore";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Add proper authentication and permission checks

    const orderId = params.id;
    const body = await request.json();
    const { userId, updates } = body;

    if (!orderId) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }

    // Try to update order in orders collection first
    try {
      const orderRef = doc(db, "orders", orderId);
      const orderDoc = await getDoc(orderRef);

      if (orderDoc.exists()) {
        await updateDoc(orderRef, {
          ...updates,
          updatedAt: new Date().toISOString(),
        });
        return NextResponse.json({
          success: true,
          updated: "orders_collection",
          orderId,
        });
      }
    } catch (orderError) {
      console.log("Order not found in orders collection, checking user orders");
    }

    // If userId provided, update the order in user's orders array
    if (userId) {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const orders = userData.orders || [];

        const orderIndex = orders.findIndex(
          (order: any) => order.id === orderId
        );
        if (orderIndex !== -1) {
          orders[orderIndex] = {
            ...orders[orderIndex],
            ...updates,
            updatedAt: new Date().toISOString(),
          };

          await updateDoc(userRef, { orders });
          return NextResponse.json({
            success: true,
            updated: "user_orders",
            orderId,
          });
        }
      }
    }

    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Add proper authentication and permission checks

    const orderId = params.id;

    if (!orderId) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }

    let deleted = false;
    const deletedFrom: string[] = [];

    // Try to delete from orders collection first
    try {
      const orderRef = doc(db, "orders", orderId);
      const orderDoc = await getDoc(orderRef);

      if (orderDoc.exists()) {
        await deleteDoc(orderRef);
        deleted = true;
        deletedFrom.push("orders_collection");
      }
    } catch (orderError) {
      console.log("Order not found in orders collection, checking user orders");
    }

    // Search through all users and remove the order from any user's orders array
    const usersRef = collection(db, "users");
    const usersSnapshot = await getDocs(usersRef);

    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      if (userData.orders && Array.isArray(userData.orders)) {
        const originalOrdersLength = userData.orders.length;
        const filteredOrders = userData.orders.filter(
          (order: any) => order.id !== orderId
        );

        // If order was found and removed
        if (filteredOrders.length !== originalOrdersLength) {
          const userRef = doc(db, "users", userDoc.id);
          await updateDoc(userRef, {
            orders: filteredOrders,
            updatedAt: new Date().toISOString(),
          });
          deleted = true;
          deletedFrom.push(`user_orders:${userDoc.id}`);
        }
      }
    }

    if (!deleted) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Order deleted successfully",
      orderId,
      deletedFrom,
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Add proper authentication and permission checks

    const orderId = params.id;

    if (!orderId) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }

    // Try to get order from orders collection first
    try {
      const orderRef = doc(db, "orders", orderId);
      const orderDoc = await getDoc(orderRef);

      if (orderDoc.exists()) {
        return NextResponse.json({
          order: { id: orderDoc.id, ...orderDoc.data() },
          source: "orders_collection",
        });
      }
    } catch (orderError) {
      console.log("Order not found in orders collection, checking user orders");
    }

    // Search in all users' orders
    const usersRef = collection(db, "users");
    const usersSnapshot = await getDocs(usersRef);

    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      if (userData.orders && Array.isArray(userData.orders)) {
        const foundOrder = userData.orders.find(
          (order: any) => order.id === orderId
        );
        if (foundOrder) {
          return NextResponse.json({
            order: foundOrder,
            userId: userDoc.id,
            customerName: userData.name || userData.displayName,
            customerEmail: userData.email,
            source: "user_orders",
          });
        }
      }
    }

    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
