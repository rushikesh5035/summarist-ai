import { cache } from "react";

import { User as ClerkUser, currentUser } from "@clerk/nextjs/server";
import { and, count, eq, sql } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { chatPdfs, pdfSummaries, subscriptions, users } from "@/db/schema";
import { PLAN_LIMITS } from "@/utils/constants";
import {
  POLAR_PRO_PRODUCT_ID,
  POLAR_UNLIMITED_PRODUCT_ID,
} from "@/utils/polar";

// Called on every logged-in page. Create a minimal user row the 1st time a clerk user signs in.
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

// Gets the user id from the database
export const getDbUserId = async (clerkId: string): Promise<string | null> => {
  const [user] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.clerkId, clerkId));

  return user?.id ?? null;
};

// Gets the active subscription for a user.
export const getActiveSubscription = cache(async (dbUserId: string) => {
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
});

// Returns true if user has a paid, active subscription.
export const hasActivePlan = async (dbUserId: string): Promise<boolean> => {
  const sub = await getActiveSubscription(dbUserId);
  return sub !== null;
};

// Resolve plan ID from polar product ID
const resolvePlanId = (polarProductId: string | null | undefined): string => {
  if (!polarProductId) return "free";
  if (polarProductId === POLAR_PRO_PRODUCT_ID) return "pro";
  if (polarProductId === POLAR_UNLIMITED_PRODUCT_ID) return "unlimited";
  return "free";
};

export const hasReachedUploadLimit = async (
  _clerkId: string,
  dbUserId: string
) => {
  // Resolve plan once — shared for both summary and chat checks
  const sub = await getActiveSubscription(dbUserId);
  const planId = resolvePlanId(sub?.polarProductId);

  // Count PDF summaries uploaded this month
  const [summaryResult] = await db.select({ count: count() }).from(pdfSummaries)
    .where(sql`
      ${pdfSummaries.userId} = ${dbUserId}
      AND ${pdfSummaries.createdAt} >= date_trunc('month', NOW())
    `);
  const uploadCount = Number(summaryResult?.count ?? 0);
  const uploadLimit = PLAN_LIMITS[planId]?.summaries ?? 2;

  // Count chat PDFs created this month
  const [chatResult] = await db.select({ count: count() }).from(chatPdfs)
    .where(sql`
      ${chatPdfs.userId} = ${dbUserId}
      AND ${chatPdfs.createdAt} >= date_trunc('month', NOW())
    `);
  const chatCount = Number(chatResult?.count ?? 0);
  const chatLimit = PLAN_LIMITS[planId]?.chats ?? 2;

  return {
    hasReachedLimit: uploadCount >= uploadLimit,
    uploadLimit,
    uploadCount,
    planId,
    chatCount,
    chatLimit,
    hasReachedChatLimit: chatCount >= chatLimit,
  };
};
