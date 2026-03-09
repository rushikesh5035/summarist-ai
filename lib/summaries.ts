import { getDBConnection } from "@/lib/db";

// Get all summaries for a user
export async function getSummaries(userId: string) {
  const sql = await getDBConnection();
  const summaries = await sql`
    SELECT * FROM pdf_summaries
      WHERE user_id= ${userId} 
      ORDER BY created_at DESC`;

  return summaries;
}

// Get a single summary by its ID, including a word count
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

// Get the total number of summaries uploaded by a user
export const getUserUploadCount = async (userId: string) => {
  try {
    const sql = await getDBConnection();
    const [result] =
      await sql`SELECT COUNT(*) as count FROM pdf_summaries WHERE user_id=${userId}`;
    return Number(result?.count ?? 0);
  } catch (error) {
    console.error("Error fetching user upload count:", error);
    return 0;
  }
};

// Get the number of summaries uploaded by a user in the current month
export const getUserUploadCountThisMonth = async (userId: string) => {
  try {
    const sql = await getDBConnection();
    const [result] = await sql`
      SELECT COUNT(*) as count
      FROM pdf_summaries
      WHERE user_id = ${userId}
        AND created_at >= date_trunc('month', NOW())
    `;
    return Number(result?.count ?? 0);
  } catch (error) {
    console.error("Error fetching monthly upload count:", error);
    return 0;
  }
};
