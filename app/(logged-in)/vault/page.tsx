import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { currentUser } from "@clerk/nextjs/server";

import EmptyState from "@/components/vault/EmptyState";
import { getVaultItems } from "@/lib/summaries";
import { ensureFreeUserExists, getDbUserId } from "@/lib/user";

import VaultCard from "../../../components/vault/VaultCard";

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

  return (
    <main className="mx-auto mt-20 max-w-5xl px-6 pt-8 pb-20">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          My Vault
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Your secure space for all processed documents & conversations
        </p>
      </div>

      {vaultItems.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {vaultItems.map((item) => (
            <VaultCard key={`${item.type}-${item.id}`} item={item} />
          ))}
        </div>
      )}
    </main>
  );
}
