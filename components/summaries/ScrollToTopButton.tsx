"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

interface ScrollToTopButtonProps {
  show: boolean;
}

export default function ScrollToTopButton({ show }: ScrollToTopButtonProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed right-8 bottom-8 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-[#0CF2A0] text-[#111111] shadow-lg shadow-[#0CF2A0]/20 transition-shadow hover:shadow-[#0CF2A0]/40"
        >
          <ArrowUp className="h-5 w-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
