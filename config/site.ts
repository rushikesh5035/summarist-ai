export const siteConfig = {
  name: "Summarist AI",
  title: "Summarist AI — AI-Powered PDF Summarization & Chat",
  description:
    "Save 80% of your reading time! Upload any PDF and get an AI-powered summary in seconds. Chat with your documents using advanced AI. Free to start.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://summarist.rushikesh-dev.xyz",
  ogImage: "/meta/og-home.png",
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
    "summarize pdf online free",
    "ai pdf summarizer tool",
    "pdf summary generator",
    "document summarization software",
    "pdf chatbot ai",
    "extract pdf summary",
    "read pdf faster",
    "pdf analysis tool",
    "google gemini pdf",
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
      "Save 80% of your reading time! Upload any PDF and get an AI-powered summary instantly. Chat with your document to find answers. Built with Google Gemini AI. Free to start.",
    keywords: [
      "pdf summarizer",
      "ai summary tool",
      "chat with pdf",
      "document analysis",
      "gemini ai",
      "free pdf summarizer",
      "pdf to summary",
    ],
    ogImage: "/meta/og-home.png",
    twitterCard: "summary_large_image",
  },
  "/sign-in": {
    title: "Sign In — Summarist AI",
    description:
      "Sign in to your Summarist AI account to summarize and chat with PDFs using advanced AI technology.",
    ogImage: "/meta/og-signin.png",
    twitterCard: "summary_large_image",
    noIndex: true,
  },
  "/sign-up": {
    title: "Sign Up — Summarist AI | Get Started Free",
    description:
      "Create your free Summarist AI account. Start summarizing PDFs in seconds. No credit card required. Get 5 free summaries to try.",
    ogImage: "/meta/og-signup.png",
    twitterCard: "summary_large_image",
  },
  "/dashboard": {
    title: "Dashboard — Summarist AI",
    description:
      "Upload PDFs and generate AI summaries or start a chat session with your documents.",
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
    publisher: siteConfig.author.name,
    openGraph: {
      type: "website" as const,
      locale: "en_US",
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
          type: "image/png",
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
      ? {
          index: false,
          follow: false,
          nocache: true,
          googleBot: {
            index: false,
            follow: false,
          },
        }
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
