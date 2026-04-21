"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";

import { cases } from "@/data/UseCases";

const UseCases = () => {
  return (
    <section
      className="relative overflow-hidden bg-[#0a0a0a] py-20"
      id="use-cases"
    >
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-80px" }}
          className="mb-14 text-center"
        >
          <span className="mb-4 block text-sm font-semibold tracking-widest text-[#0CF2A0] uppercase">
            Use Cases
          </span>
          <h2 className="mb-5 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            Built for every
            <br />
            <span className="text-gray-500">professional</span>
          </h2>
          <p className="mx-auto max-w-xl text-lg text-gray-400">
            No matter your field, Summarist helps you work smarter with PDFs.
          </p>
        </motion.div>

        <div className="grid auto-rows-[minmax(200px,auto)] grid-cols-1 gap-3 md:grid-cols-3">
          {cases.map((useCase, index) => (
            <motion.div
              key={useCase.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.06,
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
              }}
              viewport={{ once: true, margin: "-80px" }}
              className={`${useCase.span} group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-white/8 bg-linear-to-br from-white/4 to-white/1 p-5 backdrop-blur-md transition-all duration-300 hover:border-white/15 hover:shadow-2xl hover:shadow-black/40 md:p-6`}
            >
              <div
                className={`absolute -top-24 -right-24 h-48 w-48 ${useCase.accentBg} rounded-full opacity-0 blur-[60px] transition-opacity duration-700 ease-out group-hover:opacity-70`}
              />

              <div
                className={`absolute -bottom-24 -left-24 h-48 w-48 ${useCase.accentBg} rounded-full opacity-0 blur-[60px] transition-opacity duration-700 ease-out group-hover:opacity-40`}
              />

              <div className="relative z-10">
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-start gap-2.5">
                    <motion.div
                      className={`h-10 w-10 rounded-xl ${useCase.accentBg} border-2 ${useCase.accentBorder} flex shrink-0 items-center justify-center shadow-lg transition-all duration-300 group-hover:shadow-xl`}
                    >
                      <useCase.icon
                        className={`h-5 w-5 ${useCase.iconColor}`}
                      />
                    </motion.div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] font-bold tracking-[0.2em] text-gray-600 uppercase">
                        {useCase.tag}
                      </span>
                      <h4 className="text-lg font-bold tracking-tight text-white transition-colors group-hover:text-white/90">
                        {useCase.title}
                      </h4>
                    </div>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ scale: 1.15, rotate: 45 }}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 opacity-0 transition-all duration-300 group-hover:opacity-100"
                  >
                    <ArrowUpRight className="h-3.5 w-3.5 text-white/70" />
                  </motion.div>
                </div>

                <p className="text-sm leading-relaxed text-gray-400 transition-colors group-hover:text-gray-300">
                  {useCase.description}
                </p>
              </div>

              <div className="relative z-10">
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className={`inline-flex items-center gap-1.5 text-xs font-bold ${useCase.iconColor} ${useCase.accentBg} rounded-xl border-2 px-3 py-1.5 ${useCase.accentBorder} shadow-lg backdrop-blur-sm`}
                >
                  {useCase.stat}
                </motion.span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCases;
