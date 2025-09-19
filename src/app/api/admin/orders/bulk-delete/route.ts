import { NextRequest, NextResponse } from "next/server";
import { hasPermission } from "@/lib/rbac/roles";
import { db } from "@/lib/firebase/config";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";

export async function DELETE(request: NextRequest) {
  try {
    // TODO: Add proper authentication and permission checks

    const { orderIds } = await request.json();

    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return NextResponse.json(
        { error: "Order IDs array required" },
        { status: 400 }
      );
    }

    // Use batch delete for better performance
    const batch = writeBatch(db);

    // Delete orders from the orders collection
    for (const orderId of orderIds) {
      const orderRef = doc(db, "orders", orderId);
      batch.delete(orderRef);
    }

    // Also need to remove these orders from user documents
    // First find all users who might have these orders
    const usersRef = collection(db, "users");
    const usersSnapshot = await getDocs(usersRef);

    usersSnapshot.docs.forEach((userDoc) => {
      const userData = userDoc.data();
      if (userData.orders && Array.isArray(userData.orders)) {
        const filteredOrders = userData.orders.filter(
          (order: any) => !orderIds.includes(order.id)
        );

        if (filteredOrders.length !== userData.orders.length) {
          // This user had some of the deleted orders
          const userRef = doc(db, "users", userDoc.id);
          batch.update(userRef, { orders: filteredOrders });
        }
      }
    });

    // Commit the batch
    await batch.commit();

    return NextResponse.json({
      success: true,
      deletedCount: orderIds.length,
    });
  } catch (error) {
    console.error("Error bulk deleting orders:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
