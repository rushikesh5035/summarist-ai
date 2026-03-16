import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { CharacterTextSplitter } from "@langchain/textsplitters";
import { fetch } from "inngest";

import { insertChunks, updateChatPdfStatus } from "@/lib/chat-pdf";
import { embedBatch } from "@/lib/geminiai";

import { inngest } from "../client";

export const processPdfForChat = inngest.createFunction(
  {
    id: "process-pdf-for-chat",
    retries: 2,
  },
  {
    event: "pdf/chat.uploaded",
  },
  async ({ event, step }) => {
    const { chatPdfId, fileUrl } = event.data as {
      chatPdfId: string;
      fileUrl: string;
    };

    try {
      // Stage 1: Parsing
      const docs = await step.run("parse-pdf", async () => {
        await updateChatPdfStatus(chatPdfId, "parsing");
        console.log(`[Inngest] Parsing PDF from ${fileUrl}`);

        const response = await fetch(fileUrl);
        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();
        const loader = new PDFLoader(new Blob([arrayBuffer]));
        const loadedDocs = await loader.load();

        console.log(`[Inngest] Parsed ${loadedDocs.length} pages`);
        return loadedDocs;
      });

      // Stage 2: Chunking
      // const chunks = await step.run("chunk-text", async () => {
      //   await updateChatPdfStatus(chatPdfId, "chunking");
      //   console.log(`[Inngest] Chunking ${docs.length} documents`);

      //   const splitter = new CharacterTextSplitter({
      //     separator: "\n",
      //     chunkSize: 1000,
      //     chunkOverlap: 200,
      //   });
      //   const splitDocs = await splitter.splitDocuments(docs);
      //   const result = splitDocs.map((doc) => ({
      //     content: doc.pageContent,
      //     pageNumber: doc.metadata?.loc?.pageNumber ?? null,
      //   }));

      //   console.log(`[Inngest] Created ${result.length} chunks`);
      //   return result;
      // });

      // Stage 2: Chunking
      const chunks = await step.run("chunk-text", async () => {
        await updateChatPdfStatus(chatPdfId, "chunking");
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
        return result;
      });

      // // Stage 3: Embedding & storing
      // await step.run("embed-and-store", async () => {
      //   await updateChatPdfStatus(chatPdfId, "embedding");
      //   console.log(`[Inngest] Embedding ${chunks.length} chunks`);

      //   const texts = chunks.map((c) => c.content);
      //   const embeddings = await embedBatch(texts);
      //   const enrichedChunks = chunks.map((chunk, i) => ({
      //     ...chunk,
      //     embedding: embeddings[i],
      //   }));
      //   await insertChunks(chatPdfId, enrichedChunks);

      //   console.log(
      //     `[Inngest] Stored ${enrichedChunks.length} chunks with embeddings`
      //   );
      //   return { stored: enrichedChunks.length };
      // });

      // Stage 3: Embedding & storing
      await step.run("embed-and-store", async () => {
        await updateChatPdfStatus(chatPdfId, "embedding");
        console.log(`[Inngest] Embedding ${chunks.length} chunks`);
        const texts = chunks.map((c) => c.content);
        const embeddings = await embedBatch(texts);
        const enrichedChunks = chunks.map((chunk, i) => ({
          ...chunk,
          embedding: embeddings[i],
        }));
        await insertChunks(chatPdfId, enrichedChunks);
        console.log(
          `[Inngest] Stored ${enrichedChunks.length} chunks with embeddings`
        );
        return { stored: enrichedChunks.length };
      });

      // // Stage 4: Done
      //   await step.run("mark-ready", async () => {
      //     const result = await updateChatPdfStatus(chatPdfId, "ready");
      //     console.log(`[Inngest] Successfully marked as ready:`, result);
      //   });

      //   return { chatPdfId, chunksProcessed: chunks.length };
      // } catch (error) {
      //   console.error(
      //     "[Inngest] Processing failed for chatPdfId:",
      //     chatPdfId,
      //     error
      //   );

      // Stage 4: Done
      await step.run("mark-ready", async () => {
        const result = await updateChatPdfStatus(chatPdfId, "ready");
        console.log(`[Inngest] Successfully marked as ready:`, result);
      });
      return { chatPdfId, chunksProcessed: chunks.length };
    } catch (error) {
      console.error(
        "[Inngest] Processing failed for chatPdfId:",
        chatPdfId,
        error
      );

      // // Try to mark as error in database
      // try {
      //   await updateChatPdfStatus(chatPdfId, "error");
      //   console.log("[Inngest] Marked status as error in database");
      // } catch (updateError) {
      //   console.error(
      //     "[Inngest] Failed to update status to error:",
      //     updateError
      //   );
      // }

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
