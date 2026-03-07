"use client";

import { motion } from "framer-motion";
import { List } from "lucide-react";

interface SummaryKeyPointsProps {
  keyPoints: string[];
  delay?: number;
}

export default function SummaryKeyPoints({
  keyPoints,
  delay = 0.2,
}: SummaryKeyPointsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="mb-6 rounded-xl border border-gray-700/60 bg-[#1a1a1a] p-6"
    >
      <div className="mb-4 flex items-center gap-2">
        <List className="h-5 w-5 text-[#0CF2A0]" />
        <h2 className="text-lg font-semibold text-white">Key Points</h2>
      </div>
      <ul className="space-y-3">
        {keyPoints.map((point, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.05 + i * 0.05 }}
            className="flex items-start gap-3"
          >
            <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#0CF2A0]/10 text-xs font-bold text-[#0CF2A0]">
              {i + 1}
            </span>
            <span className="text-gray-400">{point}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
