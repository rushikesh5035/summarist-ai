import { eq } from "drizzle-orm";
import Stripe from "stripe";

import { db } from "@/db/drizzle";
import { subscriptions, users } from "@/db/schema";

// Handle Stripe checkout session completion
export const handleCheckoutSessionCompleted = async ({
  session,
  stripe,
}: {
  session: Stripe.Checkout.Session;
  stripe: Stripe;
}) => {
  const customerId = session.customer as string;
  const customer = await stripe.customers.retrieve(customerId);
  const priceId = session.line_items?.data[0].price?.id;

  if ("email" in customer && customer.email && priceId) {
    // 1. find user by email
    const [user] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, customer.email));

    if (!user) {
      console.log("Now user found for email: ", customer.email);
      return;
    }

    // 2. Upsert subscription recors
    const existingSub = await db
      .select({ id: subscriptions.id })
      .from(subscriptions)
      .where(eq(subscriptions.stripeCustomerId, customerId));

    if (existingSub.length === 0) {
      await db.insert(subscriptions).values({
        userId: user.id,
        stripeCustomerId: customerId,
        stripeSubscriptionId: (session.subscription as string) ?? null,
        priceId,
        status: "active",
        updatedAt: new Date(),
      });
    } else {
      await db
        .update(subscriptions)
        .set({
          priceId,
          status: "active",
          updatedAt: new Date(),
        })
        .where(eq(subscriptions.stripeCustomerId, customerId));
    }
  }
};

// Handle Stripe subscription deletion (cancellation)
export const handleSubscriptionDeleted = async ({
  subscriptionId,
  stripe,
}: {
  subscriptionId: string;
  stripe: Stripe;
}) => {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    await db
      .update(subscriptions)
      .set({ status: "cancelled", updatedAt: new Date() })
      .where(
        eq(subscriptions.stripeCustomerId, subscription.customer as string)
      );
  } catch (error) {
    console.error("Error handling subscription deleted", error);
  }
};
