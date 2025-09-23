import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import {
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  PAYMENT_METHODS,
} from "@/lib/orderStatus";
import { db } from "@/lib/firebase/config";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";

export const POST = async (request: NextRequest) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  try {
    const reqBody = await request.json();
    const { items, email, shippingAddress, orderId, orderAmount } = reqBody;

    // Always use individual items for better display in Stripe checkout
    // Only use orderAmount as fallback if items are missing or invalid
    const extractingItems =
      items && items.length > 0
        ? items.map((item: any) => {
            const itemPrice =
              item.price ||
              (item.total ? item.total / (item.quantity || 1) : 0);
            const unitAmount = Math.round(itemPrice * 100);

            return {
              quantity: item?.quantity || 1,
              price_data: {
                currency: "usd",
                unit_amount: unitAmount,
                product_data: {
                  name: item?.title || item?.name || "Product",
                  description:
                    item?.description ||
                    `Order item: ${item?.name || item?.title || "Product"}`,
                  images:
                    item?.images && item?.images.length > 0
                      ? [item.images[0]]
                      : [],
                  metadata: {
                    productId: item?.id?.toString() || "",
                    originalPrice: item?.price?.toString() || "",
                    discountPercentage:
                      item?.discountPercentage?.toString() || "0",
                    category: item?.category || "",
                    orderId: orderId || "",
                  },
                },
              },
            };
          })
        : orderAmount
        ? [
            {
              quantity: 1,
              price_data: {
                currency: "usd",
                unit_amount: Math.round(parseFloat(orderAmount) * 100),
                product_data: {
                  name: `Order #${orderId}`,
                  description: `Payment for existing order`,
                  metadata: {
                    orderId: orderId || "",
                    isExistingOrder: "true",
                  },
                },
              },
            },
          ]
        : [];

    // Validate line items
    if (!extractingItems || extractingItems.length === 0) {
      throw new Error("No valid line items found");
    }

    // Validate each line item
    for (const item of extractingItems) {
      if (
        !item.price_data ||
        !item.price_data.unit_amount ||
        item.price_data.unit_amount <= 0
      ) {
        throw new Error(
          `Invalid price for item: ${item.price_data?.product_data?.name}`
        );
      }
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: extractingItems,
      mode: "payment",
      success_url: `${
        process.env.NEXTAUTH_URL
      }/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId || ""}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/checkout${
        orderId ? `?orderId=${orderId}&cancelled=true` : "?cancelled=true"
      }`,
      metadata: {
        email,
        orderDate: new Date().toISOString(),
        itemCount: items && items.length > 0 ? items.length.toString() : "1",
        shippingAddress: shippingAddress ? JSON.stringify(shippingAddress) : "",
        orderId: orderId || "",
        orderAmount: orderAmount || "",
      },
      customer_email: email,
    });

    // Create or update the order in the database
    const orderRef = doc(collection(db, "orders"));
    await setDoc(orderRef, {
      email,
      items: extractingItems.map((item: any) => ({
        productId: item.price_data.product_data.metadata.productId,
        title: item.price_data.product_data.name,
        quantity: item.quantity,
        price: item.price_data.unit_amount / 100, // Convert back to original price
        image: item.price_data.product_data.images?.[0] || "",
      })),
      total:
        orderAmount ||
        Math.round(
          extractingItems.reduce(
            (sum: number, item: any) =>
              sum + (item.price_data.unit_amount || 0) * (item.quantity || 1),
            0
          ) / 100
        ),
      shippingAddress,
      orderId: orderId || orderRef.id, // Use provided orderId or generated id
      status: ORDER_STATUSES.PENDING,
      paymentStatus: PAYMENT_STATUSES.PENDING,
      paymentMethod: PAYMENT_METHODS.ONLINE,
      userEmail: email,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      statusHistory: [
        {
          status: ORDER_STATUSES.PENDING,
          timestamp: new Date().toISOString(),
          updatedBy: email,
          userRole: "user",
          notes: "Order placed via online payment",
        },
      ],
      paymentHistory: [
        {
          status: PAYMENT_STATUSES.PENDING,
          timestamp: new Date().toISOString(),
          updatedBy: email,
          userRole: "user",
          method: PAYMENT_METHODS.ONLINE,
          notes: "Stripe checkout session created",
        },
      ],
    });

    return NextResponse.json({
      message: "Checkout session created successfully!",
      success: true,
      id: session?.id,
    });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
};
