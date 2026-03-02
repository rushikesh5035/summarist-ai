"use client";

import { stats } from "@/data/Stats";
import { motion, useInView } from "motion/react";
import { useRef, useState, useEffect } from "react";

const AnimatedNumber: React.FC<{
  target: number;
  suffix?: string;
  prefix?: string;
}> = ({ target, suffix = "", prefix = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

const Stats = () => {
  return (
    <section className="py-20 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-[#0CF2A0]/2 to-transparent" />
      <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center p-4 rounded-2xl bg-[#111]/60 border border-gray-800/40"
            >
              <div className="text-4xl md:text-5xl font-bold text-white mb-1 tabular-nums">
                <AnimatedNumber target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-[#0CF2A0] text-sm font-semibold mb-1">
                {stat.label}
              </div>
              <div className="text-gray-600 text-xs">{stat.description}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
