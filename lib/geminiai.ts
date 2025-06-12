import { GoogleGenerativeAI } from "@google/generative-ai";
import { SUMMARY_SYSTEM_PROMPT } from "@/utils/prompts";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not set in environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function generateSummaryFromGemini(
  pdfText: string
): Promise<string | null> {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
    });

    const fullPrompt = `${SUMMARY_SYSTEM_PROMPT}\n\nDocument:\n\n${pdfText}\n\nTransform this document into an engaging, easy-to-read summary with contextually relevant emojis and proper markdown formatting based on the provided template.`;

    console.log("Sending structured prompt to Gemini...");

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const summary = response.text();

    if (!summary) {
      throw new Error("Empty response from Gemini API");
    }
    return summary;
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
}
