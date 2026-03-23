import type { Metadata } from "next";

import { generatePageMetadata } from "@/config/site";

export const metadata: Metadata = generatePageMetadata("/sign-up");

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
