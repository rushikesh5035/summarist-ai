"use client";

import { motion } from "framer-motion";

import { Skeleton } from "@/components/ui/skeleton";

export default function ChatPageSkeleton({
  statusLabel,
}: {
  statusLabel: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex h-full min-h-0 flex-col overflow-hidden"
    >
      {/* File badge skeleton */}
      <div className="mb-4 flex items-center justify-center">
        <Skeleton className="h-7 w-52 rounded-full bg-white/5" />
      </div>

      {/* Status label */}
      <div className="mb-6 flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 rounded-full border border-[#0CF2A0]/20 bg-[#0CF2A0]/5 px-4 py-1.5">
          <motion.span
            className="h-2 w-2 rounded-full bg-[#0CF2A0]"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
          <span className="text-xs font-medium text-[#0CF2A0]">
            {statusLabel}
          </span>
        </div>
      </div>

      {/* Fake message bubbles — assistant */}
      <div className="flex-1 space-y-5 px-1">
        {/* Ghost assistant message 1 */}
        <div className="flex gap-3">
          <Skeleton className="mt-1 h-8 w-8 shrink-0 rounded-md bg-[#0CF2A0]/10" />
          <div className="flex flex-col gap-2 pt-1">
            <Skeleton className="h-4 w-72 rounded-lg bg-white/5" />
            <Skeleton className="h-4 w-56 rounded-lg bg-white/5" />
            <Skeleton className="h-4 w-64 rounded-lg bg-white/5" />
          </div>
        </div>

        {/* Ghost user message */}
        <div className="flex justify-end gap-3">
          <div className="flex flex-col items-end gap-2 pt-1">
            <Skeleton className="h-4 w-48 rounded-lg bg-white/5" />
            <Skeleton className="h-4 w-36 rounded-lg bg-white/5" />
          </div>
          <Skeleton className="mt-1 h-8 w-8 shrink-0 rounded-md bg-white/5" />
        </div>

        {/* Ghost assistant message 2 */}
        <div className="flex gap-3">
          <Skeleton className="mt-1 h-8 w-8 shrink-0 rounded-md bg-[#0CF2A0]/10" />
          <div className="flex flex-col gap-2 pt-1">
            <Skeleton className="h-4 w-80 rounded-lg bg-white/5" />
            <Skeleton className="h-4 w-60 rounded-lg bg-white/5" />
            <Skeleton className="h-4 w-44 rounded-lg bg-white/5" />
            <Skeleton className="h-4 w-52 rounded-lg bg-white/5" />
          </div>
        </div>
      </div>

      {/* Disabled input skeleton */}
      <div className="mt-3 shrink-0">
        <div className="overflow-hidden rounded-2xl border border-gray-700/30 bg-[#1a1a1a]">
          <Skeleton className="mx-4 mt-4 mb-2 h-5 w-48 rounded bg-white/5" />
          <div className="flex items-center justify-between px-3 pb-3">
            <Skeleton className="h-6 w-24 rounded-md bg-white/5" />
            <Skeleton className="h-8 w-8 rounded-xl bg-white/5" />
          </div>
        </div>
        <Skeleton className="mx-auto mt-2 h-3 w-64 rounded bg-white/3" />
      </div>
    </motion.div>
  );
}
