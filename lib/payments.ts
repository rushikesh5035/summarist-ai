import { Polar } from "@polar-sh/sdk";
import { eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { subscriptions, users } from "@/db/schema";
import { POLAR_ACCESS_TOKEN, POLAR_SERVER } from "@/utils/polar";

interface PolarSubscriptionPayload {
  data: {
    id: string;
    customerId: string | null;
    productId: string | null;
    status: string;
    currentPeriodEnd: string | null;
    customer?: {
      externalId?: string | null;
      email?: string | null;
    };
  };
}

// Get Polar Customer ID for a given Clerk user
export const getPolarCustomerId = async (
  clerkId: string
): Promise<string | null> => {
  const [user] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.clerkId, clerkId));

  if (!user) return null;

  const [sub] = await db
    .select({ polarCustomerId: subscriptions.polarCustomerId })
    .from(subscriptions)
    .where(eq(subscriptions.userId, user.id));

  return sub?.polarCustomerId ?? null;
};

// Handle subscription activation (new or reactivated)
export const handleSubscriptionActive = async (
  payload: PolarSubscriptionPayload
) => {
  const { id, customerId, productId, currentPeriodEnd } = payload.data;

  const clerkId = payload.data.customer?.externalId;
  const email = payload.data.customer?.email;

  // Find DB user by Clerk firs, fall back to email
  let dbUser = clerkId
    ? await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.clerkId, clerkId))
        .then((rows) => rows[0])
    : null;

  if (!dbUser && email) {
    dbUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .then((rows) => rows[0]);
  }

  if (!dbUser) {
    console.error("[Polar] No user found for customer:", payload.data.customer);
    return;
  }

  // Upsert subscription record based on Polar subscription ID
  const [existingSub] = await db
    .select({ id: subscriptions.id })
    .from(subscriptions)
    .where(eq(subscriptions.polarSubscriptionId, id));

  if (!existingSub) {
    await db.insert(subscriptions).values({
      userId: dbUser.id,
      polarCustomerId: customerId,
      polarSubscriptionId: id,
      polarProductId: productId,
      status: "active",
      currentPeriodEnd: currentPeriodEnd ? new Date(currentPeriodEnd) : null,
      updatedAt: new Date(),
    });
    return;
  }

  await db
    .update(subscriptions)
    .set({
      polarCustomerId: customerId,
      polarProductId: productId,
      status: "active",
      currentPeriodEnd: currentPeriodEnd ? new Date(currentPeriodEnd) : null,
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.polarSubscriptionId, id));
};

// Handle subscription updates (plan changes, renewals)
export const handleSubscriptionUpdated = async (
  payload: PolarSubscriptionPayload
) => {
  const { id, productId, status, currentPeriodEnd } = payload.data;

  await db
    .update(subscriptions)
    .set({
      polarProductId: productId,
      status: status === "active" ? "active" : status,
      currentPeriodEnd: currentPeriodEnd ? new Date(currentPeriodEnd) : null,
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.polarSubscriptionId, id));
};

// Hnandle subscription cancellation / revocation
export const handleSubscriptionCanceled = async (
  payload: PolarSubscriptionPayload
) => {
  const { id } = payload.data;

  await db
    .update(subscriptions)
    .set({ status: "cancelled", updatedAt: new Date() })
    .where(eq(subscriptions.polarSubscriptionId, id));
};
