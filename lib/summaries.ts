import { desc, eq, sql } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { chatPdfs, pdfSummaries } from "@/db/schema";

// Unified vault item type
export type VaultItem = {
  id: string;
  type: "summary" | "chat";
  title: string;
  fileName: string;
  createdAt: Date;
  // Summary-specific
  summaryText?: string;
  originalFileUrl?: string;
  // Chat-specific
  fileUrl?: string;
  status?: string;
  messageCount?: number;
  updatedAt?: Date;
};

// Get all vault items (summaries + chats) for a user
export async function getVaultItems(dbUserId: string): Promise<VaultItem[]> {
  // Get summaries
  const summaries = await db
    .select()
    .from(pdfSummaries)
    .where(eq(pdfSummaries.userId, dbUserId));

  // Get chat PDFs with message count
  const chats = await db
    .select({
      id: chatPdfs.id,
      userId: chatPdfs.userId,
      fileName: chatPdfs.fileName,
      fileUrl: chatPdfs.fileUrl,
      status: chatPdfs.status,
      createdAt: chatPdfs.createdAt,
      updatedAt: chatPdfs.updatedAt,
    })
    .from(chatPdfs)
    .where(eq(chatPdfs.userId, dbUserId));

  // Transform summaries to vault items
  const summaryItems: VaultItem[] = summaries.map((s) => ({
    id: s.id,
    type: "summary" as const,
    title: s.title || s.fileName || "Untitled",
    fileName: s.fileName || "",
    createdAt: s.createdAt,
    summaryText: s.summaryText || undefined,
    originalFileUrl: s.originalFileUrl || undefined,
  }));

  // Transform chats to vault items
  const chatItems: VaultItem[] = chats.map((c) => ({
    id: c.id,
    type: "chat" as const,
    title: c.fileName,
    fileName: c.fileName,
    createdAt: c.createdAt,
    fileUrl: c.fileUrl,
    status: c.status,
    updatedAt: c.updatedAt,
  }));

  // Combine and sort by most recent (using updatedAt for chats, createdAt for summaries)
  const allItems = [...summaryItems, ...chatItems].sort((a, b) => {
    const dateA = a.type === "chat" && a.updatedAt ? a.updatedAt : a.createdAt;
    const dateB = b.type === "chat" && b.updatedAt ? b.updatedAt : b.createdAt;
    return dateB.getTime() - dateA.getTime();
  });

  return allItems;
}

// Get all summaries for a user
export async function getSummaries(dbUserId: string) {
  return db
    .select()
    .from(pdfSummaries)
    .where(eq(pdfSummaries.userId, dbUserId))
    .orderBy(desc(pdfSummaries.createdAt));
}

// Get a single summary by its ID, including a word count
export async function getSummaryById(id: string) {
  try {
    const [summary] = await db
      .select({
        id: pdfSummaries.id,
        userId: pdfSummaries.userId,
        originalFileUrl: pdfSummaries.originalFileUrl,
        summaryText: pdfSummaries.summaryText,
        title: pdfSummaries.title,
        fileName: pdfSummaries.fileName,
        createdAt: pdfSummaries.createdAt,
        wordCount: sql<number>`
          LENGTH(${pdfSummaries.summaryText}) 
          - LENGTH(REPLACE(${pdfSummaries.summaryText}, ' ', '')) 
          + 1`.as("word_count"),
      })
      .from(pdfSummaries)
      .where(eq(pdfSummaries.id, id));

    return summary ?? null;
  } catch (error) {
    console.error("Error fetching summary by id:", id);
  }
}
