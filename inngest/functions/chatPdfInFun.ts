import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { CharacterTextSplitter } from "@langchain/textsplitters";
import { fetch } from "inngest";

import { insertChunks, updateChatPdfStatus } from "@/lib/chat-pdf";
import { embedBatch } from "@/lib/geminiai";

import { pdfProcessingChannel } from "../channels";
import { inngest } from "../client";

export const processPdfForChat = inngest.createFunction(
  {
    id: "process-pdf-for-chat",
    retries: 2,
  },
  {
    event: "pdf/chat.uploaded",
  },
  // @ts-expect-error - publish is added by realtimeMiddleware at runtime
  async ({ event, step, publish }) => {
    const { chatPdfId, fileUrl } = event.data as {
      chatPdfId: string;
      fileUrl: string;
    };

    try {
      // Publish initial processing status
      await publish(
        pdfProcessingChannel(chatPdfId).progress({
          status: "processing",
          message: "Starting PDF processing...",
          progress: 0,
        })
      );

      // Stage 1: Parsing
      const docs = await step.run("parse-pdf", async () => {
        await updateChatPdfStatus(chatPdfId, "parsing");
        await publish(
          pdfProcessingChannel(chatPdfId).progress({
            status: "parsing",
            message: "Parsing PDF document...",
            progress: 10,
          })
        );
        console.log(`[Inngest] Parsing PDF from ${fileUrl}`);

        const response = await fetch(fileUrl);
        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();
        const loader = new PDFLoader(new Blob([arrayBuffer]));
        const loadedDocs = await loader.load();

        console.log(`[Inngest] Parsed ${loadedDocs.length} pages`);
        await publish(
          pdfProcessingChannel(chatPdfId).progress({
            status: "parsing",
            message: `Parsed ${loadedDocs.length} pages successfully`,
            progress: 30,
            metadata: { pages: loadedDocs.length },
          })
        );
        return loadedDocs;
      });

      // Stage 2: Chunking
      const chunks = await step.run("chunk-text", async () => {
        await updateChatPdfStatus(chatPdfId, "chunking");
        await publish(
          pdfProcessingChannel(chatPdfId).progress({
            status: "chunking",
            message: "Splitting document into chunks...",
            progress: 40,
          })
        );
        console.log(`[Inngest] Chunking ${docs.length} documents`);

        const splitter = new CharacterTextSplitter({
          separator: "\n",
          chunkSize: 1000,
          chunkOverlap: 200,
        });
        const splitDocs = await splitter.splitDocuments(docs);
        const result = splitDocs.map((doc) => ({
          content: doc.pageContent,
          pageNumber: doc.metadata?.loc?.pageNumber ?? null,
        }));

        console.log(`[Inngest] Created ${result.length} chunks`);
        await publish(
          pdfProcessingChannel(chatPdfId).progress({
            status: "chunking",
            message: `Created ${result.length} text chunks`,
            progress: 50,
            metadata: { chunks: result.length },
          })
        );
        return result;
      });

      // Stage 3: Embedding & storing
      await step.run("embed-and-store", async () => {
        await updateChatPdfStatus(chatPdfId, "embedding");
        await publish(
          pdfProcessingChannel(chatPdfId).progress({
            status: "embedding",
            message: "Generating AI embeddings...",
            progress: 60,
          })
        );
        console.log(`[Inngest] Embedding ${chunks.length} chunks`);

        const texts = chunks.map((c) => c.content);
        const embeddings = await embedBatch(texts);
        const enrichedChunks = chunks.map((chunk, i) => ({
          ...chunk,
          embedding: embeddings[i],
        }));

        await publish(
          pdfProcessingChannel(chatPdfId).progress({
            status: "embedding",
            message: "Storing embeddings in database...",
            progress: 80,
          })
        );

        await insertChunks(chatPdfId, enrichedChunks);

        console.log(
          `[Inngest] Stored ${enrichedChunks.length} chunks with embeddings`
        );
        await publish(
          pdfProcessingChannel(chatPdfId).progress({
            status: "embedding",
            message: `Stored ${enrichedChunks.length} embeddings`,
            progress: 90,
          })
        );
        return { stored: enrichedChunks.length };
      });

      // Stage 4: Done
      await step.run("mark-ready", async () => {
        const result = await updateChatPdfStatus(chatPdfId, "ready");
        console.log(`[Inngest] Successfully marked as ready:`, result);
        await publish(
          pdfProcessingChannel(chatPdfId).progress({
            status: "ready",
            message: "PDF is ready for chat!",
            progress: 100,
          })
        );
      });

      return { chatPdfId, chunksProcessed: chunks.length };
    } catch (error) {
      console.error(
        "[Inngest] Processing failed for chatPdfId:",
        chatPdfId,
        error
      );

      // Publish error status
      await publish(
        pdfProcessingChannel(chatPdfId).progress({
          status: "error",
          message: "Failed to process PDF. Please try again.",
          progress: 0,
        })
      );

      // Try to mark as error in database
      try {
        await updateChatPdfStatus(chatPdfId, "error");
        console.log("[Inngest] Marked status as error in database");
      } catch (updateError) {
        console.error(
          "[Inngest] Failed to update status to error:",
          updateError
        );
      }

      // Re-throw for Inngest retry logic
      throw error;
    }
  }
);
