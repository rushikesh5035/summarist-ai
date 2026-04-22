import { NextResponse } from "next/server";

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/vault(.*)",
  "/summaries(.*)",
  "/chat-pdf(.*)",
  "/api/checkout(.*)",
  "/api/polar-checkout(.*)",
  "/api/customer-portal(.*)",
  "/api/chat(.*)",
  "/api/subscription(.*)",
]);

const isAuthRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // Signed-in users cannot access sign-in / sign-up — redirect them to landing page
  if (userId && isAuthRoute(req)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Protected routes require authentication
  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
