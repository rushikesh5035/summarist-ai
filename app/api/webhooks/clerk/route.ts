import { headers } from "next/headers";

import { WebhookEvent } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { Webhook } from "svix";

import { db } from "@/db/drizzle";
import { users } from "@/db/schema";

export async function POST(req: Request) {
  // Get the webhook secret from environment
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error(
      "[Clerk Webhook] Missing CLERK_WEBHOOK_SECRET environment variable"
    );
    return new Response(
      JSON.stringify({
        error: "Server configuration error",
        message: "CLERK_WEBHOOK_SECRET not configured",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("[Clerk Webhook] Missing svix headers");
    return new Response(
      JSON.stringify({
        error: "Missing headers",
        message: "Required svix headers not found",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the webhook signature
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("[Clerk Webhook] Signature verification failed:", err);
    return new Response(
      JSON.stringify({
        error: "Verification failed",
        message: "Invalid webhook signature",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Handle the webhook event
  const eventType = evt.type;

  console.log(`[Clerk Webhook] Received event: ${eventType}`);

  try {
    switch (eventType) {
      case "user.created": {
        const { id, email_addresses } = evt.data;
        const email = email_addresses[0]?.email_address;

        if (!email) {
          console.error("[Clerk Webhook] No email found for user:", id);
          return new Response(
            JSON.stringify({
              error: "Invalid user data",
              message: "No email address found",
            }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            }
          );
        }

        // Create user in database
        await db.insert(users).values({
          clerkId: id,
          email: email,
        });

        console.log(`[Clerk Webhook] User created in DB: ${id} (${email})`);
        break;
      }

      case "user.updated": {
        const { id, email_addresses } = evt.data;
        const email = email_addresses[0]?.email_address;

        if (!email) {
          console.error("[Clerk Webhook] No email found for user:", id);
          return new Response(
            JSON.stringify({
              error: "Invalid user data",
              message: "No email address found",
            }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            }
          );
        }

        // Update user email in database
        await db.update(users).set({ email }).where(eq(users.clerkId, id));

        console.log(`[Clerk Webhook] User updated in DB: ${id} (${email})`);
        break;
      }

      case "user.deleted": {
        const { id } = evt.data;

        if (!id) {
          console.error("[Clerk Webhook] No user ID found");
          return new Response(
            JSON.stringify({
              error: "Invalid user data",
              message: "No user ID found",
            }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            }
          );
        }

        // Delete user from database (cascade will delete related data)
        await db.delete(users).where(eq(users.clerkId, id));

        console.log(`[Clerk Webhook] User deleted from DB: ${id}`);
        break;
      }

      default:
        console.log(`[Clerk Webhook] Unhandled event type: ${eventType}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Webhook processed successfully",
        eventType: eventType,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error(`[Clerk Webhook] Error processing ${eventType}:`, error);
    return new Response(
      JSON.stringify({
        error: "Processing failed",
        message: error instanceof Error ? error.message : "Unknown error",
        eventType: eventType,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
