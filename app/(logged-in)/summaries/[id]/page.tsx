import React from "react";

import { notFound } from "next/navigation";

import { FileText } from "lucide-react";

import BgGradient from "@/components/common/BgGradient";
import { MotionDiv } from "@/components/common/motion-wrapper";
import SourceInfo from "@/components/summaries/SourceInfo";
import SummaryHeader from "@/components/summaries/SummaryHeader";
import SummaryViewer from "@/components/summaries/SummaryViewer";
import { getSummaryById } from "@/lib/summaries";

const SummaryPage = async (props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;
  const id = params.id;

  const summary = await getSummaryById(id);

  if (!summary) {
    notFound();
  }

  const {
    title,
    summary_text,
    file_name,
    word_count,
    created_at,
    original_file_url,
  } = summary;

  return (
    <div className="fromrose50/40 relative isolate min-h-screen bg-linear-to-b to-white">
      <BgGradient className="from-rose-400 via-rose-300 to-orange-200" />

      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto flex flex-col gap-4"
      >
        <div className="px-4 py-2 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col"
          >
            <SummaryHeader title={title} created_at={created_at} />

            {file_name && (
              <SourceInfo
                title={title}
                summaryText={summary_text}
                fileName={file_name}
                originalFileUrl={original_file_url}
                createdAt={created_at}
              />
            )}

            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative mt-4 sm:mt-8 lg:mt-16"
            >
              <div className="relative mx-auto max-w-4xl rounded-2xl border border-rose-100/30 bg-white/80 p-4 shadow-xl backdrop-blur-md transition-all duration-300 hover:bg-white/90 hover:shadow-2xl sm:rounded-3xl sm:p-6 lg:p-8">
                <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-rose-50/50 via-orange-50/30 to-transparent opacity-50 sm:rounded-3xl" />

                <div className="text-muted-foreground absolute top-2 right-2 flex items-center gap-1.5 rounded-full bg-white/90 px-2 py-1 text-xs shadow-xs sm:top-3 sm:right-4 sm:gap-2 sm:px-3 sm:py-1.5 sm:text-sm">
                  <FileText className="h-3 w-3 text-rose-400 sm:h-4 sm:w-4" />
                  {word_count?.toLocaleString()} words
                </div>

                <div className="relative mt-8 flex justify-center sm:mt-8">
                  <SummaryViewer summary={summary.summary_text} />
                </div>
              </div>
            </MotionDiv>
          </MotionDiv>
        </div>
      </MotionDiv>
    </div>
  );
};

export default SummaryPage;
