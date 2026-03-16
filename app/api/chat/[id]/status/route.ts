import { NextRequest, NextResponse } from "next/server";

import { getChatPdfById } from "@/lib/chat-pdf";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const GET = async (
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  const record = await getChatPdfById(id);
  if (!record) {
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
