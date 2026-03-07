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
      model: "gemini-2.5-flash",
    });

    const fullPrompt = `${SUMMARY_SYSTEM_PROMPT}\n\nDocument:\n\n${pdfText}`;

    console.log("Sending structured prompt to Gemini...");

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const raw = response.text();

    if (!raw) {
      throw new Error("Empty response from Gemini API");
    }

    // Strip markdown code fences if the model wraps the JSON
    const summary = raw
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```\s*$/i, "")
      .trim();

    // console.log(summary);
    return summary;
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
}
