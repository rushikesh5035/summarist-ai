"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { chatPdfs, users } from "@/db/schema";
import { inngest } from "@/inngest/client";
import { ensureFreeUserExists } from "@/lib/user";

export async function initiateChatPdf({
  fileUrl,
  fileName,
}: {
  fileUrl: string;
  fileName: string;
}) {
  const { userId } = await auth(); // clerk ID
  if (!userId) return { success: false, message: "Unauthorized" };

  try {
    // Get user from DB (webhook should have created it)
    let dbUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.clerkId, userId));

    // Fallback: Create user if webhook missed it (for existing users or webhook failures)
    if (dbUser.length === 0) {
      console.warn(
        "[Chat PDF] User not found in DB, creating via fallback:",
        userId
      );
      const user = await currentUser();
      if (user) {
        await ensureFreeUserExists(user);
        dbUser = await db
          .select({ id: users.id })
          .from(users)
          .where(eq(users.clerkId, userId));
      }
    }

    if (dbUser.length === 0)
      return { success: false, message: "User not found" };

    // Create chat pdf record
    const [record] = await db
      .insert(chatPdfs)
      .values({
        userId: dbUser[0].id,
        fileName,
        fileUrl,
        status: "processing",
      })
      .returning({ id: chatPdfs.id });

    // Inngest event → triggers background processing
    await inngest.send({
      name: "pdf/chat.uploaded",
      data: { chatPdfId: record.id, fileUrl },
    });

    return { success: true, chatPdfId: record.id };
  } catch (error) {
    console.error("initiateChatPdf error:", error);
    return { success: false, message: "Failed to start PDF processing" };
  }
}
