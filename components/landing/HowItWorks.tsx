"use client";

import { steps } from "@/data/HowItWorksSteps";
import { motion } from "motion/react";

const HowItWorks = () => {
  return (
    <section className="py-24 bg-[#0a0a0a] relative" id="how-it-works">
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="w-150 h-150 rounded-full bg-[radial-gradient(circle,rgba(12,242,160,0.06)_0%,rgba(12,242,160,0.03)_10%,transparent_70%)]" />
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-[#0CF2A0] text-sm font-semibold uppercase tracking-widest mb-4 block">
            How It Works
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
            Three steps.
            <br />
            <span className="text-gray-500">Zero friction.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
          {/* Connecting line */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeInOut" }}
            viewport={{ once: true }}
            className="hidden md:block absolute top-8 left-[20%] right-[20%] h-px bg-linear-to-r from-transparent via-gray-700 to-transparent origin-left"
          />

          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              viewport={{ once: true }}
              className="relative text-center group"
            >
              <div className="relative w-16 h-16 mx-auto mb-6">
                <div className="absolute inset-0 flex items-center justify-center text-5xl font-black text-gray-800/20 select-none pointer-events-none -top-6">
                  {step.step}
                </div>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-16 h-16 rounded-2xl bg-[#111] border border-gray-800 flex items-center justify-center relative z-10 group-hover:border-[#0CF2A0]/30 transition-colors"
                >
                  <step.icon className="w-7 h-7 text-[#0CF2A0]" />
                </motion.div>
              </div>

              <h4 className="text-xl font-bold text-white mb-3">
                {step.title}
              </h4>
              <p className="text-gray-500 leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
