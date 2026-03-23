import type { Metadata } from "next";

import { generatePageMetadata } from "@/config/site";

export const metadata: Metadata = generatePageMetadata("/sign-in");

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
