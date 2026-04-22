import { NextRequest } from "next/server";

import { auth } from "@clerk/nextjs/server";
import { CustomerPortal } from "@polar-sh/nextjs";

import { getPolarCustomerId } from "@/lib/payments";
import { POLAR_ACCESS_TOKEN, POLAR_SERVER } from "@/utils/polar";

export const GET = CustomerPortal({
  accessToken: POLAR_ACCESS_TOKEN,
  server: POLAR_SERVER,
  returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
  getCustomerId: async (_req: NextRequest) => {
    const { userId } = await auth();
    if (!userId) return "";

    const customerId = await getPolarCustomerId(userId);
    return customerId ?? "";
  },
});
