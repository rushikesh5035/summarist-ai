"use client";

import { useEffect, useState } from "react";

import { motion } from "framer-motion";

import {
  exportAsDoc,
  exportAsMarkdown,
  exportAsTxt,
} from "@/utils/export-summary";
import { parseSummaryText } from "@/utils/parse-summary";

import ScrollToTopButton from "./ScrollToTopButton";
import SummaryActionItemsPanel from "./SummaryActionItemsPanel";
import SummaryCollapsibleSections from "./SummaryCollapsibleSections";
import SummaryKeyPointsPanel from "./SummaryKeyPointsPanel";
import SummaryOverviewPanel from "./SummaryOverviewPanel";
import SummaryViewHeading from "./SummaryViewHeading";

interface SummaryViewerProps {
  summary: string;
  fileName: string;
  wordCount: number;
  createdAt: string;
}

const SummaryViewer = ({
  summary,
  fileName,
  wordCount,
  createdAt,
}: SummaryViewerProps) => {
  const parsed = parseSummaryText(summary, wordCount);

  const [expandedSections, setExpandedSections] = useState<Set<number>>(
    new Set([0])
  );
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [copied, setCopied] = useState(false);

  const toggleSection = (index: number) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const expandAll = () =>
    setExpandedSections(new Set(parsed.sections.map((_, i) => i)));
  const collapseAll = () => setExpandedSections(new Set());

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCopy = () => {
    const text = [parsed.title, parsed.overview, parsed.keyPoints.join("\n")]
      .filter(Boolean)
      .join("\n\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportTxt = () => exportAsTxt(parsed, fileName, createdAt);
  const handleExportMarkdown = () =>
    exportAsMarkdown(parsed, fileName, createdAt);
  const handleExportDoc = () => exportAsDoc(parsed, fileName, createdAt);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <SummaryViewHeading
        title={parsed.title}
        readTime={parsed.readTime}
        fileName={fileName}
        sectionCount={parsed.sections.length}
        copied={copied}
        onCopy={handleCopy}
        onExportTxt={handleExportTxt}
        onExportMarkdown={handleExportMarkdown}
        onExportDoc={handleExportDoc}
      />

      <SummaryOverviewPanel overview={parsed.overview} />

      <SummaryKeyPointsPanel keyPoints={parsed.keyPoints} />

      <SummaryCollapsibleSections
        sections={parsed.sections}
        expandedSections={expandedSections}
        onToggle={toggleSection}
        onExpandAll={expandAll}
        onCollapseAll={collapseAll}
      />

      <SummaryActionItemsPanel actionItems={parsed.actionItems} />

      <ScrollToTopButton show={showScrollTop} />
    </motion.div>
  );
};

export default SummaryViewer;
