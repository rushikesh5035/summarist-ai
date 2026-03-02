"use client";

import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { cases } from "@/data/UseCases";

const UseCases = () => {
  return (
    <section
      className="py-20 bg-[#0a0a0a] relative overflow-hidden"
      id="use-cases"
    >
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-[#0CF2A0] text-sm font-semibold uppercase tracking-widest mb-4 block">
            Use Cases
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 tracking-tight">
            Built for every
            <br />
            <span className="text-gray-500">professional</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-xl mx-auto">
            No matter your field, Summarist helps you work smarter with PDFs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[minmax(200px,auto)] gap-3">
          {cases.map((useCase, index) => (
            <motion.div
              key={useCase.title}
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.07, duration: 0.5 }}
              viewport={{ once: true }}
              className={`${useCase.span} group relative rounded-2xl border border-white/8 bg-linear-to-br from-white/4 to-white/1 backdrop-blur-md p-5 md:p-6 flex flex-col justify-between overflow-hidden cursor-pointer transition-all duration-300 hover:border-white/15 hover:shadow-2xl hover:shadow-black/40`}
            >
              <div
                className={`absolute -top-24 -right-24 w-48 h-48 ${useCase.accentBg} rounded-full blur-[60px] opacity-0 group-hover:opacity-70 transition-opacity duration-700 ease-out`}
              />

              <div
                className={`absolute -bottom-24 -left-24 w-48 h-48 ${useCase.accentBg} rounded-full blur-[60px] opacity-0 group-hover:opacity-40 transition-opacity duration-700 ease-out`}
              />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-2.5">
                    <motion.div
                      className={`w-10 h-10 rounded-xl ${useCase.accentBg} border-2 ${useCase.accentBorder} flex items-center justify-center shadow-lg transition-all duration-300 group-hover:shadow-xl shrink-0`}
                    >
                      <useCase.icon
                        className={`w-5 h-5 ${useCase.iconColor}`}
                      />
                    </motion.div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-600">
                        {useCase.tag}
                      </span>
                      <h4 className="text-lg font-bold text-white tracking-tight group-hover:text-white/90 transition-colors">
                        {useCase.title}
                      </h4>
                    </div>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ scale: 1.15, rotate: 45 }}
                    className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5 text-white/70" />
                  </motion.div>
                </div>

                <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                  {useCase.description}
                </p>
              </div>

              <div className="relative z-10">
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className={`inline-flex items-center gap-1.5 text-xs font-bold ${useCase.iconColor} ${useCase.accentBg} px-3 py-1.5 rounded-xl border-2 ${useCase.accentBorder} shadow-lg backdrop-blur-sm`}
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
