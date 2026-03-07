import { notFound } from "next/navigation";

import SummaryViewer from "@/components/summaries/SummaryViewer";
import { getSummaryById } from "@/lib/summaries";

const SummaryPage = async (props: { params: Promise<{ id: string }> }) => {
  const { id } = await props.params;
  const summary = await getSummaryById(id);

  if (!summary) notFound();

  return (
    <main className="mx-auto mt-20 max-w-5xl px-6 pt-8 pb-20">
      <SummaryViewer
        summary={summary.summary_text}
        fileName={summary.file_name ?? ""}
        wordCount={summary.word_count ?? 0}
        createdAt={summary.created_at}
      />
    </main>
  );
};

export default SummaryPage;
