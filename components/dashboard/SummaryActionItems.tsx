"use client";

import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";

interface SummaryActionItemsProps {
  actionItems: string[];
  delay?: number;
}

export default function SummaryActionItems({
  actionItems,
  delay = 0.5,
}: SummaryActionItemsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-xl border border-[#0CF2A0]/20 bg-linear-to-br from-[#0CF2A0]/5 to-transparent p-6"
    >
      <div className="mb-4 flex items-center gap-2">
        <Lightbulb className="h-5 w-5 text-[#0CF2A0]" />
        <h2 className="text-lg font-semibold text-white">Action Items</h2>
      </div>
      <ul className="space-y-2">
        {actionItems.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-gray-400">
            <span className="mt-1 text-[#0CF2A0]">→</span>
            {item}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
