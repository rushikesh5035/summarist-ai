import { notFound } from "next/navigation";

import ChatPage from "@/components/chat/ChatPage";
import { getSummaryById } from "@/lib/summaries";

function getSearchParam(
  value: string | string[] | undefined
): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

const ChatPdfPage = async (props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    fileName?: string | string[];
    fileUrl?: string | string[];
  }>;
}) => {
  const { id } = await props.params;
  const searchParams = await props.searchParams;
  const summary = await getSummaryById(id);

  const fileName = summary?.file_name ?? getSearchParam(searchParams.fileName);
  const fileUrl =
    summary?.original_file_url ?? getSearchParam(searchParams.fileUrl);

  if (!fileName) notFound();

  return (
    <main className="mx-auto mt-15 h-[calc(100dvh-60px)] max-w-5xl overflow-hidden px-6 py-4">
      <ChatPage chatId={id} fileName={fileName} originalFileUrl={fileUrl} />
    </main>
  );
};

export default ChatPdfPage;
