import { pricingPlans } from "@/utils/constants";
import { getDBConnection } from "@/lib/db";
import { getUserUploadCount } from "@/lib/summaries";
import { User } from "@clerk/nextjs/server";

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

export const hasReachedUploadLimit = async (userId: string) => {
  const uploadCount = await getUserUploadCount(userId);

  const priceId = await getPriceIdForActive(userId);

  const isPro =
    pricingPlans.find((plan) => plan.priceId == priceId)?.id === "pro";

  const uploadLimit = isPro ? 1000 : 5;

  return { hasReachedLimit: uploadCount >= uploadLimit, uploadLimit };
};

export const getSubscriptionStatus = async (user: User) => {
  const hasSubscription = await hasActivePlan(
    user.emailAddresses[0].emailAddress
  );

  return hasSubscription;
};
