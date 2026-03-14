import { relations } from "drizzle-orm";
import { customType } from "drizzle-orm/pg-core";
import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

// user table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkId: text("clerk_id").notNull().unique(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// subscription table
export const subscriptions = pgTable("subscription", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  priceId: text("price_id"),
  status: text("status").notNull().default("active"),
  currentPeriodEnd: timestamp("current_period_end"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// pdf-summaries table
export const pdfSummaries = pgTable("pdf_summaries", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  originalFileUrl: text("original_file_url"),
  title: text("title"),
  summaryText: text("summary_text"),
  fileName: text("file_name"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// chat-pdf table
export const chatPdfs = pgTable("chat_pdf", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  status: text("status").notNull().default("processing"), // status values: processing | parsing | chunking | embedding | ready | error
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Custom vector type for pgvector
const vector = (name: string, dimensions: number) =>
  customType<{ data: number[] }>({
    dataType() {
      return `vector(${dimensions})`;
    },
    toDriver(value: number[]): string {
      return `[${value.join(",")}]`;
    },
    fromDriver(value: unknown): number[] {
      return (value as string).slice(1, -1).split(",").map(Number);
    },
  })(name);

// pdf-chunks table
export const pdfChunks = pgTable("pdf_chunks", {
  id: uuid("id").primaryKey().defaultRandom(),
  chatPdfId: uuid("chat_pdf_id")
    .notNull()
    .references(() => chatPdfs.id, {
      onDelete: "cascade",
    }),
  content: text("content").notNull(),
  embedding: vector("embedding", 768), // Gemini text-embedding-004 → 768 dims
  pageNumber: integer("page_number"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// chat-messages table
export const chatMessages = pgTable("chat_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  chatPdfId: uuid("chat_pdf_id")
    .notNull()
    .references(() => chatPdfs.id, {
      onDelete: "cascade",
    }),
  role: text("role").notNull(), // user | assistant
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Relations
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

export const chatPdfRelations = relations(chatPdfs, ({ one, many }) => ({
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

// export type
export type User = typeof users.$inferSelect;
export type Subscription = typeof subscriptions.$inferSelect;
export type PdfSummary = typeof pdfSummaries.$inferSelect;
export type ChatPdf = typeof chatPdfs.$inferSelect;
export type PdfChunk = typeof pdfChunks.$inferSelect;
export type ChatMessage = typeof chatMessages.$inferSelect;

//
export type ChatPdfStatus =
  | "processing"
  | "parsing"
  | "chunking"
  | "embedding"
  | "ready"
  | "error";
