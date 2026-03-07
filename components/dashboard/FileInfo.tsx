"use client";

import { motion } from "framer-motion";
import { FileText, X } from "lucide-react";

interface FileInfoProps {
  file: File;
  onRemove: () => void;
}

export default function FileInfo({ file, onRemove }: FileInfoProps) {
  const fileSizeMB = (file.size / 1024 / 1024).toFixed(2);

  return (
    <motion.div
      key="file-info"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="mx-auto flex max-w-3xl items-center gap-4 rounded-2xl border border-[#0CF2A0]/30 bg-[#1a1a1a] p-3"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0CF2A0]/10">
        <FileText className="h-6 w-6 text-[#0CF2A0]" />
      </div>
      <div className="min-w-0 grow">
        <p className="truncate font-semibold text-white">{file.name}</p>
        <p className="text-sm text-gray-500">
          {fileSizeMB} MB • Ready to process
        </p>
      </div>
      <button
        onClick={onRemove}
        className="shrink-0 rounded-lg bg-transparent p-1.5 text-gray-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
      >
        <X className="h-5 w-5" />
      </button>
    </motion.div>
  );
}
