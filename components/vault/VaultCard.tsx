"use client";

import { useState } from "react";

import Link from "next/link";

import {
  Calendar,
  FileText,
  Loader2,
  MessageSquare,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { deleteChatPdfAction } from "@/actions/chat-actions";
import { deleteSummaryAction } from "@/actions/summary-actions";
import { VaultItem } from "@/lib/summaries";

function formatDate(dateStr: string | Date) {
  const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const VaultCard = ({ item }: { item: VaultItem }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const isSummary = item.type === "summary";
  const isChat = item.type === "chat";

  // Calculate word count and read time for summaries
  const wordCount = isSummary
    ? item.summaryText
      ? item.summaryText.trim().split(/\s+/).filter(Boolean).length
      : 0
    : 0;

  const readTime = isSummary ? Math.max(1, Math.ceil(wordCount / 200)) : 0;

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      if (isSummary) {
        const result = await deleteSummaryAction({ summaryId: item.id });
        if (result.success) {
          toast.success("Summary deleted");
        } else {
          toast.error("Failed to delete summary");
        }
      } else {
        const result = await deleteChatPdfAction({ chatPdfId: item.id });
        if (result.success) {
          toast.success("Chat deleted");
        } else {
          toast.error("Failed to delete chat");
        }
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
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            isSummary ? "bg-[#0CF2A0]/10" : "bg-blue-500/10"
          }`}
        >
          {isSummary ? (
            <FileText className="h-5 w-5 text-[#0CF2A0]" />
          ) : (
            <MessageSquare className="h-5 w-5 text-blue-400" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          {/* Type Tag */}
          <div className="mb-1.5 flex items-center gap-2">
            <span
              className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
                isSummary
                  ? "bg-[#0CF2A0]/10 text-[#0CF2A0]"
                  : "bg-blue-500/10 text-blue-400"
              }`}
            >
              {isSummary ? "Summary" : "Chat"}
            </span>
            {isChat && item.status && (
              <span
                className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
                  item.status === "ready"
                    ? "bg-green-500/10 text-green-400"
                    : item.status === "error"
                      ? "bg-red-500/10 text-red-400"
                      : "bg-yellow-500/10 text-yellow-400"
                }`}
              >
                {item.status}
              </span>
            )}
          </div>
          <h3 className="line-clamp-2 text-sm leading-snug font-semibold text-white">
            {item.title || item.fileName || "Untitled"}
          </h3>
          <p className="mt-0.5 truncate text-xs text-gray-500">
            {item.fileName}
          </p>
        </div>
        {/* Delete button */}
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          aria-label={`Delete ${item.type}`}
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
          {formatDate(item.createdAt)}
        </span>
        {isSummary && (
          <>
            <span className="h-3 w-px bg-gray-700" />
            <span>{wordCount.toLocaleString()} words</span>
            <span className="h-3 w-px bg-gray-700" />
            <span>{readTime} min read</span>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="mt-auto">
        {isSummary ? (
          <Link
            href={`/summaries/${item.id}`}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-gray-700 px-3 py-2 text-xs font-medium text-gray-300 transition hover:border-[#0CF2A0]/40 hover:text-[#0CF2A0]"
          >
            <FileText className="h-3.5 w-3.5" />
            View Summary
          </Link>
        ) : (
          <Link
            href={`/chat/${item.id}`}
            className={`flex w-full items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition ${
              item.status === "ready"
                ? "border-gray-700 text-gray-300 hover:border-blue-400/40 hover:text-blue-400"
                : "cursor-not-allowed border-gray-700/50 text-gray-500"
            }`}
            aria-disabled={item.status !== "ready"}
            onClick={(e) => {
              if (item.status !== "ready") {
                e.preventDefault();
                toast.info("PDF is still processing. Please wait...");
              }
            }}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            {item.status === "ready" ? "Open Chat" : "Processing..."}
          </Link>
        )}
      </div>
    </div>
  );
};

export default VaultCard;
