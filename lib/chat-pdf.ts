import { cache } from "react";

import { asc, eq, sql } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { chatMessages, chatPdfs, ChatPdfStatus } from "@/db/schema";

// Create a new chat pdf record
export async function createChatPdf({
  userId,
  fileName,
  fileUrl,
}: {
  userId: string;
  fileName: string;
  fileUrl: string;
}) {
  const [record] = await db
    .insert(chatPdfs)
    .values({
      userId,
      fileName,
      fileUrl,
      status: "processing",
    })
    .returning({
      id: chatPdfs.id,
      status: chatPdfs.status,
    });
  return record;
}

// Get a single chat pdf by its ID
export const getChatPdfById = cache(async function getChatPdfById(id: string) {
  const [record] = await db.select().from(chatPdfs).where(eq(chatPdfs.id, id));
  return record ?? null;
});

// Update chat pdf status
export async function updateChatPdfStatus(id: string, status: ChatPdfStatus) {
  console.log(`[updateChatPdfStatus] Updating ${id} to status: ${status}`);

  const result = await db
    .update(chatPdfs)
    .set({ status, updatedAt: new Date() })
    .where(eq(chatPdfs.id, id))
    .returning({ id: chatPdfs.id, status: chatPdfs.status });

  console.log(`[updateChatPdfStatus] Update result:`, result);

  if (!result || result.length === 0) {
    throw new Error(`Failed to update status for chatPdf ${id}`);
  }

  return result[0];
}

// Insert chunks into the database
export async function insertChunks(
  chatPdfId: string,
  chunks: { content: string; embedding: number[]; pageNumber?: number | null }[]
) {
  // Drizzle can insert the content and pageNumber via the schema, but
  // embedding needs raw SQL because of the vector
  for (const chunk of chunks) {
    const vectorLiteral = `[${chunk.embedding.join(",")}]`;
    await db.execute(sql`
        INSERT INTO pdf_chunks (id, chat_pdf_id, content, embedding, page_number)
        VALUES (
            gen_random_uuid(),
            ${chatPdfId},
            ${chunk.content},
            ${sql.raw(`'${vectorLiteral}'::vector`)},
            ${chunk.pageNumber ?? null}
        )`);
  }
}

// similarity search using pgvector
export async function similaritySearch(
  chatPdfId: string,
  queryEmbedding: number[],
  topk = 5
): Promise<{ content: string; pageNumber: number | null }[]> {
  const vectorLiteral = `[${queryEmbedding.join(",")}]`;

  const results = await db.execute(sql`
    SELECT content, page_number
    FROM pdf_chunks
    WHERE chat_pdf_id = ${chatPdfId}
    ORDER BY embedding <=> ${sql.raw(`'${vectorLiteral}'::vector`)}
    LIMIT ${topk}
    `);

  console.log(
    "[similaritySearch] Found",
    results.rows.length,
    "relevant chunks"
  );

  // Map page_number to pageNumber to match TypeScript type
  return results.rows.map((row: any) => ({
    content: row.content,
    pageNumber: row.page_number,
  }));
}

// Save chat message
export async function saveChatMessage({
  chatPdfId,
  role,
  content,
}: {
  chatPdfId: string;
  role: "user" | "assistant";
  content: string;
}) {
  const [msg] = await db
    .insert(chatMessages)
    .values({ chatPdfId, role, content })
    .returning({
      id: chatMessages.id,
      role: chatMessages.role,
      content: chatMessages.content,
      createdAt: chatMessages.createdAt,
    });
  return msg;
}

// Get chat messages for a chat pdf
export async function getChatMessages(chatPdfId: string) {
  return db
    .select({
      id: chatMessages.id,
      role: chatMessages.role,
      content: chatMessages.content,
      createdAt: chatMessages.createdAt,
    })
    .from(chatMessages)
    .where(eq(chatMessages.chatPdfId, chatPdfId))
    .orderBy(asc(chatMessages.createdAt));
}

// Get all chat PDFs for a user
export async function getChatPdfs(userId: string) {
  const results = await db
    .select({
      id: chatPdfs.id,
      userId: chatPdfs.userId,
      fileName: chatPdfs.fileName,
      fileUrl: chatPdfs.fileUrl,
      status: chatPdfs.status,
      createdAt: chatPdfs.createdAt,
      updatedAt: chatPdfs.updatedAt,
      messageCount: sql<number>`(
        SELECT COUNT(*)::int
        FROM ${chatMessages}
        WHERE ${chatMessages.chatPdfId} = ${chatPdfs.id}
      )`.as("message_count"),
    })
    .from(chatPdfs)
    .where(eq(chatPdfs.userId, userId))
    .orderBy(sql`${chatPdfs.updatedAt} DESC`);

  return results;
}
