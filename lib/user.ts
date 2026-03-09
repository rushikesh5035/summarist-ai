import { User } from "@clerk/nextjs/server";

import { getDBConnection } from "@/lib/db";
import { getUserUploadCountThisMonth } from "@/lib/summaries";
import { PLAN_LIMITS, pricingPlans } from "@/utils/constants";

export const getPriceIdForActive = async (email: string) => {
  const sql = await getDBConnection();
  const query =
    await sql`SELECT price_id FROM users WHERE email=${email} AND status = 'active'`;

  return query?.[0]?.price_id || null;
};

export const hasActivePlan = async (email: string) => {
  const sql = await getDBConnection();
  const query =
    await sql`SELECT price_id, status FROM users WHERE email=${email} AND status = 'active' AND price_id IS NOT NULL`;

  return query && query.length > 0;
};

export const hasReachedUploadLimit = async (
  userId: string,
  userEmail: string
) => {
  const uploadCount = await getUserUploadCountThisMonth(userId);

  const priceId = await getPriceIdForActive(userEmail);

  const planId =
    pricingPlans.find((plan) => plan.priceId === priceId)?.id ?? "free";

  const limit = PLAN_LIMITS[planId]?.summaries ?? 2;

  return {
    hasReachedLimit: uploadCount >= limit,
    uploadLimit: limit,
    uploadCount,
    planId,
  };
};

export const getSubscriptionStatus = async (user: User) => {
  const hasSubscription = await hasActivePlan(
    user.emailAddresses[0].emailAddress
  );

  return hasSubscription;
};

/**
 * Called on every protected page load.
 * If the user has no row in the DB yet (free sign-up via Clerk),
 * insert one with status='active' and price_id=NULL so their
 * summary history and credit limits work correctly.
 */
export const ensureFreeUserExists = async (user: User) => {
  try {
    const sql = await getDBConnection();
    const email = user.emailAddresses[0].emailAddress;
    const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existing.length === 0) {
      await sql`
        INSERT INTO users (email, full_name, customer_id, price_id, status)
        VALUES (${email}, ${user.fullName ?? ""}, ${null}, ${null}, ${"active"})
      `;
    }
  } catch (error) {
    console.error("Error ensuring free user exists:", error);
  }
};
