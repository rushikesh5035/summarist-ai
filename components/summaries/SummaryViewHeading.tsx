"use client";

import Link from "next/link";

import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Copy,
  Download,
  FileText,
  FileType,
  FileType2,
  List,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SummaryViewHeadingProps {
  title: string;
  readTime: string;
  fileName: string;
  sectionCount: number;
  copied: boolean;
  onCopy: () => void;
  onExportTxt: () => void;
  onExportMarkdown: () => void;
  onExportDoc: () => void;
}

export default function SummaryViewHeading({
  title,
  readTime,
  fileName,
  sectionCount,
  copied,
  onCopy,
  onExportTxt,
  onExportMarkdown,
  onExportDoc,
}: SummaryViewHeadingProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-1.5 rounded-md border border-gray-700 bg-white/5 px-3 py-1.5 text-sm text-gray-400 transition-colors hover:border-[#0CF2A0]/40 hover:bg-[#0CF2A0]/5 hover:text-[#0CF2A0]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        <div className="mb-2 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-[#0CF2A0]" />
          <span className="text-sm font-medium text-[#0CF2A0]">
            Summary Generated
          </span>
        </div>

        <h1 className="text-2xl font-bold text-white sm:text-3xl">{title}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {readTime}
          </span>
          <span className="flex items-center gap-1">
            <FileText className="h-3.5 w-3.5" />
            {fileName}
          </span>
          <span className="flex items-center gap-1">
            <List className="h-3.5 w-3.5" />
            {sectionCount} sections
          </span>
        </div>
      </div>
      <div className="flex shrink-0 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onCopy}
          className="gap-1.5 border-gray-700 bg-white/5 text-gray-400 transition-colors hover:border-[#0CF2A0]/40 hover:bg-[#0CF2A0]/5 hover:text-[#0CF2A0]"
        >
          {copied ? (
            <CheckCircle2 className="h-4 w-4 text-[#0CF2A0]" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          {copied ? "Copied" : "Copy"}
        </Button>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 border-gray-700 bg-white/5 text-gray-400 transition-colors hover:border-[#0CF2A0]/40 hover:bg-[#0CF2A0]/5 hover:text-[#0CF2A0]"
            >
              <Download className="h-4 w-4" /> Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-44 border-gray-700 bg-[#1a1a1a] text-gray-300"
          >
            <DropdownMenuLabel className="text-xs text-gray-500">
              Choose format
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-700" />
            <DropdownMenuItem
              onClick={onExportTxt}
              className="cursor-pointer gap-2 text-gray-400 transition-colors hover:bg-[#0CF2A0]/5 hover:text-[#0CF2A0] focus:bg-[#0CF2A0]/5 focus:text-[#0CF2A0]"
            >
              <FileText className="h-4 w-4" />
              Plain Text (.txt)
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onExportMarkdown}
              className="cursor-pointer gap-2 text-gray-400 transition-colors hover:bg-[#0CF2A0]/5 hover:text-[#0CF2A0] focus:bg-[#0CF2A0]/5 focus:text-[#0CF2A0]"
            >
              <FileType className="h-4 w-4" />
              Markdown (.md)
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onExportDoc}
              className="cursor-pointer gap-2 text-gray-400 transition-colors hover:bg-[#0CF2A0]/5 hover:text-[#0CF2A0] focus:bg-[#0CF2A0]/5 focus:text-[#0CF2A0]"
            >
              <FileType2 className="h-4 w-4" />
              Word Document (.doc)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
