"use server";

import { revalidatePath } from "next/cache";

import { auth, currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";

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

export async function deleteChatPdfAction({
  chatPdfId,
}: {
  chatPdfId: string;
}) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser?.id) throw new Error("User not found");

    // Get user from DB (webhook should have created it)
    let dbUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.clerkId, clerkUser.id));

    // Fallback: Create user if webhook missed it (for existing users or webhook failures)
    if (dbUser.length === 0) {
      console.warn(
        "[Delete Chat PDF] User not found in DB, creating via fallback:",
        clerkUser.id
      );
      await ensureFreeUserExists(clerkUser);
      dbUser = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.clerkId, clerkUser.id));
    }

    if (dbUser.length === 0) {
      return {
        message: "User not found",
        success: false,
      };
    }

    // Delete chat PDF (cascade will delete related chunks and messages)
    const result = await db
      .delete(chatPdfs)
      .where(and(eq(chatPdfs.id, chatPdfId), eq(chatPdfs.userId, dbUser[0].id)))
      .returning({ id: chatPdfs.id });

    if (result.length > 0) {
      revalidatePath("/vault");
      return { success: true, message: "Chat PDF deleted successfully" };
    }
    return { success: false, message: "Chat PDF not found" };
  } catch (error) {
    console.error("Error deleting chat PDF", error);
    return { success: false, message: "Error deleting chat PDF" };
  }
}
