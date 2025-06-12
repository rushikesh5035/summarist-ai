import {
  handleCheckoutSessionCompleted,
  handleSubscriptionDeleted,
} from "@/lib/payments";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!);

export const POST = async (req: NextRequest) => {
  const payload = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event;
  const endpointSecret = process.env.NEXT_PUBLIC_STRIPE_WEBHOOK_SECRET!;

  try {
    event = stripe.webhooks.constructEvent(payload, signature!, endpointSecret);

    switch (event.type) {
      case "checkout.session.completed":
        console.log("checkout session completed");
        const sessionId = event.data.object.id;

        const session = await stripe.checkout.sessions.retrieve(sessionId, {
          expand: ["line_items"],
        });

        await handleCheckoutSessionCompleted({ session, stripe });
        break;

      case "customer.subscription.deleted":
        console.log("customer subscription deleted");
        const subscription = event.data.object;
        const subscriptionId = event.data.object.id;

        await handleSubscriptionDeleted({ subscriptionId, stripe });
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Failed to trigger webhooks", err },
      { status: 400 }
    );
  }

  return NextResponse.json({
    status: "success",
  });
};
