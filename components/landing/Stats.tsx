"use client";

import { useEffect, useRef, useState } from "react";

import { motion, useInView } from "motion/react";

import { stats } from "@/data/Stats";

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
    <section className="relative overflow-hidden bg-[#0a0a0a] py-20">
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-[#0CF2A0]/2 to-transparent" />
      <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.08,
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
              }}
              viewport={{ once: true, margin: "-80px" }}
              className="rounded-2xl border border-gray-800/40 bg-[#111]/60 p-4 text-center"
            >
              <div className="mb-1 text-4xl font-bold text-white tabular-nums md:text-5xl">
                <AnimatedNumber target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="mb-1 text-sm font-semibold text-[#0CF2A0]">
                {stat.label}
              </div>
              <div className="text-xs text-gray-600">{stat.description}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
