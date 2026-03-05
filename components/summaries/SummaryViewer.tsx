"use client";

import React, { useState } from "react";

import { motion } from "motion/react";

import ContentSection from "@/components/summaries/ContentSection";
import { NavigationControls } from "@/components/summaries/NavigationControls";
import ProgressBar from "@/components/summaries/ProgressBar";
import { Card } from "@/components/ui/card";
import { parseSection } from "@/utils/summary-helpers";

const SectionTitle = ({ title }: { title: string }) => {
  return (
    <div className="bg-background/80 sticky top-0 z-10 mb-4 flex flex-col gap-2 pt-4 pb-4 backdrop-blur-xs">
      <h2 className="flex items-center justify-center gap-2 text-center text-2xl font-bold lg:text-3xl">
        {title}
      </h2>
    </div>
  );
};

const SummaryViewer = ({ summary }: { summary: string }) => {
  const [currentSection, setCurrentSection] = useState(0);

  const sections = summary
    .split("\n#")
    .map((section) => section.trim())
    .filter(Boolean)
    .map(parseSection);

  const handleNext = () =>
    setCurrentSection((prev) => Math.min(prev + 1, sections.length - 1));
  // Corrected: Use Math.max for handlePrevious
  const handlePrevious = () =>
    setCurrentSection((prev) => Math.max(prev - 1, 0));

  return (
    <Card className="from-background via-background/95 relative h-125 w-full overflow-hidden rounded-3xl border border-rose-500/10 bg-linear-to-br to-rose-500/5 px-2 shadow-2xl backdrop-blur-lg sm:h-150 lg:h-125 xl:w-2125">
      <ProgressBar sections={sections} currentSection={currentSection} />
      <motion.div
        key={currentSection}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        exit={{ opacity: 0 }}
        className="scrollbar-hide h-full overflow-y-auto pt-12 pb-20 sm:pt-16 sm:pb-24"
      >
        <div className="px-4 sm:px-6">
          <SectionTitle title={sections[currentSection]?.title || ""} />
          <ContentSection
            title={sections[currentSection]?.title || ""}
            points={sections[currentSection]?.points || []}
          />
        </div>
      </motion.div>

      <NavigationControls
        currentSection={currentSection}
        totalSections={sections.length}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSectionSelect={setCurrentSection}
      />
    </Card>
  );
};

export default SummaryViewer;
