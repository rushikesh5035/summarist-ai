"use client";

import { useState } from "react";

import Link from "next/link";

import { Calendar, FileText, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { deleteSummaryAction } from "@/actions/summary-actions";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const VaultCard = ({ summary }: { summary: any }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const wordCount =
    summary.wordCount ??
    (summary.summaryText
      ? summary.summaryText.trim().split(/\s+/).filter(Boolean).length
      : 0);

  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      const result = await deleteSummaryAction({ summaryId: summary.id });
      if (result.success) {
        toast.success("Summary deleted");
      } else {
        toast.error("Failed to delete summary");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="group flex flex-col rounded-xl border border-gray-700/50 bg-[#1a1a1a] p-5 transition-all duration-200 hover:border-[#0CF2A0]/30 hover:shadow-lg hover:shadow-[#0CF2A0]/5">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0CF2A0]/10">
          <FileText className="h-5 w-5 text-[#0CF2A0]" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-sm leading-snug font-semibold text-white">
            {summary.title || summary.fileName || "Untitled"}
          </h3>
          <p className="mt-0.5 truncate text-xs text-gray-500">
            {summary.fileName}
          </p>
        </div>
        {/* Delete button */}
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          aria-label="Delete summary"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-transparent text-gray-600 transition hover:bg-transparent hover:text-red-400 disabled:opacity-50"
        >
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Meta */}
      <div className="mb-5 flex items-center gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          {formatDate(summary.createdAt)}
        </span>
        <span className="h-3 w-px bg-gray-700" />
        <span>{wordCount.toLocaleString()} words</span>
        <span className="h-3 w-px bg-gray-700" />
        <span>{readTime} min read</span>
      </div>

      {/* Actions */}
      <div className="mt-auto">
        <Link
          href={`/summaries/${summary.id}`}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-gray-700 px-3 py-2 text-xs font-medium text-gray-300 transition hover:border-[#0CF2A0]/40 hover:text-[#0CF2A0]"
        >
          <FileText className="h-3.5 w-3.5" />
          View Summary
        </Link>
      </div>
    </div>
  );
};

export default VaultCard;
