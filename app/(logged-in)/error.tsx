"use client";

import { useEffect } from "react";

import Link from "next/link";

import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { motion } from "motion/react";

export default function LoggedInError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to error reporting service in production (e.g. Sentry)
    console.error("[App Error]", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#111111] px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md text-center"
      >
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
          <AlertTriangle className="h-8 w-8 text-red-400" />
        </div>

        {/* Heading */}
        <h1 className="mb-3 text-2xl font-bold text-white">
          Something went wrong
        </h1>
        <p className="mb-2 text-sm text-gray-400">
          An unexpected error occurred. This has been logged and we&apos;re
          working on a fix.
        </p>

        {/* Error message (only in dev) */}
        {process.env.NODE_ENV === "development" && error?.message && (
          <p className="mb-6 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 font-mono text-xs text-red-400">
            {error.message}
          </p>
        )}

        {/* Actions */}
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0CF2A0] px-5 py-2.5 text-sm font-semibold text-[#0a0a0a] transition hover:bg-[#0CF2A0]/90 sm:w-auto"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
          <Link
            href="/dashboard"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-700 bg-white/5 px-5 py-2.5 text-sm font-semibold text-gray-300 transition hover:bg-white/10 sm:w-auto"
          >
            <Home className="h-4 w-4" />
            Go to Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
