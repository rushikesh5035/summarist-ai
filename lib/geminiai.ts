import { GoogleGenerativeAI } from "@google/generative-ai";

import { SUMMARY_SYSTEM_PROMPT } from "@/utils/prompts";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not set in environment variables.");
}

export const genAI = new GoogleGenerativeAI(apiKey);

export const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

export async function generateSummaryFromGemini(
  pdfText: string
): Promise<string | null> {
  try {
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

// Returns a 3072-dimensional embedding vector for the given text.
export async function embedText(text: string): Promise<number[]> {
  const embeddingModel = genAI.getGenerativeModel({
    model: "gemini-embedding-001",
  });

  const result = await embeddingModel.embedContent(text);
  return result.embedding.values;
}

// Embeds multiple texts in a batch, rate limit friendly
export async function embedBatch(texts: string[]): Promise<number[][]> {
  const embeddings: number[][] = [];

  for (const text of texts) {
    const embedding = await embedText(text);
    embeddings.push(embedding);
  }
  return embeddings;
}
