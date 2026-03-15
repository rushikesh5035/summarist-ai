import { desc, eq, sql } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { pdfSummaries } from "@/db/schema";

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
