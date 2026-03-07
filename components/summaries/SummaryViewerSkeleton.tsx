"use client";

import { motion } from "framer-motion";

import { Skeleton } from "@/components/ui/skeleton";

export default function SummaryViewerSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* ── Heading ── */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          {/* Back button */}
          <Skeleton className="mb-6 h-8 w-36 rounded-md bg-white/5" />

          {/* "Summary Generated" badge */}
          <div className="mb-2 flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-full bg-[#0CF2A0]/15" />
            <Skeleton className="h-4 w-36 rounded bg-[#0CF2A0]/15" />
          </div>

          {/* Title */}
          <Skeleton className="mb-3 h-8 w-3/4 rounded-lg bg-white/8" />

          {/* Metadata row */}
          <div className="flex flex-wrap items-center gap-3">
            <Skeleton className="h-4 w-20 rounded bg-white/5" />
            <Skeleton className="h-4 w-28 rounded bg-white/5" />
            <Skeleton className="h-4 w-20 rounded bg-white/5" />
          </div>
        </div>

        {/* Copy / Export buttons */}
        <div className="flex shrink-0 gap-2">
          <Skeleton className="h-9 w-20 rounded-md bg-white/5" />
          <Skeleton className="h-9 w-24 rounded-md bg-white/5" />
        </div>
      </div>

      {/* ── Overview Panel ── */}
      <div className="mb-6 rounded-xl border border-gray-700/60 bg-[#1a1a1a] p-6">
        <div className="mb-3 flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded bg-[#0CF2A0]/15" />
          <Skeleton className="h-5 w-20 rounded bg-white/8" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full rounded bg-white/5" />
          <Skeleton className="h-4 w-[92%] rounded bg-white/5" />
          <Skeleton className="h-4 w-[85%] rounded bg-white/5" />
          <Skeleton className="h-4 w-[78%] rounded bg-white/5" />
        </div>
      </div>

      {/* ── Key Points Panel ── */}
      <div className="mb-6 rounded-xl border border-gray-700/60 bg-[#1a1a1a] p-6">
        <div className="mb-4 flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded bg-[#0CF2A0]/15" />
          <Skeleton className="h-5 w-24 rounded bg-white/8" />
        </div>
        <ul className="space-y-3">
          {[100, 92, 85, 70, 60].map((width, i) => (
            <li key={i} className="flex items-start gap-3">
              <Skeleton className="mt-0.5 h-6 w-6 shrink-0 rounded-full bg-[#0CF2A0]/15" />
              <Skeleton
                className="h-5 rounded bg-white/5"
                style={{ width: `${width}%` }}
              />
            </li>
          ))}
        </ul>
      </div>

      {/* ── Detailed Sections ── */}
      <div className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded bg-[#0CF2A0]/15" />
            <Skeleton className="h-5 w-36 rounded bg-white/8" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20 rounded-md bg-white/5" />
            <Skeleton className="h-6 w-24 rounded-md bg-white/5" />
          </div>
        </div>

        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl border border-gray-700/60"
            >
              <div className="flex items-center justify-between p-5">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-7 w-7 rounded-md bg-[#0CF2A0]/15" />
                  <Skeleton
                    className="h-5 rounded bg-white/8"
                    style={{ width: `${180 - i * 20}px` }}
                  />
                </div>
                <Skeleton className="h-4 w-4 rounded bg-white/5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Key Takeaways Panel ── */}
      <div className="rounded-xl border border-[#0CF2A0]/15 bg-linear-to-br from-[#0CF2A0]/5 to-transparent p-6">
        <div className="mb-4 flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded bg-[#0CF2A0]/15" />
          <Skeleton className="h-5 w-28 rounded bg-white/8" />
        </div>
        <ul className="space-y-2">
          {[95, 80, 68].map((width, i) => (
            <li key={i} className="flex items-start gap-3">
              <Skeleton className="mt-1 h-4 w-4 shrink-0 rounded bg-[#0CF2A0]/15" />
              <Skeleton
                className="h-4 rounded bg-white/5"
                style={{ width: `${width}%` }}
              />
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
