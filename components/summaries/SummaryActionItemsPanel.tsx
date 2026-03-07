"use client";

import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";

interface SummaryActionItemsPanelProps {
  actionItems: string[];
}

export default function SummaryActionItemsPanel({
  actionItems,
}: SummaryActionItemsPanelProps) {
  if (!actionItems.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="rounded-xl border border-[#0CF2A0]/20 bg-gradient-to-br from-[#0CF2A0]/5 to-transparent p-6"
    >
      <div className="mb-4 flex items-center gap-2">
        <Lightbulb className="h-5 w-5 text-[#0CF2A0]" />
        <h2 className="text-lg font-semibold text-white">Key Takeaways</h2>
      </div>
      <ul className="space-y-2">
        {actionItems.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-gray-400">
            <span className="mt-1 flex-shrink-0 text-[#0CF2A0]">→</span>
            {item}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
