# Summarist.ai 📝🚀

**AI-powered SaaS for understanding PDFs faster. Upload a document, generate a structured summary, or chat with the PDF using a RAG pipeline backed by Gemini embeddings and pgvector.**

![Summarist.ai Preview](./public/preview.png)


## 🚀 Features

### Core Features

- 🤖 **AI-Powered Summaries**: Turn PDFs into structured summaries with key points, sections, and action items.
- 💬 **Chat with PDF**: Ask questions and get context-aware answers from your documents.
- 📚 **Unified Vault**: Access all saved summaries and PDF chats in one place.
- ⚡ **Real-time Processing**: Track PDF parsing, chunking, embedding, and indexing live.
- 📤 **Export Options**: Download summaries as TXT, Markdown, or Word-compatible documents.
- 💳 **Subscription Plans**: Free, Pro, and Unlimited tiers with monthly usage limits.
- 🔒 **Secure Authentication**: Protected dashboard and user data powered by Clerk.

### Technical Features

- 🔍 **RAG Pipeline**: Semantic document retrieval using Gemini embeddings and pgvector.
- 🧠 **Vector Search**: 3072-dimensional embeddings for accurate PDF chunk matching.
- 🛠️ **Background Jobs**: Durable PDF processing with Inngest.
- 📡 **Realtime Updates**: Inngest Realtime with polling fallback for reliability.
- 🧾 **Billing Webhooks**: Polar subscription events synced with the database.

## 🛠️ Tech Stack

### 💻 Frontend

- **Next.js 16** with App Router and React Server Components
- **React 19**
- **TypeScript 5**
- **Tailwind CSS 4**
- **Shadcn UI / Radix UI**
- **Lucide React**
- **Framer Motion / Motion**
- **Lenis**
- **Sonner**
- **Zod**

### 🧱 Backend & Infrastructure

- **NeonDB Serverless Postgres**
- **Drizzle ORM**
- **pgvector**
- **Clerk**
- **UploadThing**
- **Polar**
- **Inngest**
- **Vercel-ready serverless runtime**

### 🧠 AI

- **Google Gemini 2.5 Flash** for summary generation and chat responses
- **Gemini Embedding 001** for 3072-dimensional text embeddings
- **LangChain PDFLoader** for PDF parsing
- **LangChain CharacterTextSplitter** for document chunking

## 🚦 Getting Started

### ✅ Prerequisites

- Node.js 20+
- npm or yarn
- A Neon Postgres database with pgvector enabled
- Clerk app
- UploadThing app
- Google Gemini API key
- Inngest account
- Polar account/products

#### 1. Clone The Repository

```bash
git clone https://github.com/rushikesh5035/summarist-ai.git
cd summarist-ai
```

#### 2. Install Dependencies

Using npm:

```bash
npm install
```

Or using yarn:

```bash
yarn install
```

#### 3. Configure Environment Variables

Create a `.env` file:

```bash
cp .env.example .env
```

Required variables:

```bash
# App
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Google Gemini
GEMINI_API_KEY=AIza...

# UploadThing
UPLOADTHING_TOKEN=...

# Inngest
INNGEST_EVENT_KEY=...
INNGEST_SIGNING_KEY=...

# Polar sandbox, used when NODE_ENV is not production
POLAR_SANDBOX_ACCESS_TOKEN=...
POLAR_SANDBOX_WEBHOOK_SECRET=...
POLAR_SANDBOX_PRO_PRODUCT_ID=prod_...
POLAR_SANDBOX_UNLIMITED_PRODUCT_ID=prod_...

# Polar production, used when NODE_ENV=production
POLAR_ACCESS_TOKEN=...
POLAR_WEBHOOK_SECRET=...
POLAR_PRO_PRODUCT_ID=prod_...
POLAR_UNLIMITED_PRODUCT_ID=prod_...
```

#### 4. Set Up The Database

Push the schema:

```bash
npm run db:push
```

Open Drizzle Studio if needed:

```bash
npm run db:studio
```

#### 5. Run The App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 🔗 Webhooks

For local webhook testing, expose the local server with ngrok or a similar tunnel:

```bash
ngrok http 3000
```

Configure these endpoints:

- Clerk: `https://your-ngrok-url.ngrok.io/api/webhooks/clerk`
- Polar: `https://your-ngrok-url.ngrok.io/api/webhooks/polar`
- Inngest: `https://your-ngrok-url.ngrok.io/api/inngest`

## 📁 Project Structure

```text
actions/              Server actions for upload, summaries, chat, and credits
app/                  Next.js App Router routes, layouts, API routes, webhooks
components/           Landing, dashboard, chat, summary, vault, and UI components
config/               Site metadata and SEO config
contexts/             App providers
data/                 Landing-page content
db/                   Drizzle client, schema, and migrations
hooks/                Shared React hooks
inngest/              Inngest client, realtime channels, and background functions
lib/                  AI, database, user, payment, summary, and chat helpers
public/               Static assets and social images
utils/                Constants, prompts, exports, formatting, UploadThing helpers
```

## 📝 Notes

- PDF uploads are limited to 32MB.
- Chat PDF processing is asynchronous and may take time for larger documents.
- The app uses high numeric limits for the Unlimited plan internally.
- Production deployments should configure Clerk, Polar, UploadThing, Inngest, and database environment variables in the hosting provider.

## 👤 Author

Built and maintained by Rushikesh Tele.
