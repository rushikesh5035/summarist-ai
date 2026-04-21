"use server";

import { auth, currentUser } from "@clerk/nextjs/server";

import { fetchUserCredits } from "@/lib/credits";
import { ensureFreeUserExists, getDbUserId } from "@/lib/user";

export async function getUserCredits() {
  const { userId } = await auth();
  if (!userId) return null;

  let dbUserId = await getDbUserId(userId);

  if (!dbUserId) {
    const user = await currentUser();
    if (user) {
      await ensureFreeUserExists(user);
      dbUserId = await getDbUserId(userId);
    }
  }

  if (!dbUserId) return null;

  return fetchUserCredits(userId, dbUserId);
}
