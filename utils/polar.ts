export const isDev = process.env.NODE_ENV !== "production";

export const POLAR_ACCESS_TOKEN = isDev
  ? process.env.POLAR_SANDBOX_ACCESS_TOKEN!
  : process.env.POLAR_ACCESS_TOKEN!;

export const POLAR_WEBHOOK_SECRET = isDev
  ? process.env.POLAR_SANDBOX_WEBHOOK_SECRET!
  : process.env.POLAR_WEBHOOK_SECRET!;

export const POLAR_SERVER: "sandbox" | "production" = isDev
  ? "sandbox"
  : "production";

export const POLAR_PRO_PRODUCT_ID = isDev
  ? process.env.POLAR_SANDBOX_PRO_PRODUCT_ID!
  : process.env.POLAR_PRO_PRODUCT_ID!;

export const POLAR_UNLIMITED_PRODUCT_ID = isDev
  ? process.env.POLAR_SANDBOX_UNLIMITED_PRODUCT_ID!
  : process.env.POLAR_UNLIMITED_PRODUCT_ID!;
