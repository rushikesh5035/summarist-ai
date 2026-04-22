import { Checkout } from "@polar-sh/nextjs";

import { POLAR_ACCESS_TOKEN, POLAR_SERVER } from "@/utils/polar";

export const GET = Checkout({
  accessToken: POLAR_ACCESS_TOKEN,
  successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
  server: POLAR_SERVER,
  theme: "dark",
});
