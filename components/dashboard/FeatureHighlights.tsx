"use client";

import { motion } from "framer-motion";
import { Clock, MessageSquare, Sparkles } from "lucide-react";

interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

const features: FeatureItem[] = [
  {
    icon: <Sparkles className="h-5 w-5 text-[#0CF2A0]" />,
    title: "AI Summaries",
    desc: "Get concise overviews with key points in seconds",
  },
  {
    icon: <MessageSquare className="h-5 w-5 text-purple-400" />,
    title: "Chat with Docs",
    desc: "Ask questions and get instant, cited answers",
  },
  {
    icon: <Clock className="h-5 w-5 text-amber-400" />,
    title: "Save Hours",
    desc: "Process lengthy documents in under a minute",
  },
];

export default function FeatureHighlights() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3"
    >
      {features.map((feat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.35 + i * 0.08,
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="rounded-xl border border-gray-800 bg-[#1a1a1a]/60 p-3 text-center"
        >
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-white/5">
            {feat.icon}
          </div>
          <h3 className="mb-1 text-sm font-semibold text-white">
            {feat.title}
          </h3>
          <p className="text-xs leading-relaxed text-gray-500">{feat.desc}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}
