"use client";

import { motion } from "framer-motion";
import { FileText, Upload } from "lucide-react";

interface FileDropzoneProps {
  isDragging: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FileDropzone({
  isDragging,
  fileInputRef,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelect,
}: FileDropzoneProps) {
  return (
    <motion.div
      key="dropzone"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`mx-auto max-w-2xl cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition-all duration-300 sm:p-5 ${
        isDragging
          ? "border-[#0CF2A0] bg-[#0CF2A0]/5"
          : "border-gray-700 bg-[#1a1a1a]/40 hover:border-gray-500"
      }`}
    >
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0CF2A0]/10">
        <Upload
          className={`h-7 w-7 transition-colors ${
            isDragging ? "text-[#0CF2A0]" : "text-[#0CF2A0]/60"
          }`}
        />
      </div>
      <p className="mb-1 text-lg font-semibold text-white">
        Drop your PDF here
      </p>
      <p className="mb-4 text-sm text-gray-500">
        or click anywhere to browse files
      </p>
      <span className="inline-flex items-center gap-1.5 rounded-md border border-gray-700 bg-white/5 px-3 py-1.5 text-xs text-gray-400">
        <FileText className="h-3.5 w-3.5" /> Supports .pdf up to 32 MB
      </span>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        onChange={onFileSelect}
        className="hidden"
      />
    </motion.div>
  );
}
