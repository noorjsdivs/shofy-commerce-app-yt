import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase/config";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

export async function POST(request: NextRequest) {
  try {
    const {
      orderId,
      email,
      paymentStatus = "paid",
      status,
    } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    let userDoc;
    let userData;

    if (email) {
      // Find the user by email (for existing flow)
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      userDoc = snapshot.docs[0];
      userData = userDoc.data();
    } else {
      // Find user by searching through all users' orders
      const usersRef = collection(db, "users");
      const usersSnapshot = await getDocs(usersRef);

      let found = false;
      for (const doc of usersSnapshot.docs) {
        const data = doc.data();
        if (data.orders && Array.isArray(data.orders)) {
          const orderExists = data.orders.some(
            (order: any) => order.id === orderId || order.orderId === orderId
          );
          if (orderExists) {
            userDoc = doc;
            userData = data;
            found = true;
            break;
          }
        }
      }

      if (!found) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }
    }

    if (!userDoc || !userData) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Find and update the specific order in the orders array
    if (userData.orders && Array.isArray(userData.orders)) {
      const updatedOrders = userData.orders.map((order: any) => {
        if (order.id === orderId || order.orderId === orderId) {
          return {
            ...order,
            paymentStatus: paymentStatus,
            ...(status && { status }),
            updatedAt: new Date().toISOString(),
          };
        }
        return order;
      });

      // Update the user document with the modified orders array
      await updateDoc(doc(db, "users", userDoc.id), {
        orders: updatedOrders,
      });

      return NextResponse.json({
        message: "Order updated successfully",
        success: true,
      });
    } else {
      return NextResponse.json(
        { error: "No orders found for this user" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
