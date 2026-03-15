"use server";

import { revalidatePath } from "next/cache";

import { currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { pdfSummaries, users } from "@/db/schema";

export async function deleteSummaryAction({
  summaryId,
}: {
  summaryId: string;
}) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser?.id) throw new Error("User not found");

    // Delete summary from DB
    const [dbUser] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.clerkId, clerkUser.id));

    if (!dbUser) {
      return {
        message: "User not found",
        success: false,
      };
    }

    const result = await db
      .delete(pdfSummaries)
      .where(
        and(eq(pdfSummaries.id, summaryId), eq(pdfSummaries.userId, dbUser.id))
      )
      .returning({ id: pdfSummaries.id });

    if (result.length > 0) {
      revalidatePath("/vault");
      return { success: true, message: "Summary deleted successfully" };
    }
    return { success: false, message: "Summary not found" };
  } catch (error) {
    console.error("Error deleting summary", error);
    return { success: false, message: "Error deleting summary" };
  }
}
