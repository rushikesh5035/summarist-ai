import { NextRequest, NextResponse } from "next/server";

import {
  getChatMessages,
  saveChatMessage,
  similaritySearch,
} from "@/lib/chat-pdf";
import { embedText, genAI, model } from "@/lib/geminiai";
import { CHAT_SYSTEM_PROMPT } from "@/utils/prompts";

export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id: chatPdfId } = await params;
  const { message } = await req.json();

  if (!message || typeof message !== "string") {
    return NextResponse.json({ error: "message is required" }, { status: 400 });
  }

  try {
    // 1. Save user message
    await saveChatMessage({ chatPdfId, role: "user", content: message });

    // 2. Embed the user query
    const queryEmbedding = await embedText(message);

    // 3. Retrieve top relevant chunks from pgvector
    const relevantChunks = await similaritySearch(chatPdfId, queryEmbedding, 5);

    const context = relevantChunks
      .map((chunk) => chunk.content)
      .join("\n\n---\n\n");

    // 4. Build conversation history for Gemini
    // Gemini requires history to strictly alternate user→model,
    // starting with user and ending with model.
    // We load all prior messages (excluding the one we just saved),
    // then pair them up so only complete user+model pairs are included.
    const allMessages = await getChatMessages(chatPdfId);

    // Drop the last message (the user turn we just saved above)
    const priorMessages = allMessages.slice(0, -1);

    // Build strictly-alternating pairs: [user, model, user, model, ...]
    const geminiHistory: {
      role: "user" | "model";
      parts: { text: string }[];
    }[] = [];
    for (let i = 0; i + 1 < priorMessages.length; i += 2) {
      const userMsg = priorMessages[i];
      const modelMsg = priorMessages[i + 1];
      if (userMsg.role === "user" && modelMsg.role === "assistant") {
        geminiHistory.push({
          role: "user",
          parts: [{ text: userMsg.content }],
        });
        geminiHistory.push({
          role: "model",
          parts: [{ text: modelMsg.content }],
        });
      }
    }

    // 5. Call Gemini with RAG context
    // Note: Don't use systemInstruction - it has strict format requirements
    // Instead, include instructions in the first message
    const chat = model.startChat({
      history: geminiHistory,
    });

    // Construct the full message with system prompt and context
    const messageWithContext = `${CHAT_SYSTEM_PROMPT}

Context from the document:
${context}

---

User question: ${message}`;

    console.log(
      "[Chat API] Sending message to Gemini, context length:",
      context.length
    );

    const result = await chat.sendMessage(messageWithContext);
    const answer = result.response.text();

    console.log(
      "[Chat API] Received response from Gemini, length:",
      answer.length
    );

    // 6. Save assistant response
    await saveChatMessage({
      chatPdfId,
      role: "assistant",
      content: answer,
    });

    return NextResponse.json({
      message: answer,
      sources: relevantChunks.map((c) => ({
        content: c.content.slice(0, 200),
        page: c.pageNumber,
      })),
    });
  } catch (error: any) {
    console.error("Chat API error:", error);
    console.error("Error details:", {
      message: error.message,
      status: error.status,
      statusText: error.statusText,
    });
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
};

// GET — load existing messages on page open
export const GET = async (
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id: chatPdfId } = await params;
  const messages = await getChatMessages(chatPdfId);
  return NextResponse.json({ messages });
};
