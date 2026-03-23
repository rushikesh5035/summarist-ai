# Summarist.ai 📝🚀

**AI-powered SaaS application that transforms PDFs into clear, structured visual summaries and enables intelligent chat with your documents.**

![Summarist.ai Preview](./public/preview.png)

## 🌟 Features

### Core Features

- 🤖 **AI-Powered Summarization**: Generate concise, structured summaries
- 💬 **Chat with PDF**: Ask questions and get intelligent answers from your documents
- 📊 **Interactive Dashboard**: Manage all your summaries and chat sessions in one place
- 📁 **Vault System**: Access your complete history of processed PDFs
- 📄 **Export Options**: Download summaries as Plain Text, Markdown, or Microsoft Word documents

### Technical Features

- 🔒 **Secure Authentication**: Email/password and OAuth (Google, GitHub) via Clerk
- 💳 **Subscription Management**: Three tiers (Free, Pro $5/month, Unlimited $20/month) with Stripe integration
- 📤 **Robust File Upload**: Support for PDFs up to 32MB with UploadThing
- ⚡ **Real-time Processing**: Async background jobs with Inngest for efficient processing
- 🔍 **Semantic Search**: Vector embeddings with pgvector for accurate document retrieval
- 🎨 **Modern UI/UX**: Dark theme with glassmorphism effects, responsive design, smooth animations
- 📱 **Mobile Optimized**: Fully responsive across all devices

---

## 🚀 Tech Stack

### Frontend

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, React Server Components)
- **UI Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Component Library**: [ShadCN UI](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)

### Backend & Infrastructure

- **Runtime**: Node.js (Serverless on Vercel)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (NeonDB Serverless)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Vector Extension**: [pgvector](https://github.com/pgvector/pgvector)
- **Authentication**: [Clerk](https://clerk.com/)
- **Payments**: [Stripe](https://stripe.com/)
- **File Upload**: [UploadThing](https://uploadthing.com/)
- **Background Jobs**: [Inngest](https://www.inngest.com/)

### AI & Machine Learning

- **AI Provider**: [Google Gemini AI](https://ai.google.dev/)
  - **Gemini 2.5 Flash**: Summarization & Chat
  - **Embedding-001**: 3072-dimensional vector embeddings
- **AI Framework**: [LangChain](https://js.langchain.com/)
  - PDF parsing and text splitting
  - Document loaders and text splitters
- **RAG Architecture**: Custom implementation with pgvector

### DevOps & Tooling

- **Deployment**: [Vercel](https://vercel.com/)
- **Version Control**: Git + GitHub
- **Package Manager**: npm
- **Linting**: ESLint + Prettier
- **Git Hooks**: Husky + lint-staged
- **Database CLI**: Drizzle Kit

---

## 🛠️ Getting Started

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/rushikesh5035/summarist-ai.git
cd summarist-ai
```

#### 2. Install Dependencies

```bash
bun install
```

#### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your credentials (see [Environment Variables](#-environment-variables) section below):

```bash
# Database (NeonDB)
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Google Gemini AI
GEMINI_API_KEY=AIza...

# UploadThing
UPLOADTHING_TOKEN=...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Inngest
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

#### 4. Set Up Database

Push the database schema to your NeonDB instance:

```bash
npm run db:push
```

Optional: Open Drizzle Studio to view your database:

```bash
npm run db:studio
```

#### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

#### 6. Configure Webhooks (Local Development)

For local webhook testing, use ngrok or similar tunneling service:

```bash
# Install ngrok
npm install -g ngrok

# Create tunnel
ngrok http 3000

# Use the ngrok URL for webhook endpoints:
# https://your-ngrok-url.ngrok.io/api/webhooks/stripe
# https://your-ngrok-url.ngrok.io/api/webhooks/clerk
```
