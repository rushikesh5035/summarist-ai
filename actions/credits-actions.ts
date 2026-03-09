"use server";

import { auth, currentUser } from "@clerk/nextjs/server";

import { hasReachedUploadLimit } from "@/lib/user";

const planNameMap: Record<string, string> = {
  free: "Free",
  pro: "Pro",
  unlimited: "Unlim",
};

export async function getUserCredits() {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await currentUser();
  if (!user) return null;

  const email = user.emailAddresses[0].emailAddress;

  const { uploadCount, uploadLimit, planId } = await hasReachedUploadLimit(
    userId,
    email
  );

  const remaining = Math.max(0, uploadLimit - uploadCount);
  const isUnlimited = planId === "unlimited";
  const planName = planNameMap[planId] ?? "Free";

  return { remaining, uploadLimit, planId, planName, isUnlimited };
}
