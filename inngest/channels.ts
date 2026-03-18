import { channel, topic } from "@inngest/realtime";
import { z } from "zod";

/**
 * Channel for PDF processing status updates
 * Each chatPdfId gets its own channel
 */
export const pdfProcessingChannel = channel(
  (chatPdfId: string) => `pdf-processing:${chatPdfId}`
).addTopic(
  topic("progress").schema(
    z.object({
      status: z.enum([
        "processing",
        "parsing",
        "chunking",
        "embedding",
        "ready",
        "error",
      ]),
      message: z.string(),
      progress: z.number().min(0).max(100).optional(),
      metadata: z
        .object({
          pages: z.number().optional(),
          chunks: z.number().optional(),
        })
        .optional(),
    })
  )
);
