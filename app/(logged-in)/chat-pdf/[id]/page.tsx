import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { redirect } from "next/navigation";

import ChatPage from "@/components/chat/ChatPage";
import { getChatPdfById } from "@/lib/chat-pdf";

// Force dynamic rendering and disable caching
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await props.params;
  const chatPdf = await getChatPdfById(id);

  return {
    title: chatPdf?.fileName || "Chat with PDF",
    description: "Chat with your PDF using AI",
    robots: {
      index: false,
      follow: false,
    },
  };
}

const ChatPdfPage = async (props: { params: Promise<{ id: string }> }) => {
  const { id } = await props.params;
  const chatPdf = await getChatPdfById(id);

  if (!chatPdf) notFound();

  return (
    <main className="mx-auto mt-15 h-[calc(100dvh-60px)] max-w-5xl overflow-hidden px-6 py-4">
      <ChatPage
        chatId={id}
        fileName={chatPdf.fileName}
        originalFileUrl={chatPdf.fileUrl}
      />
    </main>
  );
};

export default ChatPdfPage;
