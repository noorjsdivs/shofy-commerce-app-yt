import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase/config";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  arrayUnion,
} from "firebase/firestore";

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();
    const { customerEmail } = orderData;

    if (!customerEmail) {
      return NextResponse.json(
        { error: "Customer email required" },
        { status: 400 }
      );
    }

    // Find the user by email
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", customerEmail));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userDoc = snapshot.docs[0];

    // Generate a unique order ID
    const orderId = `ORD-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)
      .toUpperCase()}`;

    // Create the order object
    const order = {
      id: orderId,
      orderId: orderId,
      ...orderData,
      createdAt: new Date().toISOString(),
    };

    // Add the order to the user's orders array
    await updateDoc(doc(db, "users", userDoc.id), {
      orders: arrayUnion(order),
    });

    return NextResponse.json({
      message: "Order placed successfully",
      success: true,
      orderId: orderId,
      order: order,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    return NextResponse.json(
      { error: "Failed to place order" },
      { status: 500 }
    );
  }
}
