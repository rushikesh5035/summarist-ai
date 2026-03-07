"use client";

import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

interface SummaryOverviewProps {
  overview: string;
  delay?: number;
}

export default function SummaryOverview({
  overview,
  delay = 0.1,
}: SummaryOverviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="mb-6 rounded-xl border border-gray-700/60 bg-[#1a1a1a] p-6"
    >
      <div className="mb-3 flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-[#0CF2A0]" />
        <h2 className="text-lg font-semibold text-white">Overview</h2>
      </div>
      <p className="leading-relaxed text-gray-400">{overview}</p>
    </motion.div>
  );
}
