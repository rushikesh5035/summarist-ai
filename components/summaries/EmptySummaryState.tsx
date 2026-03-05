import React from "react";

import Link from "next/link";

import { FileText } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function EmptySummaryState() {
  return (
    <div className="py-11 text-center">
      <div className="flex flex-col items-center gap-4">
        <FileText className="h-16 w-16 text-gray-400" />
        <h2 className="text-xl font-semibold text-gray-600">
          No Summaries yet
        </h2>
        <p className="max-w-md text-gray-500">
          Upload your first PDF to get started with AI-powered summaries.
        </p>
        <Link href="/upload">
          <Button
            variant={"link"}
            className="mt-4 bg-linear-to-r from-rose-500 to-rose-700 text-white hover:from-rose-600 hover:to-rose-800 hover:no-underline"
          >
            Create Your First Summary
          </Button>
        </Link>
      </div>
    </div>
  );
}
