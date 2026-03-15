import { User as ClerkUser, currentUser } from "@clerk/nextjs/server";
import { and, count, eq, sql } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { pdfSummaries, subscriptions, users } from "@/db/schema";
import { PLAN_LIMITS, pricingPlans } from "@/utils/constants";

/**
 * Called on every logged-in page
 * Create a minimal user row the 1st time a clerk user signs in.
 */
export const ensureFreeUserExists = async (user: ClerkUser) => {
  try {
    const email = user.emailAddresses[0].emailAddress;
    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.clerkId, user.id));

    if (existing.length === 0) {
      await db.insert(users).values({
        clerkId: user.id,
        email,
      });
    }
  } catch (error) {
    console.error("Error ensuring free user exists:", error);
  }
};

export const getDbUserId = async (clerkId: string): Promise<string | null> => {
  const [user] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.clerkId, clerkId));

  return user?.id ?? null;
};

/**
 * Gets the active subscription for a user
 */
export const getActiveSubscription = async (dbUserId: string) => {
  const [sub] = await db
    .select()
    .from(subscriptions)
    .where(
      and(
        eq(subscriptions.userId, dbUserId),
        eq(subscriptions.status, "active")
      )
    );

  return sub ?? null;
};

/**
 * Returns true if user has a paid, active subscription.
 */
export const hasActivePlan = async (dbUserId: string): Promise<boolean> => {
  const sub = await getActiveSubscription(dbUserId);
  return sub !== null;
};

export const hasReachedUploadLimit = async (
  clerkId: string,
  dbUserId: string
) => {
  // Count summaries this month
  const [result] = await db.select({ count: count() }).from(pdfSummaries)
    .where(sql`
      ${pdfSummaries.userId} = ${dbUserId}
      AND ${pdfSummaries.createdAt} >= date_trunc('month', NOW())
    `);
  const uploadCount = Number(result?.count ?? 0);

  // find plan from active subscription
  const sub = await getActiveSubscription(dbUserId);
  const planId =
    pricingPlans.find((p) => p.priceId === sub?.priceId)?.id ?? "free";

  const limit = PLAN_LIMITS[planId]?.summaries ?? 2;

  return {
    hasReachedLimit: uploadCount >= limit,
    uploadLimit: limit,
    uploadCount,
    planId,
  };
};
