"use client";

import { motion } from "motion/react";

import { VaultItem } from "@/lib/summaries";

import EmptyState from "./EmptyState";
import VaultCard from "./VaultCard";

export default function VaultPageClient({
  vaultItems,
}: {
  vaultItems: VaultItem[];
}) {
  return (
    <main className="mx-auto mt-20 max-w-5xl px-6 pt-8 pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mb-10"
      >
        <h1 className="text-3xl font-bold tracking-tight text-white">
          My Vault
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Your secure space for all processed documents & conversations
        </p>
      </motion.div>

      {vaultItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <EmptyState />
        </motion.div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {vaultItems.map((item, index) => (
            <VaultCard
              key={`${item.type}-${item.id}`}
              item={item}
              animationIndex={index}
            />
          ))}
        </div>
      )}
    </main>
  );
}
