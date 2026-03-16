"use client";

import { useEffect, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

import ChatPageSkeleton from "@/components/chat/ChatPageSkeleton";
import SummaryViewerSkeleton from "@/components/summaries/SummaryViewerSkeleton";

interface LoadingViewProps {
  fileName: string;
  mode: "summary" | "chat";
  onComplete: () => void;
}

const SUMMARY_STEPS = [
  "Parsing document...",
  "Analyzing content...",
  "Extracting key points...",
  "Generating summary...",
];

const CHAT_STEPS = [
  "Parsing document...",
  "Chunking text...",
  "Building vector index...",
  "Preparing chat...",
];

export default function LoadingView({
  fileName,
  mode,
  onComplete,
}: LoadingViewProps) {
  const [progress, setProgress] = useState(0);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const steps = mode === "chat" ? CHAT_STEPS : SUMMARY_STEPS;
  const stepIndex = Math.min(Math.floor(progress / 25), steps.length - 1);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Transition to skeleton after animation settles
          setTimeout(() => setShowSkeleton(true), 500);
          onComplete();
          return 100;
        }
        return prev + 2;
      });
    }, 60);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence mode="wait">
      {!showSkeleton ? (
        <motion.div
          key="loader"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center justify-center py-20"
        >
          <div className="relative mb-8 h-20 w-20">
            <div className="absolute inset-0 rounded-full border-2 border-gray-700" />
            <svg
              className="absolute inset-0 h-20 w-20 -rotate-90"
              viewBox="0 0 80 80"
            >
              <motion.circle
                cx="40"
                cy="40"
                r="38"
                fill="none"
                stroke="#0CF2A0"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={238.76}
                strokeDashoffset={238.76 * (1 - progress / 100)}
                transition={{ duration: 0.1 }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-white">{progress}%</span>
            </div>
          </div>
          <p className="mb-2 text-lg font-semibold text-white">
            {steps[stepIndex]}
          </p>
          <p className="text-sm text-gray-500">{fileName}</p>
        </motion.div>
      ) : (
        <motion.div
          key="skeleton"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35 }}
        >
          {mode === "chat" ? (
            <ChatPageSkeleton statusLabel="Preparing chat..." />
          ) : (
            <>
              {/* Processing indicator */}
              <div className="mb-6 flex items-center justify-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0CF2A0] opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#0CF2A0]" />
                </span>
                <p className="text-sm font-medium text-[#0CF2A0]">
                  Finalizing your summary...
                </p>
              </div>
              <SummaryViewerSkeleton />
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
