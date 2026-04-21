"use server";

import { revalidatePath } from "next/cache";

import { auth, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { pdfSummaries, users } from "@/db/schema";
import { generateSummaryFromGemini } from "@/lib/geminiai";
import { fetchAndExtractPdfText } from "@/lib/langchain";
import { ensureFreeUserExists } from "@/lib/user";
import { formatFileNameAsTitle } from "@/utils/format-utils";

interface PdfSummaryType {
  userId?: string;
  fileUrl: string;
  summary: string;
  title: string;
  fileName: string;
}

export async function generatePdfSummary(
  uploadResponse: [
    {
      serverData: {
        userId: string;
        file: {
          ufsUrl: string;
          name: string;
        };
      };
    },
  ]
) {
  // verify user is authenticated
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) {
    return {
      success: false,
      message: "Unauthorized",
      data: null,
    };
  }

  if (!uploadResponse) {
    return {
      success: false,
      message: "Invalid upload response or PDF URL not found.",
      data: null,
    };
  }

  const {
    serverData: {
      userId,
      file: { ufsUrl: pdfUrl, name: fileName },
    },
  } = uploadResponse[0];

  try {
    const pdfText = await fetchAndExtractPdfText(pdfUrl);

    if (!pdfText) {
      return {
        success: false,
        message: "Could not extract text from PDF.",
        data: null,
      };
    }

    console.log("PDF text extracted, length:", pdfText.length);

    let summary: string | null = null;

    try {
      summary = await generateSummaryFromGemini(pdfText);
      console.log("Gemini summary attempt result:", { summary });
    } catch (error: any) {
      console.error("Gemini attempt failed:", error.message);
    }

    if (!summary) {
      return {
        success: false,
        message: "Failed to generate summary ",
        data: null,
      };
    }

    // Try to extract the AI-generated title from the JSON response
    let title = formatFileNameAsTitle(fileName);
    try {
      const parsed = JSON.parse(summary);
      if (parsed?.title) title = parsed.title;
    } catch {
      // keep the file-name-based title as fallback
    }

    return {
      success: true,
      message: "PDF summarized successfully!",
      data: {
        title,
        summary,
      },
    };
  } catch (error: any) {
    console.error("Error during PDF summary process:", error);
    return {
      success: false,
      message: `Failed to process PDF and generate summary: ${error.message}`,
      data: null,
    };
  }
}

async function savedPdfSummary({
  userId, // clerkId
  fileUrl,
  summary,
  title,
  fileName,
}: PdfSummaryType) {
  try {
    if (!userId) throw new Error("User ID is required");

    const [dbUser] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.clerkId, userId));

    if (!dbUser) throw new Error("User not found");

    const [saved] = await db
      .insert(pdfSummaries)
      .values({
        userId: dbUser.id,
        originalFileUrl: fileUrl,
        summaryText: summary,
        title,
        fileName,
      })
      .returning({
        id: pdfSummaries.id,
        summaryText: pdfSummaries.summaryText,
      });

    return saved;
  } catch (error) {
    console.error("Error saving PDF Summary:", error);
    throw error;
  }
}

export async function storePdfSummaryAction({
  fileUrl,
  summary,
  title,
  fileName,
}: PdfSummaryType) {
  let savedSummary: any;

  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        message: "User not found",
      };
    }

    // Get user from DB (webhook should have created it)
    // Fallback: Create user if webhook missed it
    const user = await currentUser();
    if (user) {
      const existingUser = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.clerkId, userId));

      if (existingUser.length === 0) {
        console.warn(
          "[Upload] User not found in DB, creating via fallback:",
          userId
        );
        await ensureFreeUserExists(user);
      }
    }

    savedSummary = await savedPdfSummary({
      userId,
      fileUrl,
      summary,
      title,
      fileName,
    });

    if (!savedSummary) {
      return {
        success: false,
        message: "Failed to save PDF Summary",
      };
    }
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Error saving PDF summary",
    };
  }

  // Revalidate all pages that display the summary or summary count
  revalidatePath(`/summaries/${savedSummary.id}`);
  revalidatePath("/vault");
  revalidatePath("/dashboard");

  return {
    success: true,
    message: "PDF summary saved successfully",
    data: {
      id: savedSummary.id,
    },
  };
}
