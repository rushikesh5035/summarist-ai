"use client";

import { motion } from "framer-motion";

interface SummarySection {
  title: string;
  content: string;
}

interface SummarySectionsProps {
  sections: SummarySection[];
  delay?: number;
}

export default function SummarySections({
  sections,
  delay = 0.3,
}: SummarySectionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="mb-6 space-y-4"
    >
      {sections.map((section, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.05 + i * 0.08 }}
          className="rounded-xl border border-gray-700/60 bg-[#1a1a1a] p-6"
        >
          <h3 className="mb-2 font-semibold text-white">{section.title}</h3>
          <p className="text-sm leading-relaxed text-gray-400">
            {section.content}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
}
