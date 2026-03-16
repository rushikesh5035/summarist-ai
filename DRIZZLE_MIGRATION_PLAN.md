# Drizzle ORM — Full Project Migration Plan

**Replaces:** All raw `neon` SQL template literals across the project  
**Stack:** `drizzle-orm` + `drizzle-kit` + `drizzle-orm/neon-http`

> ✅ Verified against official [Drizzle + Next.js + Neon tutorial](https://orm.drizzle.team/docs/tutorials/drizzle-nextjs-neon)

---

## Why Drizzle + Neon is the Best Fit

```
Current:  getDBConnection() → neon(url) → sql`raw query`
After:    db (drizzle instance) → db.select().from(table).where(eq(...))
```

- Same `@neondatabase/serverless` driver under the hood — no new DB infra
- Full TypeScript inference on all queries, schema, and results
- `drizzle-kit` generates migration SQL from your schema — no manual SQL needed
- `customType` API supports `vector` columns for pgvector (pdf_chunks table)

---

## Step 1 — Install Dependencies

```bash
yarn add drizzle-orm
yarn add -D drizzle-kit
```

> `@neondatabase/serverless` is already installed — no change needed there.

---

## Step 2 — Drizzle Config File

### `drizzle.config.ts` ← **ALREADY CREATED** (project root)

> 📌 **Doc change:** The official tutorial imports `dotenv/config` at the top of `drizzle.config.ts` so env vars are available when drizzle-kit resolves the config file (outside Next.js runtime).

```typescript
import "dotenv/config";
// ← required by docs
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

> Update the file you already created to add the `import "dotenv/config"` at the top. You'll also need to install dotenv: `yarn add dotenv`

---

## Step 3 — Full Database Schema

### `db/schema.ts` ← **REPLACE entire file**

#### Design Decisions

Since we use **Clerk for auth**, our DB doesn't store passwords or auth tokens. Clerk is the source of truth for identity. We only store what Clerk doesn't own:

| What Clerk stores     | What we store in Neon              |
| --------------------- | ---------------------------------- |
| Name, email, avatar   | `clerk_id` (to link back to Clerk) |
| Auth tokens, sessions | Stripe `customer_id`, `price_id`   |
| OAuth providers       | Upload history, chat history       |

#### Schema Diagram

```
users (clerk_id → links to Clerk)
 ├── subscriptions (1:many → Stripe subscription events)
 ├── pdf_summaries (1:many → summary feature)
 └── chat_pdfs    (1:many → chat feature)
       ├── pdf_chunks   (1:many → vector embeddings)
       └── chat_messages (1:many → conversation history)
```

#### Full Schema Code

```typescript
import { relations } from "drizzle-orm";
import { customType } from "drizzle-orm/pg-core";
import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

// ── Custom vector type for pgvector ─────────────────────────────
const vector = (name: string, dimensions: number) =>
  customType<{ data: number[] }>({
    dataType() {
      return `vector(${dimensions})`;
    },
    toDriver(value: number[]): string {
      return `[${value.join(",")}]`;
    },
    fromDriver(value: string): number[] {
      return value.slice(1, -1).split(",").map(Number);
    },
  })(name);

// ── users ────────────────────────────────────────────────────────
// Minimal table — Clerk handles name/email/avatar/auth.
// We store only what we need for our own features.
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkId: text("clerk_id").notNull().unique(), // Clerk's user.id e.g. "user_2abc"
  email: text("email").notNull().unique(), // needed for Stripe webhook matching
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ── subscriptions ────────────────────────────────────────────────
// Separate from users — a user can have a history of subscriptions.
// Stripe data lives here, not on the users table.
export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  stripeCustomerId: text("stripe_customer_id").notNull(),
  stripeSubscriptionId: text("stripe_subscription_id"),
  priceId: text("price_id"), // Stripe price ID → maps to plan
  status: text("status").notNull().default("active"), // active | cancelled | past_due
  currentPeriodEnd: timestamp("current_period_end"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ── pdf_summaries ────────────────────────────────────────────────
export const pdfSummaries = pgTable("pdf_summaries", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  originalFileUrl: text("original_file_url"),
  summaryText: text("summary_text"),
  title: text("title"),
  fileName: text("file_name"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ── chat_pdfs ────────────────────────────────────────────────────
export const chatPdfs = pgTable("chat_pdfs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  status: text("status").notNull().default("processing"),
  // status values: processing | parsing | chunking | embedding | ready | error
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ── pdf_chunks ───────────────────────────────────────────────────
// Child of chat_pdfs — stores vector embeddings per chunk
export const pdfChunks = pgTable("pdf_chunks", {
  id: uuid("id").primaryKey().defaultRandom(),
  chatPdfId: uuid("chat_pdf_id")
    .notNull()
    .references(() => chatPdfs.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  embedding: vector("embedding", 768), // Gemini text-embedding-004 = 768 dims
  pageNumber: integer("page_number"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ── chat_messages ────────────────────────────────────────────────
// Child of chat_pdfs — stores the full conversation history
export const chatMessages = pgTable("chat_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  chatPdfId: uuid("chat_pdf_id")
    .notNull()
    .references(() => chatPdfs.id, { onDelete: "cascade" }),
  role: text("role").notNull(), // 'user' | 'assistant'
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ── Relations (for Drizzle joins) ────────────────────────────────
export const usersRelations = relations(users, ({ many }) => ({
  subscriptions: many(subscriptions),
  pdfSummaries: many(pdfSummaries),
  chatPdfs: many(chatPdfs),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, { fields: [subscriptions.userId], references: [users.id] }),
}));

export const pdfSummariesRelations = relations(pdfSummaries, ({ one }) => ({
  user: one(users, { fields: [pdfSummaries.userId], references: [users.id] }),
}));

export const chatPdfsRelations = relations(chatPdfs, ({ one, many }) => ({
  user: one(users, { fields: [chatPdfs.userId], references: [users.id] }),
  chunks: many(pdfChunks),
  messages: many(chatMessages),
}));

export const pdfChunksRelations = relations(pdfChunks, ({ one }) => ({
  chatPdf: one(chatPdfs, {
    fields: [pdfChunks.chatPdfId],
    references: [chatPdfs.id],
  }),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  chatPdf: one(chatPdfs, {
    fields: [chatMessages.chatPdfId],
    references: [chatPdfs.id],
  }),
}));

// ── Inferred types ───────────────────────────────────────────────
export type User = typeof users.$inferSelect;
export type Subscription = typeof subscriptions.$inferSelect;
export type PdfSummary = typeof pdfSummaries.$inferSelect;
export type ChatPdf = typeof chatPdfs.$inferSelect;
export type ChatMessage = typeof chatMessages.$inferSelect;

export type ChatPdfStatus =
  | "processing"
  | "parsing"
  | "chunking"
  | "embedding"
  | "ready"
  | "error";
```

> **Why `users.id` (UUID) and not `users.clerk_id` (text) as the FK?**  
> UUIDs are faster for joins and indexed better. We look users up by `clerk_id`, but relate everything else by `id`.

---

## Step 4 — Drizzle DB Client

### `db/drizzle.ts` ← **ALREADY CREATED**

> 📌 **Doc change 1:** The official tutorial names this file `drizzle.ts` (not `index.ts`) for clarity — import path becomes `@/db/drizzle`.

> 📌 **Doc change 2:** `drizzle-orm/neon-http` accepts the `DATABASE_URL` string **directly** — no need to manually call `neon()` first. Drizzle handles the Neon adapter internally.

```typescript
import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

export const db = drizzle(process.env.DATABASE_URL!, { schema });
```

That's it — 3 lines. Much cleaner than our original version.

---

## Step 5 — Replace `lib/user.ts`

> All db imports use `@/db/drizzle`. The key change: we now look up/create users by `clerk_id`, and look up subscriptions to determine plan instead of querying `users.price_id`.

```typescript
import { User as ClerkUser, currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { count, sql } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { pdfSummaries, subscriptions, users } from "@/db/schema";
import { PLAN_LIMITS, pricingPlans } from "@/utils/constants";

/**
 * Called on every logged-in page load.
 * Creates a minimal user row the first time a Clerk user signs in.
 */
export const ensureFreeUserExists = async (user: ClerkUser) => {
  try {
    const email = user.emailAddresses[0].emailAddress;
    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.clerkId, user.id)); // ← look up by clerkId, not email

    if (existing.length === 0) {
      await db.insert(users).values({
        clerkId: user.id,
        email,
      });
    }
  } catch (error) {
    console.error("Error ensuring free user exists:", error);
  }
};

/**
 * Returns the internal UUID of a user by their Clerk ID.
 */
export const getDbUserId = async (clerkId: string): Promise<string | null> => {
  const [user] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.clerkId, clerkId));

  return user?.id ?? null;
};

/**
 * Gets the active subscription for a user (by their internal DB user ID).
 */
export const getActiveSubscription = async (dbUserId: string) => {
  const [sub] = await db
    .select()
    .from(subscriptions)
    .where(
      and(
        eq(subscriptions.userId, dbUserId),
        eq(subscriptions.status, "active")
      )
    );

  return sub ?? null;
};

/**
 * Returns true if user has a paid, active subscription.
 */
export const hasActivePlan = async (dbUserId: string): Promise<boolean> => {
  const sub = await getActiveSubscription(dbUserId);
  return sub !== null;
};

/**
 * Checks if a user has hit their monthly upload limit.
 * Uses Clerk userId (text) for summaries lookup + DB user UUID for subscription.
 */
export const hasReachedUploadLimit = async (
  clerkId: string, // Clerk user.id
  dbUserId: string // our internal users.id UUID
) => {
  // Count summaries this month
  const [result] = await db.select({ count: count() }).from(pdfSummaries)
    .where(sql`
      ${pdfSummaries.userId} = ${dbUserId}
      AND ${pdfSummaries.createdAt} >= date_trunc('month', NOW())
    `);
  const uploadCount = Number(result?.count ?? 0);

  // Find plan from active subscription
  const sub = await getActiveSubscription(dbUserId);
  const planId =
    pricingPlans.find((p) => p.priceId === sub?.priceId)?.id ?? "free";
  const limit = PLAN_LIMITS[planId]?.summaries ?? 2;

  return {
    hasReachedLimit: uploadCount >= limit,
    uploadLimit: limit,
    uploadCount,
    planId,
  };
};
```

---

## Step 6 — Replace `lib/payments.ts`

> Now upserts into `subscriptions` table instead of storing Stripe data on `users`.

```typescript
import { eq } from "drizzle-orm";
import Stripe from "stripe";

import { db } from "@/db/drizzle";
import { subscriptions, users } from "@/db/schema";

export const handleCheckoutSessionCompleted = async ({
  session,
  stripe,
}: {
  session: Stripe.Checkout.Session;
  stripe: Stripe;
}) => {
  const customerId = session.customer as string;
  const customer = await stripe.customers.retrieve(customerId);
  const priceId = session.line_items?.data[0].price?.id;

  if ("email" in customer && customer.email && priceId) {
    // 1. Find user by email
    const [user] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, customer.email));

    if (!user) {
      console.error("No user found for email:", customer.email);
      return;
    }

    // 2. Upsert subscription record
    const existingSub = await db
      .select({ id: subscriptions.id })
      .from(subscriptions)
      .where(eq(subscriptions.stripeCustomerId, customerId));

    if (existingSub.length === 0) {
      await db.insert(subscriptions).values({
        userId: user.id,
        stripeCustomerId: customerId,
        stripeSubscriptionId: (session.subscription as string) ?? null,
        priceId,
        status: "active",
        updatedAt: new Date(),
      });
    } else {
      await db
        .update(subscriptions)
        .set({ priceId, status: "active", updatedAt: new Date() })
        .where(eq(subscriptions.stripeCustomerId, customerId));
    }
  }
};

export const handleSubscriptionDeleted = async ({
  subscriptionId,
  stripe,
}: {
  subscriptionId: string;
  stripe: Stripe;
}) => {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    await db
      .update(subscriptions)
      .set({ status: "cancelled", updatedAt: new Date() })
      .where(
        eq(subscriptions.stripeCustomerId, subscription.customer as string)
      );
  } catch (error) {
    console.error("Error handling subscription deleted:", error);
  }
};
```

---

## Step 7 — Replace `lib/summaries.ts`

> `userId` in pdf_summaries now references `users.id` (UUID), not the Clerk user ID string.

```typescript
import { count, desc, eq, sql } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { pdfSummaries } from "@/db/schema";

export async function getSummaries(dbUserId: string) {
  return db
    .select()
    .from(pdfSummaries)
    .where(eq(pdfSummaries.userId, dbUserId))
    .orderBy(desc(pdfSummaries.createdAt));
}

export async function getSummaryById(id: string) {
  const [summary] = await db
    .select({
      id: pdfSummaries.id,
      userId: pdfSummaries.userId,
      originalFileUrl: pdfSummaries.originalFileUrl,
      summaryText: pdfSummaries.summaryText,
      title: pdfSummaries.title,
      fileName: pdfSummaries.fileName,
      createdAt: pdfSummaries.createdAt,
      wordCount: sql<number>`
        LENGTH(${pdfSummaries.summaryText})
        - LENGTH(REPLACE(${pdfSummaries.summaryText}, ' ', ''))
        + 1
      `.as("word_count"),
    })
    .from(pdfSummaries)
    .where(eq(pdfSummaries.id, id));

  return summary ?? null;
}
```

---

## Step 8 — Replace `actions/upload-actions.ts` (DB part only)

Only the `savedPdfSummary` function changes. Before inserting, resolve the internal DB user ID from the Clerk user ID:

```typescript
// Inside upload-actions.ts — update the savedPdfSummary function:

async function savedPdfSummary({
  userId, // ← this is the Clerk user.id (string like "user_2abc")
  fileUrl,
  summary,
  title,
  fileName,
}: PdfSummaryType) {
  try {
    // Resolve internal UUID from Clerk ID
    const [dbUser] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.clerkId, userId));

    if (!dbUser) throw new Error("User not found in DB");

    const [saved] = await db
      .insert(pdfSummaries)
      .values({
        userId: dbUser.id, // ← UUID FK, not Clerk ID
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
    console.log("Error saving PDF Summary");
    throw error;
  }
}
```

Add these imports at the top of `upload-actions.ts`:

```typescript
import { eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { pdfSummaries, users } from "@/db/schema";
```

---

## Step 9 — Replace `actions/summary-actions.ts` (Delete action)

```typescript
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

    // Resolve internal UUID
    const [dbUser] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.clerkId, clerkUser.id));

    if (!dbUser) return { success: false };

    const result = await db
      .delete(pdfSummaries)
      .where(
        and(
          eq(pdfSummaries.id, summaryId),
          eq(pdfSummaries.userId, dbUser.id) // ← UUID FK
        )
      )
      .returning({ id: pdfSummaries.id });

    if (result.length > 0) {
      revalidatePath("/vault");
      return { success: true };
    }
    return { success: false };
  } catch (error) {
    console.error("Error deleting summary:", error);
    return { success: false };
  }
}
```

---

## Step 10 — Replace `lib/chat-db.ts` with Drizzle Version

> `userId` passed to chat functions should be the internal DB UUID (resolved via `getDbUserId()`).

```typescript
import { asc, eq, sql } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { chatMessages, chatPdfs, pdfChunks } from "@/db/schema";
import type { ChatPdfStatus } from "@/db/schema";

// ── Chat PDF record ──────────────────────────────────────────────

export async function createChatPdf({
  dbUserId,
  fileName,
  fileUrl,
}: {
  dbUserId: string;
  fileName: string;
  fileUrl: string;
}) {
  const [record] = await db
    .insert(chatPdfs)
    .values({ userId: dbUserId, fileName, fileUrl, status: "processing" })
    .returning({ id: chatPdfs.id, status: chatPdfs.status });

  return record;
}

export async function getChatPdfById(id: string) {
  const [record] = await db.select().from(chatPdfs).where(eq(chatPdfs.id, id));

  return record ?? null;
}

export async function updateChatPdfStatus(id: string, status: ChatPdfStatus) {
  await db.update(chatPdfs).set({ status }).where(eq(chatPdfs.id, id));
}

// ── Chunks / Embeddings ─────────────────────────────────────────

export async function insertChunks(
  chatPdfId: string,
  chunks: { content: string; embedding: number[]; pageNumber?: number | null }[]
) {
  const BATCH_SIZE = 50;
  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);
    await db.insert(pdfChunks).values(
      batch.map((c) => ({
        chatPdfId,
        content: c.content,
        embedding: c.embedding,
        pageNumber: c.pageNumber ?? null,
      }))
    );
  }
}

export async function similaritySearch(
  chatPdfId: string,
  queryEmbedding: number[],
  topK = 5
): Promise<{ content: string; page_number: number | null }[]> {
  // Raw SQL needed for <=> pgvector cosine operator
  const vectorLiteral = `[${queryEmbedding.join(",")}]`;
  const results = await db.execute(sql`
    SELECT content, page_number
    FROM pdf_chunks
    WHERE chat_pdf_id = ${chatPdfId}
    ORDER BY embedding <=> ${vectorLiteral}::vector
    LIMIT ${topK}
  `);
  return results.rows as { content: string; page_number: number | null }[];
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
    .returning();

  return msg;
}

export async function getChatMessages(chatPdfId: string) {
  return db
    .select()
    .from(chatMessages)
    .where(eq(chatMessages.chatPdfId, chatPdfId))
    .orderBy(asc(chatMessages.createdAt));
}
```

> **Note:** `similaritySearch` uses `db.execute(sql`...`)` for the `<=>` pgvector cosine operator which isn't expressible in Drizzle's query builder. Everything else uses full Drizzle ORM.

---

## Step 11 — Add Drizzle Scripts to `package.json`

Add these to the `"scripts"` section:

```json
"db:generate": "drizzle-kit generate",
"db:migrate":  "drizzle-kit migrate",
"db:push":     "drizzle-kit push",
"db:studio":   "drizzle-kit studio"
```

- `db:push` — push schema directly to Neon (fastest for development)
- `db:generate` + `db:migrate` — generate SQL migration files (recommended for production)
- `db:studio` — open Drizzle Studio in browser to browse your DB visually

---

## Step 12 — Delete `lib/db.ts`

Once all files are migrated, delete `lib/db.ts`. It's fully replaced by `db/drizzle.ts`.

---

## Summary of All Files

| File                                 | Action                                        |
| ------------------------------------ | --------------------------------------------- |
| `drizzle.config.ts`                  | ✏️ Add `import "dotenv/config"` at top        |
| `db/schema.ts`                       | ✅ Done                                       |
| `db/drizzle.ts`                      | ✅ Done                                       |
| `lib/user.ts`                        | ✅ Done                                       |
| `lib/payments.ts`                    | ✅ Done                                       |
| `lib/summaries.ts`                   | ✅ Done                                       |
| `actions/upload-actions.ts`          | ✏️ Replace `savedPdfSummary`                  |
| `actions/summary-actions.ts`         | ✏️ Replace `deleteSummaryAction`              |
| `actions/credits-actions.ts`         | ✏️ Pass `dbUserId` to `hasReachedUploadLimit` |
| `actions/chat-actions.ts`            | 🆕 New — create this file                     |
| `app/(logged-in)/dashboard/page.tsx` | ✏️ Resolve `dbUserId` before calling libs     |
| `lib/chat-db.ts`                     | 🆕 New — Drizzle version                      |
| `lib/db.ts`                          | 🗑️ Delete after done                          |
| `package.json`                       | ✏️ Add 4 drizzle-kit scripts                  |

---

4. db/drizzle.ts is already created ✅
5. Add scripts to package.json
6. Run: yarn db:push ← creates all tables in Neon
7. Rewrite lib/user.ts
8. Rewrite lib/payments.ts
9. Update actions/upload-actions.ts
10. Update actions/summary-actions.ts
11. Create lib/chat-db.ts (Drizzle version)
12. Test dev server: yarn dev
13. Delete lib/db.ts

```

> ⚠️ **Important:** `yarn db:push` will NOT drop existing tables or data — it only creates new tables/columns. Your existing `users`, `payments`, and `pdf_summaries` data is safe.

---

## Verification

1. `yarn db:push` → runs without errors, confirm in Neon dashboard that `chat_pdfs`, `pdf_chunks`, `chat_messages` tables are created.
2. `yarn dev` → app starts with no TypeScript/import errors.
3. Open `/dashboard` → summaries load (confirms `getSummaries` Drizzle query works).
4. Upload a PDF for summary → confirm it saves and redirects (confirms `savedPdfSummary` works).
5. Delete a summary from vault → confirms `deleteSummaryAction` works.
6. `yarn db:studio` → opens Drizzle Studio, visually inspect all 6 tables and their data.
```
