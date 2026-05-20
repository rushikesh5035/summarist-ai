import { NextRequest, NextResponse } from "next/server";

import { auth } from "@clerk/nextjs/server";

import { getChatPdfById } from "@/lib/chat-pdf";
import { getDbUserId } from "@/lib/user";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const GET = async (
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;

  // Verify the authenticated user owns this chat
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUserId = await getDbUserId(clerkId);
  if (!dbUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const record = await getChatPdfById(id);
  if (!record || record.userId !== dbUserId) {
    return NextResponse.json({ status: "Not Found" }, { status: 404 });
  }

  console.log(`[Status API] chatPdfId: ${id}, status: ${record.status}`);
  return NextResponse.json(
    { status: record.status },
    {
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  );
};
