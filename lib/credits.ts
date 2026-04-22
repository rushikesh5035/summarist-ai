import { hasReachedUploadLimit } from "@/lib/user";

const planNameMap: Record<string, string> = {
  free: "Free",
  pro: "Pro",
  unlimited: "Unlimited",
};

// fetch user credits for a user
export async function fetchUserCredits(clerkId: string, dbUserId: string) {
  const { uploadCount, uploadLimit, chatCount, chatLimit, planId } =
    await hasReachedUploadLimit(clerkId, dbUserId);

  const summaryRemaining = Math.max(0, uploadLimit - uploadCount);
  const chatRemaining = Math.max(0, chatLimit - chatCount);
  const isUnlimited = planId === "unlimited";
  const planName = planNameMap[planId] ?? "Free";

  return {
    planId,
    planName,
    isUnlimited,
    summaryUsed: uploadCount,
    summaryLimit: uploadLimit,
    summaryRemaining,
    chatUsed: chatCount,
    chatLimit,
    chatRemaining,
    // Backward-compatible aliases
    remaining: summaryRemaining,
    uploadLimit,
    uploadCount,
  };
}
