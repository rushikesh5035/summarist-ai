"use client";

import { motion } from "framer-motion";

interface ModeCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}

export default function ModeCard({
  icon,
  title,
  description,
  selected,
  onClick,
}: ModeCardProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`rounded-xl border p-5 text-left transition-all duration-200 ${
        selected
          ? "border-[#0CF2A0] bg-[#0CF2A0]/5"
          : "border-gray-700 bg-[#1a1a1a]/50 hover:border-gray-500"
      }`}
    >
      <div
        className={`mb-3 flex gap-3 ${selected ? "text-[#0CF2A0]" : "text-gray-400"}`}
      >
        {icon}
        <h3 className="mb-1 text-base font-semibold text-white">{title}</h3>
      </div>
      <p className="text-sm text-gray-500">{description}</p>
    </motion.button>
  );
}
