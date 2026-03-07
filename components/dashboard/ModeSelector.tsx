"use client";

import { motion } from "framer-motion";
import { MessageSquare, Sparkles } from "lucide-react";

import ModeCard from "./ModeCard";

type Mode = "summary" | "chat" | null;

interface ModeSelectorProps {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
}

export default function ModeSelector({
  mode,
  onModeChange,
}: ModeSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="mx-auto mt-4 max-w-3xl"
    >
      <p className="mb-4 text-sm font-medium text-gray-400">
        Choose how to process your document
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <ModeCard
          icon={<Sparkles className="h-6 w-6" />}
          title="Generate Summary"
          description="Extract key insights, takeaways, and action items automatically"
          selected={mode === "summary"}
          onClick={() => onModeChange("summary")}
        />
        <ModeCard
          icon={<MessageSquare className="h-6 w-6" />}
          title="Chat with PDF"
          description="Ask questions and get contextual answers from your document"
          selected={mode === "chat"}
          onClick={() => onModeChange("chat")}
        />
      </div>
    </motion.div>
  );
}
