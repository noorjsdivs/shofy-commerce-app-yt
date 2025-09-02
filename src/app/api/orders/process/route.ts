import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
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

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { sessionId, email } = await request.json();

    if (!sessionId || !email) {
      return NextResponse.json(
        { success: false, error: "Session ID and email are required" },
        { status: 400 }
      );
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "line_items.data.price.product"],
    });

    console.log("Session metadata:", session.metadata);

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { success: false, error: "Payment not completed" },
        { status: 400 }
      );
    }

    // Find user in Firestore first
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    // Check if order already exists to prevent duplicates
    if (userData.orders && Array.isArray(userData.orders)) {
      const existingOrder = userData.orders.find(
        (order: any) => order.id === sessionId
      );
      if (existingOrder) {
        return NextResponse.json({
          success: true,
          message: "Order already processed",
          order: {
            id: existingOrder.orderId,
            amount: existingOrder.amount,
            status: existingOrder.status,
            items: existingOrder.items?.length || 0,
          },
        });
      }
    }

    // Extract order information with enhanced details
    let shippingAddress = null;
    if (session.metadata?.shippingAddress) {
      try {
        shippingAddress = JSON.parse(session.metadata.shippingAddress);
        console.log("Parsed shipping address:", shippingAddress);
      } catch (e) {
        console.warn("Failed to parse shipping address from metadata:", e);
      }
    } else {
      console.warn("No shipping address found in session metadata");
    }

    const orderData = {
      id: sessionId,
      orderId: `ORD-${Date.now()}`,
      amount: session.amount_total
        ? (session.amount_total / 100).toFixed(2)
        : "0.00",
      currency: session.currency || "usd",
      status: "confirmed",
      paymentStatus: session.payment_status,
      paymentMethod: "card",
      customerEmail: session.customer_details?.email || email,
      customerName: session.customer_details?.name || "",
      shippingAddress: shippingAddress,
      billingAddress: session.customer_details?.address || null,
      items:
        session.line_items?.data?.map((item: any) => ({
          id:
            item.price?.product?.metadata?.productId ||
            item.price?.product?.id ||
            "",
          name: item.price?.product?.name || "",
          description: item.price?.product?.description || "",
          images: item.price?.product?.images || [],
          quantity: item.quantity,
          price: item.price?.unit_amount ? item.price.unit_amount / 100 : 0,
          total: item.amount_total ? item.amount_total / 100 : 0,
          category: item.price?.product?.metadata?.category || "",
          originalPrice: item.price?.product?.metadata?.originalPrice || "",
          discountPercentage:
            item.price?.product?.metadata?.discountPercentage || "0",
        })) || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add order to user's orders array
    const userDocRef = doc(db, "users", userDoc.id);
    await updateDoc(userDocRef, {
      orders: arrayUnion(orderData),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Order processed successfully",
      order: {
        id: orderData.orderId,
        amount: orderData.amount,
        status: orderData.status,
        items: orderData.items.length,
      },
    });
  } catch (error) {
    console.error("Order processing error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process order" },
      { status: 500 }
    );
  }
}
