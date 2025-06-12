"use server";

import { getDBConnection } from "@/lib/db";
import { generateSummaryFromGemini } from "@/lib/geminiai";
import { fetchAndExtractPdfText } from "@/lib/langchain";
import { formatFileNameAsTitle } from "@/utils/format-utils";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

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
    }
  ]
) {
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

    const formattedFileName = formatFileNameAsTitle(fileName);

    return {
      success: true,
      message: "PDF summarized successfully!",
      data: {
        title: formattedFileName,
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
  userId,
  fileUrl,
  summary,
  title,
  fileName,
}: PdfSummaryType) {
  // sql query to inserting pdf summary
  try {
    const sql = await getDBConnection();
    const [savedSummary] = await sql`
      INSERT INTO pdf_summaries(
        user_id,
        original_file_url,
        summary_text,
        title,
        file_name
      ) VALUES (
          ${userId}, ${fileUrl}, ${summary}, ${title}, ${fileName}
      ) 
      RETURNING id, summary_text`;
    return savedSummary;
  } catch (error) {
    console.log("Error saving PDF Summary");
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

  // Revalidate our cache
  revalidatePath(`/summaries/${savedSummary.id}`);

  return {
    success: true,
    message: "PDF summary saved successfully",
    data: {
      id: savedSummary.id,
    },
  };
}
