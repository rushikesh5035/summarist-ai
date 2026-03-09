"use client";

import { useRef } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

import FeatureHighlights from "./FeatureHighlights";
import FileDropzone from "./FileDropzone";
import FileInfo from "./FileInfo";
import ModeSelector from "./ModeSelector";

type Mode = "summary" | "chat" | null;

interface UploadPageProps {
  file: File | null;
  mode: Mode;
  isDragging: boolean;
  onFileSelect: (file: File | null) => void;
  onModeChange: (mode: Mode) => void;
  onDragStateChange: (dragging: boolean) => void;
  onSubmit: () => void;
  hasReachedLimit?: boolean;
  uploadLimit?: number;
}

export default function UploadPage({
  file,
  mode,
  isDragging,
  onFileSelect,
  onModeChange,
  onDragStateChange,
  onSubmit,
  hasReachedLimit = false,
  uploadLimit = 0,
}: UploadPageProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDragStateChange(false);

    if (hasReachedLimit) return;

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === "application/pdf") {
      onFileSelect(droppedFile);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (hasReachedLimit) return;

    const selected = e.target.files?.[0];
    if (selected?.type === "application/pdf") {
      onFileSelect(selected);
    }
  };

  const handleRemoveFile = () => {
    onFileSelect(null);
    onModeChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    onDragStateChange(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#0CF2A0]/20 bg-[#0CF2A0]/10 px-4 py-1.5"
        >
          <Sparkles className="h-3.5 w-3.5 text-[#0CF2A0]" />
          <span className="text-xs font-medium text-[#0CF2A0]">
            AI-Powered Document Assistant
          </span>
        </motion.div>
        <h1 className="mb-4 text-3xl leading-tight font-bold text-white sm:text-4xl lg:text-5xl">
          Summarize or Chat with
          <br />
          <span className="text-[#0CF2A0]">any PDF instantly</span>
        </h1>
        <p className="mx-auto max-w-lg text-base text-gray-400">
          Upload your document and choose — get a concise AI summary with key
          insights, or have an interactive conversation with your PDF.
        </p>
      </div>

      {/* Upload Limit Warning */}
      {hasReachedLimit && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mb-6 flex max-w-3xl rounded-xl border border-rose-500/30 bg-rose-500/10 p-4"
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-500/20">
              <span className="text-rose-400">⚠</span>
            </div>
            <div className="flex-1">
              <h3 className="mb-1 text-sm font-semibold text-rose-400">
                Upload Limit Reached
              </h3>
              <p className="text-sm text-gray-400">
                You've reached the limit of {uploadLimit} upload(s) on your
                current plan.{" "}
                <a
                  href="/#pricing"
                  className="font-medium text-rose-400 underline underline-offset-2 hover:text-rose-300"
                >
                  Upgrade to Pro
                </a>{" "}
                for unlimited uploads.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Drop zone or file info */}
      <AnimatePresence mode="wait">
        {!file ? (
          <div
            className={hasReachedLimit ? "pointer-events-none opacity-50" : ""}
          >
            <FileDropzone
              isDragging={isDragging}
              fileInputRef={fileInputRef}
              onDragOver={handleDragOver}
              onDragLeave={() => onDragStateChange(false)}
              onDrop={handleDrop}
              onFileSelect={handleFileInputChange}
            />
          </div>
        ) : (
          <FileInfo file={file} onRemove={handleRemoveFile} />
        )}
      </AnimatePresence>

      {/* Mode selection */}
      {file && <ModeSelector mode={mode} onModeChange={onModeChange} />}

      {/* Submit button */}
      {file && mode && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-8 text-center"
        >
          <Button
            onClick={onSubmit}
            className="rounded-xl bg-[#0CF2A0] px-10 py-3 text-base font-semibold text-[#111111] shadow-lg shadow-[#0CF2A0]/20 transition-shadow hover:bg-[#0CF2A0]/90 hover:shadow-[#0CF2A0]/30"
          >
            {mode === "summary" ? "Generate Summary" : "Start Chat"} →
          </Button>
        </motion.div>
      )}

      {/* Feature highlights */}
      {!file && <FeatureHighlights />}
    </motion.div>
  );
}
