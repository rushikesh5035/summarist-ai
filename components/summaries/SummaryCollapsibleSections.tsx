"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp, Sparkles } from "lucide-react";

interface Section {
  title: string;
  points: string[];
}

interface SummaryCollapsibleSectionsProps {
  sections: Section[];
  expandedSections: Set<number>;
  onToggle: (index: number) => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
}

export default function SummaryCollapsibleSections({
  sections,
  expandedSections,
  onToggle,
  onExpandAll,
  onCollapseAll,
}: SummaryCollapsibleSectionsProps) {
  if (!sections.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mb-6"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
          <Sparkles className="h-5 w-5 text-[#0CF2A0]" /> Detailed Sections
        </h2>
        <div className="flex gap-2">
          <button
            onClick={onExpandAll}
            className="rounded-md bg-white/5 px-2 py-1 text-xs text-gray-500 transition-colors hover:text-[#0CF2A0]"
          >
            Expand all
          </button>
          <button
            onClick={onCollapseAll}
            className="rounded-md bg-white/5 px-2 py-1 text-xs text-gray-500 transition-colors hover:text-[#0CF2A0]"
          >
            Collapse all
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {sections.map((section, i) => {
          const isExpanded = expandedSections.has(i);
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + i * 0.06 }}
              className="overflow-hidden rounded-xl border border-gray-700/60 bg-transparent"
            >
              <button
                onClick={() => onToggle(i)}
                className="flex w-full items-center justify-between bg-transparent px-5 py-3 text-left transition-colors hover:bg-white/2"
              >
                <div className="flex items-center gap-3 bg-transparent">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#0CF2A0]/10 text-xs font-bold text-[#0CF2A0]">
                    {i + 1}
                  </span>
                  <p className="font-semibold text-white">{section.title}</p>
                </div>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 shrink-0 text-gray-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 shrink-0 text-gray-500" />
                )}
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden border-t border-gray-800"
                  >
                    <div className="px-5 pt-0 pb-5">
                      <div className="space-y-2 pt-4">
                        {section.points.map((point, j) => (
                          <p
                            key={j}
                            className="flex items-start gap-2 text-sm leading-relaxed text-gray-400"
                          >
                            {point}
                          </p>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
