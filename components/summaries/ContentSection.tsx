import React from "react";

import { motion } from "motion/react";

import { containerVarient, itemVarient } from "@/utils/constants";
import { parseEmojiPoint, parsePoint } from "@/utils/summary-helpers";

const EmojiPoint = ({ point }: { point: string }) => {
  const { emoji, text } = parseEmojiPoint(point) ?? {};
  return (
    <motion.div className="group relative rounded-2xl border border-gray-500/10 bg-linear-to-br from-gray-200/8 to-gray-400/3 p-3 transition-all hover:shadow-lg">
      <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-gray-500/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
      <div className="relative flex items-start gap-3">
        <span className="shrink-0 pt-1 text-lg lg:text-xl">{emoji}</span>
        <p className="text-muted-foreground/90 text-lg leading-relaxed font-medium lg:text-xl">
          {text}
        </p>
      </div>
    </motion.div>
  );
};

const RegularPoint = ({ point }: { point: string }) => {
  return (
    <motion.div className="group relative rounded-2xl border border-gray-500/10 bg-linear-to-br from-gray-200/8 to-gray-400/3 p-4 transition-all hover:shadow-lg">
      <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-gray-500/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
        <p className="text-muted-foreground/90 relative text-left text-xl leading-relaxed lg:text-xl">
          {point}
        </p>
      </div>
    </motion.div>
  );
};

const ContentSection = ({
  title,
  points,
}: {
  title: string;
  points: string[];
}) => {
  return (
    <motion.div
      variants={containerVarient}
      key={points.join("")}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-4"
    >
      {points.map((point, index) => {
        const { isMainPoint, hasEmoji, isEmpty } = parsePoint(point);

        if (isEmpty) return null;

        if (hasEmoji || isMainPoint) {
          return <EmojiPoint key={`point-${index}`} point={point} />;
        }
        return <RegularPoint key={`point-${index}`} point={point} />;
      })}
    </motion.div>
  );
};

export default ContentSection;
