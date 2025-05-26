import { SUMMARY_SYSTEM_PROMPT } from "@/utils/prompts";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

// Helper: Wait for ms milliseconds
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function generateSummaryFromOpenAi(
  pdfText: string,
  maxRetries = 5
) {
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4.1",
        messages: [
          {
            role: "system",
            content: SUMMARY_SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: `Transform this document into an engaging, easy-to-read summary with contextually relevant emojis and proper markdown formatting:\n\n${pdfText}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 1500,
      });

      return completion.choices[0].message.content;
    } catch (error: any) {
      if (error?.status === 429) {
        throw new Error("RATE_LIMIT_EXCEEDED");
      }
      console.error("Error generating summary:", error);
      throw new Error(
        "An unexpected error occurred while generating the summary."
      );
    }
  }
}
