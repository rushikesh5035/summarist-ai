"use client";

import { CheckCircle2, Clock, Copy, Download, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";

interface SummaryHeaderProps {
  title: string;
  readTime: string;
  fileName: string;
  copied: boolean;
  onCopy: () => void;
  onExport?: () => void;
}

export default function SummaryHeader({
  title,
  readTime,
  fileName,
  copied,
  onCopy,
  onExport,
}: SummaryHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-[#0CF2A0]" />
          <span className="text-sm font-medium text-[#0CF2A0]">
            Summary Generated
          </span>
        </div>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">{title}</h1>
        <div className="mt-2 flex items-center gap-3 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {readTime}
          </span>
          <span className="flex items-center gap-1">
            <FileText className="h-3.5 w-3.5" />
            {fileName}
          </span>
        </div>
      </div>
      <div className="flex shrink-0 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onCopy}
          className="gap-1.5 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
        >
          {copied ? (
            <CheckCircle2 className="h-4 w-4 text-[#0CF2A0]" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          {copied ? "Copied" : "Copy"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
          className="gap-1.5 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
        >
          <Download className="h-4 w-4" /> Export
        </Button>
      </div>
    </div>
  );
}
