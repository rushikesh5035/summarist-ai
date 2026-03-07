"use client";

import { motion } from "framer-motion";

import SummaryActionItems from "./SummaryActionItems";
import SummaryHeader from "./SummaryHeader";
import SummaryKeyPoints from "./SummaryKeyPoints";
import SummaryOverview from "./SummaryOverview";
import SummarySections from "./SummarySections";

interface SummaryData {
  title: string;
  readTime: string;
  overview: string;
  keyPoints: string[];
  sections: Array<{ title: string; content: string }>;
  actionItems: string[];
}

interface SummaryPageProps {
  fileName: string;
  summaryData: SummaryData;
  copied: boolean;
  onCopy: () => void;
  onExport?: () => void;
}

export default function SummaryPage({
  fileName,
  summaryData,
  copied,
  onCopy,
  onExport,
}: SummaryPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <SummaryHeader
        title={summaryData.title}
        readTime={summaryData.readTime}
        fileName={fileName}
        copied={copied}
        onCopy={onCopy}
        onExport={onExport}
      />

      <SummaryOverview overview={summaryData.overview} />

      <SummaryKeyPoints keyPoints={summaryData.keyPoints} />

      <SummarySections sections={summaryData.sections} />

      <SummaryActionItems actionItems={summaryData.actionItems} />
    </motion.div>
  );
}
