"use server";

import { auth, currentUser } from "@clerk/nextjs/server";

import {
  ensureFreeUserExists,
  getDbUserId,
  hasReachedUploadLimit,
} from "@/lib/user";

const planNameMap: Record<string, string> = {
  free: "Free",
  pro: "Pro",
  unlimited: "Unlim",
};

export async function getUserCredits() {
  const { userId } = await auth(); // Clerk ID
  if (!userId) return null;

  // Get user from DB (webhook should have created it)
  let dbUserId = await getDbUserId(userId);

  // Fallback: Create user if webhook missed it (for existing users or webhook failures)
  if (!dbUserId) {
    console.warn(
      "[Credits] User not found in DB, creating via fallback:",
      userId
    );
    const user = await currentUser();
    if (user) {
      await ensureFreeUserExists(user);
      dbUserId = await getDbUserId(userId);
    }
  }

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
