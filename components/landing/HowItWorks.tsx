"use client";

import { motion } from "motion/react";

import { steps } from "@/data/HowItWorksSteps";

const HowItWorks = () => {
  return (
    <section className="relative bg-[#0a0a0a] py-24" id="how-it-works">
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="h-150 w-150 rounded-full bg-[radial-gradient(circle,rgba(12,242,160,0.06)_0%,rgba(12,242,160,0.03)_10%,transparent_70%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-80px" }}
          className="mb-20 text-center"
        >
          <span className="mb-4 block text-sm font-semibold tracking-widest text-[#0CF2A0] uppercase">
            How It Works
          </span>
          <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            Three steps.
            <br />
            <span className="text-gray-500">Zero friction.</span>
          </h2>
        </motion.div>

        <div className="relative mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
          {/* Connecting line */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, margin: "-80px" }}
            className="absolute top-8 right-[20%] left-[20%] hidden h-px origin-left bg-linear-to-r from-transparent via-gray-700 to-transparent md:block"
          />

          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.1,
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
              }}
              viewport={{ once: true, margin: "-80px" }}
              className="group relative text-center"
            >
              <div className="relative mx-auto mb-6 h-16 w-16">
                <div className="pointer-events-none absolute inset-0 -top-6 flex items-center justify-center text-5xl font-black text-gray-800/20 select-none">
                  {step.step}
                </div>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-gray-800 bg-[#111] transition-colors group-hover:border-[#0CF2A0]/30"
                >
                  <step.icon className="h-7 w-7 text-[#0CF2A0]" />
                </motion.div>
              </div>

              <h4 className="mb-3 text-xl font-bold text-white">
                {step.title}
              </h4>
              <p className="mx-auto max-w-xs leading-relaxed text-gray-500">
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
