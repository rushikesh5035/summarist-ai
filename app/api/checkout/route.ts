import { NextRequest, NextResponse } from "next/server";

import {
  POLAR_PRO_PRODUCT_ID,
  POLAR_UNLIMITED_PRODUCT_ID,
} from "@/utils/polar";

const productAliasMap: Record<string, string> = {
  pro: POLAR_PRO_PRODUCT_ID,
  unlimited: POLAR_UNLIMITED_PRODUCT_ID,
};

export const GET = async (req: NextRequest) => {
  const url = new URL(req.url);
  const productParam = url.searchParams.get("products");
  const customerEmail = url.searchParams.get("customerEmail");

  if (!productParam) {
    return NextResponse.json(
      { error: "products query param is required" },
      { status: 400 }
    );
  }

  const resolvedProductId = productAliasMap[productParam] ?? productParam;
  if (!resolvedProductId) {
    return NextResponse.json(
      { error: "Invalid products query param" },
      { status: 400 }
    );
  }

  // Avoid trusting host / forwarded headers for redirects.
  // Prefer a configured canonical base URL, otherwise fall back to request origin.
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? req.nextUrl.origin;
  const redirectUrl = new URL("/api/polar-checkout", baseUrl);
  redirectUrl.searchParams.set("products", resolvedProductId);
  if (customerEmail) {
    redirectUrl.searchParams.set("customerEmail", customerEmail);
  }

  return NextResponse.redirect(redirectUrl);
};
