import React, { ReactNode } from "react";
import { motion } from "motion/react";

// ── Marquee Component ──
const Marquee: React.FC<{
  children: ReactNode;
  speed?: number;
  direction?: "left" | "right";
}> = ({ children, speed = 30, direction = "left" }) => {
  return (
    <div className="overflow-hidden whitespace-nowrap">
      <motion.div
        className="inline-flex gap-8"
        animate={{ x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
};

const ScrollingMarquee = () => {
  const marqueeItems = [
    "Research Papers",
    "Legal Contracts",
    "Financial Reports",
    "Technical Docs",
    "eBooks",
    "Medical Records",
    "Academic Journals",
    "Business Plans",
    "Whitepapers",
    "Manuals",
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 1 }}
      className="mb-8"
    >
      <p className="text-center text-xs uppercase text-gray-600 tracking-[0.2em] mb-4 font-medium">
        Works with every PDF type
      </p>
      <Marquee speed={40}>
        {marqueeItems.map((item) => (
          <span
            key={item}
            className="inline-flex items-center gap-2 text-sm text-gray-500 font-medium"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#0CF2A0]/40" />
            {item}
          </span>
        ))}
      </Marquee>
    </motion.div>
  );
};

export default ScrollingMarquee;
