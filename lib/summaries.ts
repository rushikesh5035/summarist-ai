import { getDBConnection } from "@/lib/db";

export async function getSummaries(userId: string) {
  const sql = await getDBConnection();
  const summaries = await sql`
    SELECT * FROM pdf_summaries
      WHERE user_id= ${userId} 
      ORDER BY created_at DESC`;

  return summaries;
}

export async function getSummaryById(id: string) {
  try {
    const sql = await getDBConnection();
    const [summary] = await sql`
    SELECT 
      *, 
      LENGTH(summary_text) - LENGTH(REPLACE(summary_text, ' ', '')) + 1 AS word_count
    FROM pdf_summaries 
    WHERE id=${id}`;
    return summary;
  } catch (error) {
    console.error("Error fetching summary by id:", id);
  }
}

export const getUserUploadCount = async (userId: string) => {
  try {
    const sql = await getDBConnection();
    const [result] =
      await sql`SELECT COUNT(*) as count FROM pdf_summaries WHERE user_id=${userId}`;
    return result?.count;
  } catch (error) {
    console.error("Error fetching user upload count:", error);
  }
};
