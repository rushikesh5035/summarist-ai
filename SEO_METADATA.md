# SEO & Metadata Configuration — Summarist AI

## Routes & Metadata

| Route             | Page                  | Status              |
| ----------------- | --------------------- | ------------------- |
| `/`               | Landing page (public) | Needs rich metadata |
| `/sign-in`        | Clerk sign-in         | Handled by Clerk    |
| `/sign-up`        | Clerk sign-up         | Handled by Clerk    |
| `/dashboard`      | Upload & summaries    | Protected — noindex |
| `/vault`          | Summary history       | Protected — noindex |
| `/summaries/[id]` | View single summary   | Protected — noindex |
| `/chat-pdf/[id]`  | Chat with PDF         | Protected — noindex |

> **Important:** Protected (logged-in) pages should set `robots: { index: false }` — you don't want Google indexing user-specific content.

---

## Step 1 — Site Config

### `config/site.ts` ← **NEW FILE**

```typescript
export const siteConfig = {
  name: "Summarist AI",
  title: "Summarist AI — AI-Powered PDF Summarization & Chat",
  description:
    "Transform lengthy PDFs into clear summaries and chat with your documents using AI. Save hours of reading time with Summarist AI.",
  url: process.env.NEXT_PUBLIC_URL || "https://summarist-ai.vercel.app",
  ogImage: "/meta/og-default.png",
  author: {
    name: "Rushikesh Tele",
    twitter: "@rushikesh_tele",
    github: "rushikesh5035",
  },
  keywords: [
    "pdf summarizer",
    "ai summary",
    "chat with pdf",
    "document ai",
    "pdf to summary",
    "gemini ai",
    "pdf chat bot",
    "summarist",
  ],
};

export interface PageMeta {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  twitterCard?: "summary" | "summary_large_image";
  noIndex?: boolean;
}

export const pageMetadata: Record<string, PageMeta> = {
  "/": {
    title: "Summarist AI — Summarize & Chat with Any PDF in Seconds",
    description:
      "Upload any PDF and get an AI-powered summary instantly, or chat with your document to find answers. Built with Gemini AI.",
    keywords: [
      "pdf summarizer",
      "ai summary tool",
      "chat with pdf",
      "document analysis",
      "gemini ai",
    ],
    ogImage: "/meta/og-home.png",
    twitterCard: "summary_large_image",
  },
  "/sign-in": {
    title: "Sign In — Summarist AI",
    description:
      "Sign in to your Summarist AI account to summarize and chat with PDFs.",
    noIndex: true,
  },
  "/sign-up": {
    title: "Sign Up — Summarist AI",
    description:
      "Create your free Summarist AI account. Start summarizing PDFs today.",
    ogImage: "/meta/og-signup.png",
    twitterCard: "summary_large_image",
  },
  "/dashboard": {
    title: "Dashboard — Summarist AI",
    description:
      "Upload PDFs and generate AI summaries or start a chat session.",
    noIndex: true,
  },
  "/vault": {
    title: "My Vault — Summarist AI",
    description: "Your saved PDF summaries and chat history.",
    noIndex: true,
  },
};

export function getPageMeta(pathname: string): PageMeta {
  return pageMetadata[pathname] || pageMetadata["/"];
}

export function generatePageMetadata(pathname: string) {
  const meta = getPageMeta(pathname);

  return {
    metadataBase: new URL(siteConfig.url),
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords?.join(", "),
    authors: [{ name: siteConfig.author.name }],
    creator: siteConfig.author.name,
    openGraph: {
      type: "website" as const,
      url: `${siteConfig.url}${pathname}`,
      title: meta.title,
      description: meta.description,
      siteName: siteConfig.name,
      images: [
        {
          url: meta.ogImage || siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: meta.title,
        },
      ],
    },
    twitter: {
      card: meta.twitterCard || "summary_large_image",
      title: meta.title,
      description: meta.description,
      creator: siteConfig.author.twitter,
      images: [meta.ogImage || siteConfig.ogImage],
    },
    robots: meta.noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large" as const,
            "max-snippet": -1,
          },
        },
    alternates: {
      canonical: `${siteConfig.url}${pathname}`,
    },
  };
}
```

---

## Step 2 — Update Root Layout

### `app/layout.tsx` ← **MODIFY**

Replace the existing `metadata` export with the config-based version:

```typescript
import type { Metadata } from "next";
import { Source_Sans_3 as FontSans } from "next/font/google";

import { ClerkProvider } from "@clerk/nextjs";

import { Toaster } from "@/components/ui/sonner";
import { generatePageMetadata, siteConfig } from "@/config/site";

import "./globals.css";

const fontSans = FontSans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  ...generatePageMetadata("/"),
  // Override title to use template for child pages
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${fontSans.variable} font-sans antialiased`}>
          <div className="relative flex min-h-screen flex-col">{children}</div>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
```

---

## Step 3 — Per-Page Metadata (Optional)

For any page that needs its own `<title>`, just export metadata:

```typescript
// app/(logged-in)/dashboard/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };
// → renders as "Dashboard | Summarist AI" (via template)
```

```typescript
// app/(logged-in)/vault/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Vault" };
```

For dynamic pages like `/summaries/[id]`, use `generateMetadata`:

```typescript
// app/(logged-in)/summaries/[id]/page.tsx
import type { Metadata } from "next";

import { getSummaryById } from "@/lib/summaries";

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await props.params;
  const summary = await getSummaryById(id);

  return {
    title: summary?.title || "Summary",
    robots: { index: false, follow: false },
  };
}
```

---

## Step 4 — OG Images

### Where to put them

```
public/
  meta/
    og-default.png     ← fallback for all pages (1200×630)
    og-home.png        ← landing page hero
    og-signup.png      ← sign-up page
```

### Design specs

| Size       | `1200 × 630 px` (LinkedIn, Twitter, Facebook standard) |
| ---------- | ------------------------------------------------------ |
| Format     | PNG (for text clarity) or WebP                         |
| Text       | Large, bold, readable at small sizes                   |
| Background | Dark (#111111 to match your app)                       |
| Accent     | Your brand green `#0CF2A0`                             |
| Font       | Inter or Source Sans (match your app)                  |

### What to include on each OG image

| Image            | Content                                                               |
| ---------------- | --------------------------------------------------------------------- |
| `og-default.png` | Logo + "Summarist AI" + tagline "AI-Powered PDF Summarization & Chat" |
| `og-home.png`    | Hero shot — logo + tagline + a stylized PDF → Summary visual          |
| `og-signup.png`  | "Get Started Free" + logo + "Summarize any PDF in seconds"            |

---

## 🔧 OG Image Tools (Professional Quality)

### Recommended (best for SaaS)

| Tool                    | Type          | Best For                                         | Link                                                                              |
| ----------------------- | ------------- | ------------------------------------------------ | --------------------------------------------------------------------------------- |
| **OG Image Playground** | Free, browser | Quick templates, dark themes                     | [og-playground.vercel.app](https://og-playground.vercel.app)                      |
| **Figma**               | Free tier     | Full design control, export as PNG               | [figma.com](https://figma.com)                                                    |
| **@vercel/og**          | Code-based    | Dynamic OG images at build/runtime               | [vercel.com/docs/og-image](https://vercel.com/docs/functions/og-image-generation) |
| **Shots.so**            | Free          | Wrap screenshots in device frames + gradient BGs | [shots.so](https://shots.so)                                                      |
| **OG Image.gallery**    | Free          | Browse & fork OG designs from top SaaS companies | [ogimage.gallery](https://ogimage.gallery)                                        |
| **Canva**               | Free tier     | Drag-and-drop, huge template library             | [canva.com](https://canva.com)                                                    |

### For your project specifically, I recommend:

1. **Static OG images (now):** Design in **Figma** — use your dark `#111111` background, `#0CF2A0` accent, Inter font. Export as 1200×630 PNG.

2. **Dynamic OG images (later):** Use `@vercel/og` to generate images with the summary title baked in:

```typescript
// app/api/og/route.tsx  ← generates OG images on-the-fly
import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "Summarist AI";

  return new ImageResponse(
    (
      <div
        style={{
          background: "#111111",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px",
        }}
      >
        <div
          style={{
            color: "#0CF2A0",
            fontSize: 28,
            fontWeight: 600,
            marginBottom: 20,
          }}
        >
          Summarist AI
        </div>
        <div
          style={{
            color: "#ffffff",
            fontSize: 48,
            fontWeight: 700,
            textAlign: "center",
            lineHeight: 1.3,
            maxWidth: 900,
          }}
        >
          {title}
        </div>
        <div
          style={{
            color: "#888888",
            fontSize: 20,
            marginTop: 24,
          }}
        >
          AI-Powered PDF Summarization & Chat
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
```

Then reference it in metadata: `/api/og?title=My+Summary+Title`

---

## Quick Design Tips for Professional OG Images

1. **Keep text under 5 words** — OG images are shown tiny in link previews
2. **High contrast** — white/green text on dark background
3. **No small details** — they'll be invisible at preview size
4. **Include your logo** — brand recognition
5. **Use gradients** — subtle dark gradient (`#111` → `#1a1a1a`) feels premium
6. **Test with** [opengraph.xyz](https://www.opengraph.xyz) — paste your URL and preview how it looks on Twitter/LinkedIn/Slack
