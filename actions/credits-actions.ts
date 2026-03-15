"use server";

import { auth } from "@clerk/nextjs/server";

import { getDbUserId, hasReachedUploadLimit } from "@/lib/user";

const planNameMap: Record<string, string> = {
  free: "Free",
  pro: "Pro",
  unlimited: "Unlim",
};

export async function getUserCredits() {
  const { userId } = await auth(); // Clerk ID
  if (!userId) return null;

  const dbUserId = await getDbUserId(userId);
  if (!dbUserId) return null;

  const { uploadCount, uploadLimit, planId } = await hasReachedUploadLimit(
    userId, // clerkId
    dbUserId // DB UUID
  );

  const remaining = Math.max(0, uploadLimit - uploadCount);
  const isUnlimited = planId === "unlimited";
  const planName = planNameMap[planId] ?? "Free";

  return { remaining, uploadLimit, planId, planName, isUnlimited };
}
