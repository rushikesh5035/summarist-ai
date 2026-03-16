# Chat with PDF — Full Implementation Plan (Drizzle ORM)

**Stack:** Inngest (background job) · pgvector on Neon · Gemini Embeddings · Gemini 2.5 Flash (chat) · Drizzle ORM

---

## How the Full Flow Works

```
User selects PDF + "Chat" mode on Dashboard
        ↓
UploadThing uploads PDF → returns ufsUrl
        ↓
initiateChatPdf (server action)
  → resolves clerkId → dbUserId (UUID)
  → inserts record in `chat_pdfs` table (status = "processing")
  → sends Inngest event: "pdf/chat.uploaded"
        ↓
Inngest background function picks it up
  → fetches PDF from ufsUrl
  → LangChain PDFLoader → CharacterTextSplitter (chunks)
  → Gemini Embeddings (text-embedding-004) per chunk
  → stores vectors in pgvector (`pdf_chunks` table) via Drizzle
  → updates chat_pdfs.status = "ready"
        ↓
User lands on /chat-pdf/[id]
  → ChatPage polls GET /api/chat/[id]/status until "ready"
  → User types a question
        ↓
POST /api/chat/[id]
  → embeds the user question with Gemini Embeddings
  → pgvector similarity search → top-k chunks (raw SQL for <=> operator)
  → Gemini 2.5 Flash with context → answer
  → saves message to `chat_messages` table via Drizzle
        ↓
ChatPage shows the response
```

---

## Step 1 — Install Dependencies

```bash
npm install inngest @langchain/textsplitters
```

> `@google/generative-ai` is already installed. `@langchain/community` is already installed (has PDFLoader). Only `inngest` and `@langchain/textsplitters` are new.

---

## Step 2 — Database (already done via Drizzle)

Tables `chat_pdfs`, `pdf_chunks`, `chat_messages` are already defined in `db/schema.ts` and pushed to Neon via `npx drizzle-kit push`.

**The only manual SQL step is creating the HNSW index for fast similarity search. Run this in Neon SQL Editor:**

```sql
CREATE INDEX IF NOT EXISTS pdf_chunks_embedding_idx
  ON pdf_chunks
  USING hnsw (embedding vector_cosine_ops);
```

---

## Step 3 — Environment Variables

Add to your `.env`:

```env
# Already exists
GEMINI_API_KEY=your_gemini_api_key

# New — Inngest (for local dev, no keys needed)
# For production, get keys from: https://app.inngest.com → Your App → Manage → Keys
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key
```

---

## Step 4 — Inngest Client Setup

### `lib/inngest.ts` ← **NEW FILE**

```typescript
import { Inngest } from "inngest";

export const inngest = new Inngest({ id: "summarist-ai" });
```

---

## Step 5 — Gemini Embeddings Helper

### `lib/embeddings.ts` ← **NEW FILE**

```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const embeddingModel = genAI.getGenerativeModel({
  model: "text-embedding-004",
});

/**
 * Returns a 768-dimensional embedding vector for the given text.
 */
export async function embedText(text: string): Promise<number[]> {
  const result = await embeddingModel.embedContent(text);
  return result.embedding.values;
}

/**
 * Embeds multiple texts in sequence (rate-limit friendly).
 */
export async function embedBatch(texts: string[]): Promise<number[][]> {
  const embeddings: number[][] = [];
  for (const text of texts) {
    const embedding = await embedText(text);
    embeddings.push(embedding);
  }
  return embeddings;
}
```

---

## Step 6 — Chat DB Helpers (Drizzle ORM)

### `lib/chat-db.ts` ← **NEW FILE**

All database operations use Drizzle ORM. For the vector similarity search, we use raw SQL via `db.execute()` because Drizzle doesn't have native `<=>` pgvector operator support.

```typescript
import { asc, eq, sql } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { chatMessages, chatPdfs, ChatPdfStatus, pdfChunks } from "@/db/schema";

// ── Chat PDF record ──────────────────────────────────────────────

export async function createChatPdf({
  userId,
  fileName,
  fileUrl,
}: {
  userId: string; // DB UUID (not clerkId)
  fileName: string;
  fileUrl: string;
}) {
  const [record] = await db
    .insert(chatPdfs)
    .values({
      userId,
      fileName,
      fileUrl,
      status: "processing",
    })
    .returning({ id: chatPdfs.id, status: chatPdfs.status });

  return record;
}

export async function getChatPdfById(id: string) {
  const [record] = await db.select().from(chatPdfs).where(eq(chatPdfs.id, id));

  return record ?? null;
}

export async function updateChatPdfStatus(id: string, status: ChatPdfStatus) {
  await db
    .update(chatPdfs)
    .set({ status, updatedAt: new Date() })
    .where(eq(chatPdfs.id, id));
}

// ── Chunks / Embeddings ─────────────────────────────────────────

export async function insertChunks(
  chatPdfId: string,
  chunks: { content: string; embedding: number[]; pageNumber?: number | null }[]
) {
  // Drizzle can insert the content and pageNumber via the schema, but
  // embedding needs raw SQL because of the vector cast.
  for (const chunk of chunks) {
    const vectorLiteral = `[${chunk.embedding.join(",")}]`;
    await db.execute(sql`
      INSERT INTO pdf_chunks (id, chat_pdf_id, content, embedding, page_number)
      VALUES (
        gen_random_uuid(),
        ${chatPdfId},
        ${chunk.content},
        ${vectorLiteral}::vector,
        ${chunk.pageNumber ?? null}
      )
    `);
  }
}

export async function similaritySearch(
  chatPdfId: string,
  queryEmbedding: number[],
  topK = 5
): Promise<{ content: string; pageNumber: number | null }[]> {
  // Raw SQL needed — Drizzle has no native <=> operator for pgvector
  const vectorLiteral = `[${queryEmbedding.join(",")}]`;
  const results = await db.execute(sql`
    SELECT content, page_number
    FROM pdf_chunks
    WHERE chat_pdf_id = ${chatPdfId}
    ORDER BY embedding <=> ${vectorLiteral}::vector
    LIMIT ${topK}
  `);

  return results.rows as { content: string; pageNumber: number | null }[];
}

// ── Chat messages ───────────────────────────────────────────────

export async function saveChatMessage({
  chatPdfId,
  role,
  content,
}: {
  chatPdfId: string;
  role: "user" | "assistant";
  content: string;
}) {
  const [msg] = await db
    .insert(chatMessages)
    .values({ chatPdfId, role, content })
    .returning({
      id: chatMessages.id,
      role: chatMessages.role,
      content: chatMessages.content,
      createdAt: chatMessages.createdAt,
    });

  return msg;
}

export async function getChatMessages(chatPdfId: string) {
  return db
    .select({
      id: chatMessages.id,
      role: chatMessages.role,
      content: chatMessages.content,
      createdAt: chatMessages.createdAt,
    })
    .from(chatMessages)
    .where(eq(chatMessages.chatPdfId, chatPdfId))
    .orderBy(asc(chatMessages.createdAt));
}
```

---

## Step 7 — Inngest Background Function (the Worker)

### `lib/inngest-functions.ts` ← **NEW FILE**

Includes granular status updates so the frontend can show real-time progress via toasts.

```typescript
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { CharacterTextSplitter } from "@langchain/textsplitters";

import { insertChunks, updateChatPdfStatus } from "@/lib/chat-db";
import { embedBatch } from "@/lib/embeddings";
import { inngest } from "@/lib/inngest";

export const processPdfForChat = inngest.createFunction(
  { id: "process-pdf-for-chat", retries: 2 },
  { event: "pdf/chat.uploaded" },
  async ({ event, step }) => {
    const { chatPdfId, fileUrl } = event.data as {
      chatPdfId: string;
      fileUrl: string;
    };

    // ── Stage 1: Parsing ────────────────────────────────────────
    const docs = await step.run("parse-pdf", async () => {
      await updateChatPdfStatus(chatPdfId, "parsing");
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const loader = new PDFLoader(new Blob([arrayBuffer]));
      return loader.load();
    });

    // ── Stage 2: Chunking ───────────────────────────────────────
    const chunks = await step.run("chunk-text", async () => {
      await updateChatPdfStatus(chatPdfId, "chunking");
      const splitter = new CharacterTextSplitter({
        separator: "\n",
        chunkSize: 1000,
        chunkOverlap: 200,
      });
      const splitDocs = await splitter.splitDocuments(docs);
      return splitDocs.map((doc) => ({
        content: doc.pageContent,
        pageNumber: doc.metadata?.loc?.pageNumber ?? null,
      }));
    });

    // ── Stage 3: Embedding + storing ────────────────────────────
    await step.run("embed-and-store", async () => {
      await updateChatPdfStatus(chatPdfId, "embedding");
      const texts = chunks.map((c) => c.content);
      const embeddings = await embedBatch(texts);
      const enrichedChunks = chunks.map((chunk, i) => ({
        ...chunk,
        embedding: embeddings[i],
      }));
      await insertChunks(chatPdfId, enrichedChunks);
    });

    // ── Stage 4: Done ───────────────────────────────────────────
    await step.run("mark-ready", async () => {
      await updateChatPdfStatus(chatPdfId, "ready");
    });

    return { chatPdfId, chunksProcessed: chunks.length };
  }
);
```

---

## Step 8 — Inngest API Route (serves the Inngest worker)

### `app/api/inngest/route.ts` ← **NEW FILE**

```typescript
import { serve } from "inngest/next";

import { inngest } from "@/lib/inngest";
import { processPdfForChat } from "@/lib/inngest-functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [processPdfForChat],
});
```

---

## Step 9 — Server Action for Chat

### `actions/chat-actions.ts` ← **NEW FILE**

```typescript
"use server";

import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { chatPdfs, users } from "@/db/schema";
import { inngest } from "@/lib/inngest";

/**
 * Called after UploadThing completes.
 * Creates the chat_pdfs DB row + fires the Inngest event.
 */
export async function initiateChatPdf({
  fileUrl,
  fileName,
}: {
  fileUrl: string;
  fileName: string;
}) {
  const { userId } = await auth(); // Clerk ID
  if (!userId) return { success: false, message: "Unauthorized" };

  try {
    // Resolve Clerk ID → internal DB UUID
    const [dbUser] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.clerkId, userId));

    if (!dbUser) return { success: false, message: "User not found" };

    // Create chat_pdfs record with DB UUID
    const [record] = await db
      .insert(chatPdfs)
      .values({
        userId: dbUser.id,
        fileName,
        fileUrl,
        status: "processing",
      })
      .returning({ id: chatPdfs.id });

    // Fire Inngest event → triggers background processing
    await inngest.send({
      name: "pdf/chat.uploaded",
      data: { chatPdfId: record.id, fileUrl },
    });

    return { success: true, chatPdfId: record.id };
  } catch (error) {
    console.error("initiateChatPdf error:", error);
    return { success: false, message: "Failed to start PDF processing" };
  }
}
```

---

## Step 10 — API Routes for Chat

### `app/api/chat/[id]/status/route.ts` ← **NEW FILE**

Polled by the UI to know when the PDF is ready.

```typescript
import { NextRequest, NextResponse } from "next/server";

import { getChatPdfById } from "@/lib/chat-db";

export const GET = async (
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;

  const record = await getChatPdfById(id);
  if (!record) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ status: record.status });
};
```

---

### `app/api/chat/[id]/route.ts` ← **NEW FILE**

Main chat endpoint — receives a message, does RAG, returns an AI answer.

```typescript
import { NextRequest, NextResponse } from "next/server";

import { GoogleGenerativeAI } from "@google/generative-ai";

import {
  getChatMessages,
  saveChatMessage,
  similaritySearch,
} from "@/lib/chat-db";
import { embedText } from "@/lib/embeddings";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

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

    const context = relevantChunks.map((c) => c.content).join("\n\n---\n\n");

    // 4. Build conversation history for Gemini
    const history = await getChatMessages(chatPdfId);

    // 5. Call Gemini 2.5 Flash with RAG context
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const systemPrompt = `You are a helpful AI assistant answering questions about a PDF document.
Use ONLY the context below to answer. If the answer is not in the context, say so honestly.

Context from the document:
${context}`;

    const chat = model.startChat({
      history: history
        .slice(0, -1) // exclude the message we just saved
        .map((msg) => ({
          role: msg.role === "user" ? "user" : ("model" as const),
          parts: [{ text: msg.content }],
        })),
      systemInstruction: systemPrompt,
    });

    const result = await chat.sendMessage(message);
    const answer = result.response.text();

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
  } catch (error) {
    console.error("Chat API error:", error);
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
```

---

## Step 11 — Update DashboardClient.tsx (Chat Branch)

**File:** `app/(logged-in)/dashboard/DashboardClient.tsx`

**Add this import** at the top:

```typescript
import { initiateChatPdf } from "@/actions/chat-actions";
```

**Find the `else if (mode === "chat")` block** (lines ~150–184) and **replace it** with:

```typescript
} else if (mode === "chat") {
  setView("loading");

  try {
    toast("📄 Uploading PDF", {
      description: "We are preparing your document for chat.",
    });

    const resp = await startUpload([file]);
    if (!resp) {
      toast("❌ Something went wrong", {
        description: "Please use a different file",
      });
      setView("upload");
      return;
    }

    const fileUrl = resp[0].serverData.file.ufsUrl;
    const fileName = resp[0].serverData.file.name;

    // Create chat_pdfs record + fire Inngest event
    const result = await initiateChatPdf({ fileUrl, fileName });

    if (!result.success || !result.chatPdfId) {
      toast("❌ Something went wrong", {
        description: result.message || "Failed to start chat setup.",
      });
      setView("upload");
      return;
    }

    toast("⚙️ Processing PDF", {
      description: "Setting up your chat. This may take a moment...",
    });

    router.push(`/chat-pdf/${result.chatPdfId}`);
  } catch (error) {
    console.error("Error occurred", error);
    toast("❌ Something went wrong", {
      description: "An unexpected error occurred. Please try again.",
    });
    setView("upload");
  }
}
```

**Why this changed:** The old code used `crypto.randomUUID()` on the client and passed file info as query params. Now we create a real DB record via `initiateChatPdf` server action and use the database-generated UUID.

---

## Step 12 — Update middleware.ts (protect new routes)

**File:** `middleware.ts`

Add `/vault` and `/chat-pdf` to the protected routes array:

```typescript
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/summaries(.*)",
  "/upload(.*)",
  "/vault(.*)", // ← ADD
  "/chat-pdf(.*)", // ← ADD
]);
```

---

## Step 13 — ChatPageSkeleton Component

### `components/chat/ChatPageSkeleton.tsx` ← **NEW FILE**

Displayed while the PDF is being processed. Shows ghost message bubbles + live status label.

```typescript
"use client";

import { motion } from "framer-motion";

import { Skeleton } from "@/components/ui/skeleton";

export default function ChatPageSkeleton({
  statusLabel,
}: {
  statusLabel: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex h-full min-h-0 flex-col overflow-hidden"
    >
      {/* File badge skeleton */}
      <div className="mb-4 flex items-center justify-center">
        <Skeleton className="h-7 w-52 rounded-full bg-white/5" />
      </div>

      {/* Status label */}
      <div className="mb-6 flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 rounded-full border border-[#0CF2A0]/20 bg-[#0CF2A0]/5 px-4 py-1.5">
          <motion.span
            className="h-2 w-2 rounded-full bg-[#0CF2A0]"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
          <span className="text-xs font-medium text-[#0CF2A0]">
            {statusLabel}
          </span>
        </div>
      </div>

      {/* Fake message bubbles — assistant */}
      <div className="flex-1 space-y-5 px-1">
        {/* Ghost assistant message 1 */}
        <div className="flex gap-3">
          <Skeleton className="mt-1 h-8 w-8 shrink-0 rounded-md bg-[#0CF2A0]/10" />
          <div className="flex flex-col gap-2 pt-1">
            <Skeleton className="h-4 w-72 rounded-lg bg-white/5" />
            <Skeleton className="h-4 w-56 rounded-lg bg-white/5" />
            <Skeleton className="h-4 w-64 rounded-lg bg-white/5" />
          </div>
        </div>

        {/* Ghost user message */}
        <div className="flex justify-end gap-3">
          <div className="flex flex-col items-end gap-2 pt-1">
            <Skeleton className="h-4 w-48 rounded-lg bg-white/5" />
            <Skeleton className="h-4 w-36 rounded-lg bg-white/5" />
          </div>
          <Skeleton className="mt-1 h-8 w-8 shrink-0 rounded-md bg-white/5" />
        </div>

        {/* Ghost assistant message 2 */}
        <div className="flex gap-3">
          <Skeleton className="mt-1 h-8 w-8 shrink-0 rounded-md bg-[#0CF2A0]/10" />
          <div className="flex flex-col gap-2 pt-1">
            <Skeleton className="h-4 w-80 rounded-lg bg-white/5" />
            <Skeleton className="h-4 w-60 rounded-lg bg-white/5" />
            <Skeleton className="h-4 w-44 rounded-lg bg-white/5" />
            <Skeleton className="h-4 w-52 rounded-lg bg-white/5" />
          </div>
        </div>
      </div>

      {/* Disabled input skeleton */}
      <div className="mt-3 shrink-0">
        <div className="overflow-hidden rounded-2xl border border-gray-700/30 bg-[#1a1a1a]">
          <Skeleton className="mx-4 mt-4 mb-2 h-5 w-48 rounded bg-white/5" />
          <div className="flex items-center justify-between px-3 pb-3">
            <Skeleton className="h-6 w-24 rounded-md bg-white/5" />
            <Skeleton className="h-8 w-8 rounded-xl bg-white/5" />
          </div>
        </div>
        <Skeleton className="mx-auto mt-2 h-3 w-64 rounded bg-white/3" />
      </div>
    </motion.div>
  );
}
```

---

## Step 14 — Updated ChatPage.tsx (Toasts + Skeleton + Real API)

### `components/chat/ChatPage.tsx` ← **REPLACE ENTIRE FILE**

**What changed:**

- Polls `/api/chat/[id]/status` until `"ready"`
- Uses `prevStatusRef` to fire toasts only on **status transitions**
- Maps each status → toast + skeleton label
- Shows `ChatPageSkeleton` during all processing states
- Loads existing messages via GET `/api/chat/[id]` when ready
- Sends messages via POST `/api/chat/[id]`
- Uses **camelCase** for Drizzle column names (`m.createdAt` not `m.created_at`)

```typescript
"use client";

import React, { useEffect, useRef, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown,
  Bot,
  FileText,
  MessageSquare,
  Send,
  Sparkles,
  User,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import ChatPageSkeleton from "@/components/chat/ChatPageSkeleton";

type ProcessingStatus =
  | "processing"
  | "parsing"
  | "chunking"
  | "embedding"
  | "ready"
  | "error";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp?: number | string;
}

interface ChatPageProps {
  fileName: string;
  chatId: string;
  originalFileUrl?: string;
  initialMessages?: ChatMessage[];
}

const SUGGESTIONS = [
  "What is this document about?",
  "What are the key points?",
  "Give me a quick summary.",
];

// Maps each status → skeleton label shown below the pulsing dot
const STATUS_LABELS: Record<ProcessingStatus, string> = {
  processing: "Initialising...",
  parsing: "Reading your PDF...",
  chunking: "Splitting into sections...",
  embedding: "Creating vector embeddings...",
  ready: "Ready",
  error: "Failed",
};

// Maps each status → toast message fired once on transition
const STATUS_TOASTS: Partial<
  Record<ProcessingStatus, { title: string; description: string }>
> = {
  parsing: {
    title: "📄 Reading PDF",
    description: "Extracting text from your document...",
  },
  chunking: {
    title: "✂️ Splitting content",
    description: "Breaking document into searchable sections...",
  },
  embedding: {
    title: "🧠 Creating embeddings",
    description: "Building vector index for smart search...",
  },
  ready: {
    title: "✅ Chat is ready!",
    description: "Your PDF has been indexed. Start asking questions!",
  },
  error: {
    title: "❌ Processing failed",
    description: "Something went wrong. Please try uploading again.",
  },
};

function formatMessageTime(ts?: number | string): string {
  const t = typeof ts === "string" ? Number(ts) : ts;
  if (!t || !Number.isFinite(t)) return "";
  return new Date(t).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const ChatPage: React.FC<ChatPageProps> = ({ fileName, chatId }) => {
  const [status, setStatus] = useState<ProcessingStatus>("processing");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevStatusRef = useRef<ProcessingStatus>("processing");

  // ── Poll status + show toasts on transitions ───────────────────
  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch(`/api/chat/${chatId}/status`);
        const data: { status: ProcessingStatus } = await res.json();
        const incoming = data.status;

        // Only act if status actually changed
        if (incoming !== prevStatusRef.current) {
          prevStatusRef.current = incoming;
          setStatus(incoming);

          // Fire a toast for this specific transition
          const toastData = STATUS_TOASTS[incoming];
          if (toastData) {
            toast(toastData.title, { description: toastData.description });
          }

          if (incoming === "ready" || incoming === "error") {
            if (pollRef.current) clearInterval(pollRef.current);

            // Load existing messages when ready
            if (incoming === "ready") {
              const msgRes = await fetch(`/api/chat/${chatId}`);
              const msgData = await msgRes.json();
              if (msgData.messages) {
                setMessages(
                  msgData.messages.map((m: any) => ({
                    id: m.id,
                    role: m.role,
                    content: m.content,
                    timestamp: new Date(m.createdAt).getTime(),
                  }))
                );
              }
            }
          }
        }
      } catch {
        // silently retry
      }
    };

    poll();
    pollRef.current = setInterval(poll, 3000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 100);
  };

  const handleSend = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || isTyping || status !== "ready") return;

    const now = Date.now();
    const userMsg: ChatMessage = {
      id: now.toString(),
      role: "user",
      content: msg,
      timestamp: now,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    try {
      const res = await fetch(`/api/chat/${chatId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.message || "Sorry, I couldn't generate a response.",
          timestamp: Date.now(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Something went wrong. Please try again.",
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };

  // ── Skeleton while processing ──────────────────────────────────
  if (status !== "ready" && status !== "error") {
    return <ChatPageSkeleton statusLabel={STATUS_LABELS[status]} />;
  }

  // ── Error state ────────────────────────────────────────────────
  if (status === "error") {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
        <p className="text-red-400">
          Failed to process PDF. Please try uploading again.
        </p>
      </div>
    );
  }

  // ── Chat UI (status === "ready") ───────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex h-full min-h-0 flex-col overflow-hidden"
    >
      {/* File badge */}
      <div className="mb-4 flex items-center justify-center gap-2">
        <div className="flex items-center gap-2 rounded-full border border-gray-700/60 bg-[#1a1a1a] px-4 py-1.5">
          <FileText className="h-3.5 w-3.5 text-[#0CF2A0]" />
          <span className="max-w-50 truncate text-sm text-gray-400">
            {fileName}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="relative min-h-0 flex-1 space-y-1 overflow-y-auto scroll-smooth px-1"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#333 transparent" }}
      >
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center px-4 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0CF2A0]/10">
              <MessageSquare className="h-8 w-8 text-[#0CF2A0]" />
            </div>
            <h2 className="mb-2 text-xl font-semibold text-white">
              Chat with your PDF
            </h2>
            <p className="mb-8 max-w-sm text-sm text-gray-500">
              Ask questions about your document and get instant AI-powered
              answers.
            </p>
            <div className="flex w-full max-w-sm flex-col gap-2">
              {SUGGESTIONS.map((suggestion, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  onClick={() => handleSend(suggestion)}
                  className="group rounded-xl border border-gray-700/60 bg-[#1a1a1a]/50 px-4 py-3 text-left text-sm text-gray-400 transition-all hover:border-[#0CF2A0]/40 hover:bg-[#0CF2A0]/5 hover:text-gray-200"
                >
                  <span className="mr-2 text-[#0CF2A0] transition-all group-hover:mr-3">
                    →
                  </span>
                  {suggestion}
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#0CF2A0]/10">
                    <Bot className="h-4 w-4 text-[#0CF2A0]" />
                  </div>
                )}
                <div
                  className={`flex max-w-[80%] flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "rounded-br-md bg-[#0CF2A0] text-[#111111]"
                        : "rounded-bl-md border border-gray-700/60 bg-[#1a1a1a] text-gray-300"
                    }`}
                  >
                    {msg.content}
                  </div>
                  {msg.timestamp && (
                    <span
                      className={`mt-1 block px-1 text-[11px] text-gray-500 ${msg.role === "user" ? "text-right" : "text-left"}`}
                    >
                      {formatMessageTime(msg.timestamp)}
                    </span>
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gray-700/50">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                )}
              </motion.div>
            ))}

            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#0CF2A0]/10">
                  <Bot className="h-4 w-4 text-[#0CF2A0]" />
                </div>
                <div className="rounded-2xl rounded-bl-md border border-gray-700/60 bg-[#1a1a1a] px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    {[0, 0.2, 0.4].map((delay, i) => (
                      <motion.span
                        key={i}
                        className="h-2 w-2 rounded-full bg-[#0CF2A0]/60"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        <AnimatePresence>
          {showScrollBtn && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() =>
                messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
              }
              className="sticky bottom-4 left-1/2 z-10 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border border-gray-700 bg-[#1a1a1a] transition-colors hover:bg-gray-800"
            >
              <ArrowDown className="h-4 w-4 text-gray-400" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Input */}
      <div className="relative mt-3 shrink-0">
        <div className="overflow-hidden rounded-2xl border border-gray-700/60 bg-[#1a1a1a] transition-colors focus-within:border-[#0CF2A0]/40">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about your PDF..."
            rows={1}
            disabled={isTyping}
            className="max-h-40 min-h-11 w-full resize-none bg-transparent px-4 pt-4 pb-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none disabled:opacity-50"
          />
          <div className="flex items-center justify-between px-3 pb-3">
            <span className="flex items-center gap-1.5 rounded-md bg-[#111111]/50 px-2 py-1 text-xs text-gray-600">
              <Sparkles className="h-3 w-3" />
              AI-powered
            </span>
            <Button
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              size="icon"
              className="h-8 w-8 rounded-xl bg-[#0CF2A0] text-[#111111] transition-all hover:bg-[#0CF2A0]/90 disabled:bg-gray-700 disabled:opacity-30"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="mt-2 text-center text-[11px] text-gray-600">
          AI responses are generated from your document content
        </p>
      </div>
    </motion.div>
  );
};

export default ChatPage;
```

---

## Step 15 — Update chat-pdf/[id]/page.tsx

### `app/(logged-in)/chat-pdf/[id]/page.tsx` ← **REPLACE ENTIRE FILE**

The old version fetched `fileName`/`fileUrl` from query params or `pdf_summaries`.
The new version loads the `chat_pdfs` record directly.

```typescript
import { notFound } from "next/navigation";

import ChatPage from "@/components/chat/ChatPage";
import { getChatPdfById } from "@/lib/chat-db";

const ChatPdfPage = async (props: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await props.params;
  const chatPdf = await getChatPdfById(id);

  if (!chatPdf) notFound();

  return (
    <main className="mx-auto mt-15 h-[calc(100dvh-60px)] max-w-5xl overflow-hidden px-6 py-4">
      <ChatPage
        chatId={id}
        fileName={chatPdf.fileName}
        originalFileUrl={chatPdf.fileUrl}
      />
    </main>
  );
};

export default ChatPdfPage;
```

---

## Summary of All Files Changed / Created

| File                                            | Action                                       |
| ----------------------------------------------- | -------------------------------------------- |
| `lib/inngest.ts`                                | 🆕 New                                       |
| `lib/embeddings.ts`                             | 🆕 New                                       |
| `lib/chat-db.ts`                                | 🆕 New (Drizzle ORM)                         |
| `lib/inngest-functions.ts`                      | 🆕 New (with granular status)                |
| `app/api/inngest/route.ts`                      | 🆕 New                                       |
| `app/api/chat/[id]/route.ts`                    | 🆕 New                                       |
| `app/api/chat/[id]/status/route.ts`             | 🆕 New                                       |
| `actions/chat-actions.ts`                       | 🆕 New (Drizzle + clerkId → dbUserId)        |
| `components/chat/ChatPageSkeleton.tsx`          | 🆕 New                                       |
| `app/(logged-in)/dashboard/DashboardClient.tsx` | ✏️ Modify (chat branch → server action)      |
| `app/(logged-in)/chat-pdf/[id]/page.tsx`        | ✏️ Replace (loads from chat_pdfs table)      |
| `components/chat/ChatPage.tsx`                  | ✏️ Replace (toasts + skeleton + real API)    |
| `middleware.ts`                                 | ✏️ Modify (add `/vault`, `/chat-pdf` routes) |

---

## Implementation Order

```
 1. npm install inngest @langchain/textsplitters
 2. Add env vars to .env
 3. Run HNSW index SQL in Neon SQL Editor
 4. Create lib/inngest.ts
 5. Create lib/embeddings.ts
 6. Create lib/chat-db.ts
 7. Create lib/inngest-functions.ts
 8. Create app/api/inngest/route.ts
 9. Create actions/chat-actions.ts
10. Create app/api/chat/[id]/route.ts
11. Create app/api/chat/[id]/status/route.ts
12. Update DashboardClient.tsx (chat branch)
13. Update middleware.ts
14. Create components/chat/ChatPageSkeleton.tsx
15. Replace components/chat/ChatPage.tsx
16. Replace app/(logged-in)/chat-pdf/[id]/page.tsx
17. yarn dev — verify no TypeScript errors
```

---

## Toast Notification Flow (what the user sees)

```
[upload starts]       → 📄 "Uploading PDF"         (from DashboardClient)
[Inngest picks up]    → ⚙️ "Processing PDF"        (from DashboardClient before redirect)
[status = parsing]    → 📄 "Reading PDF"            (from ChatPage status poll)
[status = chunking]   → ✂️ "Splitting content"      (from ChatPage status poll)
[status = embedding]  → 🧠 "Creating embeddings"    (from ChatPage status poll)
[status = ready]      → ✅ "Chat is ready!"          (from ChatPage status poll)
```

Between each toast, the user sees the `ChatPageSkeleton` with a live label matching the current stage.

---

## Local Development with Inngest

For local development, Inngest runs a dev server that receives events:

```bash
# Terminal 1: Next.js dev server
yarn dev

# Terminal 2: Inngest dev server (auto-discovers your /api/inngest route)
npx inngest-cli@latest dev
```

Then open http://localhost:8288 to see the Inngest dashboard where you can monitor function runs.

---

## Verification Steps

1. `npm install inngest @langchain/textsplitters` → no errors.
2. `yarn dev` + `npx inngest-cli@latest dev` → both run, Inngest dashboard at `http://localhost:8288` shows `process-pdf-for-chat` function.
3. Sign in → upload PDF in **Chat mode** → confirm toast sequence: "Uploading PDF" → "Processing PDF" → redirect to `/chat-pdf/[id]`.
4. On ChatPage: skeleton appears with live labels ("Reading PDF..." → "Splitting content..." → "Creating embeddings...").
5. Toasts fire for each stage transition.
6. Status = "ready": skeleton fades, real chat UI appears, "Chat is ready!" toast fires.
7. Type a question → real Gemini answer with RAG context.
8. Reload page → previous messages load from DB.
9. Check Neon: `chat_pdfs` has a row with `status = 'ready'`, `pdf_chunks` has rows with embeddings, `chat_messages` has the conversation.
