import type { Metadata } from "next";
import { notFound } from "next/navigation";

import SummaryViewer from "@/components/summaries/SummaryViewer";
import { getSummaryById } from "@/lib/summaries";

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await props.params;
  const summary = await getSummaryById(id);

  return {
    title: summary?.fileName || "Summary",
    description: "View your AI-generated PDF summary",
    robots: {
      index: false,
      follow: false,
    },
  };
}

const SummaryPage = async (props: { params: Promise<{ id: string }> }) => {
  const { id } = await props.params;
  const summary = await getSummaryById(id);

  if (!summary) notFound();

  return (
    <main className="mx-auto mt-20 max-w-5xl px-6 pt-8 pb-20">
      <SummaryViewer
        summary={summary.summaryText ?? ""}
        fileName={summary.fileName ?? ""}
        wordCount={summary.wordCount ?? 0}
        createdAt={summary.createdAt.toISOString()}
      />
    </main>
  );
};

export default SummaryPage;
