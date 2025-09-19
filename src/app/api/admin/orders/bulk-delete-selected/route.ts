import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase/config";
import {
  doc,
  deleteDoc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
} from "firebase/firestore";

export async function DELETE(request: NextRequest) {
  try {
    // TODO: Add proper authentication and permission checks

    const { orderIds } = await request.json();

    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return NextResponse.json(
        { error: "Order IDs array is required" },
        { status: 400 }
      );
    }

    const results = {
      deleted: [] as string[],
      notFound: [] as string[],
      errors: [] as { orderId: string; error: string }[],
    };

    for (const orderId of orderIds) {
      try {
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
          console.log(
            `Order ${orderId} not found in orders collection, checking user orders`
          );
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

        if (deleted) {
          results.deleted.push(orderId);
        } else {
          results.notFound.push(orderId);
        }
      } catch (error) {
        console.error(`Error deleting order ${orderId}:`, error);
        results.errors.push({
          orderId,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Deleted ${results.deleted.length} orders successfully`,
      results,
    });
  } catch (error) {
    console.error("Error in bulk delete selected orders:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
