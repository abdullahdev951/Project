import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { getUserIdFromRequest } from "@/lib/auth";

const PLANS = {
  pro: {
    name: "Pro Plan",
    price: 1200,
    interval: "month" as const,
  },
  business: {
    name: "Business Plan",
    price: 3900,
    interval: "month" as const,
  },
};

export async function POST(req: NextRequest) {
  try {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      return NextResponse.json({ error: "Stripe is not configured" }, { status: 500 });
    }

    const { default: Stripe } = await import("stripe");
    const stripe = new Stripe(key, { apiVersion: "2026-02-25.clover" });

    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: "Please login first" }, { status: 401 });
    }

    const { plan } = await req.json();
    if (!plan || !PLANS[plan as keyof typeof PLANS]) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const selectedPlan = PLANS[plan as keyof typeof PLANS];

    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId: user._id.toString() },
      });
      customerId = customer.id;
      user.stripeCustomerId = customerId;
      await user.save();
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: selectedPlan.name },
            recurring: { interval: selectedPlan.interval },
            unit_amount: selectedPlan.price,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      metadata: { userId: user._id.toString(), plan },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Payment processing failed" },
      { status: 500 }
    );
  }
}
