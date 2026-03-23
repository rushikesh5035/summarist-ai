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
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
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
