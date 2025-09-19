import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const POST = async (request: NextRequest) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  return NextResponse.json({
    message: "Checkout session created successfully!",
    success: true,
  });
};
