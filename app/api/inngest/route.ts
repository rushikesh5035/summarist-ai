import { serve } from "inngest/next";

import { inngest } from "@/inngest/client";
import { processPdfForChat } from "@/inngest/functions/chatPdfInFun";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [processPdfForChat],
});
