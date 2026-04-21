import { hasReachedUploadLimit } from "@/lib/user";

const planNameMap: Record<string, string> = {
  free: "Free",
  pro: "Pro",
  unlimited: "Unlimited",
};

// fetch user credits for a user
export async function fetchUserCredits(clerkId: string, dbUserId: string) {
  const { uploadCount, uploadLimit, planId } = await hasReachedUploadLimit(
    clerkId,
    dbUserId
  );

  const remaining = Math.max(0, uploadLimit - uploadCount);
  const isUnlimited = planId === "unlimited";
  const planName = planNameMap[planId] ?? "Free";

  return { remaining, uploadLimit, planId, planName, isUnlimited, uploadCount };
}
