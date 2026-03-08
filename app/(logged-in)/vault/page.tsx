import { redirect } from "next/navigation";

import { currentUser } from "@clerk/nextjs/server";

import EmptyState from "@/components/vault/EmptyState";
import { getSummaries } from "@/lib/summaries";

import VaultCard from "../../../components/vault/VaultCard";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function HistoryPage() {
  const user = await currentUser();
  if (!user?.id) return redirect("/sign-in");

  console.log(user.id);

  const summaries = await getSummaries(user.id);

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

      {summaries.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {summaries.map((summary: any) => (
            <VaultCard key={summary.id} summary={summary} />
          ))}
        </div>
      )}
    </main>
  );
}
