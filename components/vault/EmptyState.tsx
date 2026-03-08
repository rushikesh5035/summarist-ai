import React from "react";

import Link from "next/link";

import { LayoutDashboard } from "lucide-react";

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0CF2A0]/10">
        <LayoutDashboard className="h-8 w-8 text-[#0CF2A0]" />
      </div>
      <h2 className="mb-2 text-xl font-semibold text-white">
        No summaries yet
      </h2>
      <p className="mb-6 max-w-xs text-sm text-gray-500">
        Upload a PDF from the dashboard to generate your first AI summary.
      </p>
      <Link
        href="/dashboard"
        className="rounded-xl bg-[#0CF2A0] px-5 py-2.5 text-sm font-semibold text-[#111111] transition hover:bg-[#0CF2A0]/90"
      >
        Upload a PDF
      </Link>
    </div>
  );
};

export default EmptyState;
