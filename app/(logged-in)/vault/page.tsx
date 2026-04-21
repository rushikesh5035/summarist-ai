import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { currentUser } from "@clerk/nextjs/server";

import VaultPageClient from "@/components/vault/VaultPageClient";
import { getVaultItems } from "@/lib/summaries";
import { ensureFreeUserExists, getDbUserId } from "@/lib/user";

export const metadata: Metadata = {
  title: "My Vault",
  description: "View all your saved PDF summaries and chat history",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function HistoryPage() {
  const user = await currentUser();
  if (!user?.id) return redirect("/sign-in");

  // Get user from DB (webhook should have created it)
  let dbUserId = await getDbUserId(user.id);

  // Fallback: Create user if webhook missed it (for existing users or webhook failures)
  if (!dbUserId) {
    console.warn(
      "[Vault] User not found in DB, creating via fallback:",
      user.id
    );
    await ensureFreeUserExists(user);
    dbUserId = await getDbUserId(user.id);
    if (!dbUserId) return redirect("/sign-in");
  }

  const vaultItems = await getVaultItems(dbUserId);

  return <VaultPageClient vaultItems={vaultItems} />;
}
