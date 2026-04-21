"use client";

import {
  BookOpen,
  Brain,
  FileText,
  Layers,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";

const Features = () => {
  return (
    <section
      id="features"
      className="relative overflow-hidden bg-[#0a0a0a] py-24"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(12,242,160,0.04),transparent_50%)]" />
      <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14 text-center"
        >
          <span className="mb-3 block text-sm font-semibold tracking-[0.15em] text-[#0CF2A0] uppercase">
            Features
          </span>
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            Everything you need to master PDFs
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-400">
            Powerful AI tools designed to transform how you work with documents.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.05, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="group relative overflow-hidden rounded-2xl border border-gray-800/60 bg-linear-to-br from-[#111] to-[#0d0d0d] p-8 md:col-span-7"
          >
            <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-[#0CF2A0]/5 blur-3xl transition-all duration-700 group-hover:bg-[#0CF2A0]/10" />
            <div className="relative z-10">
              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#0CF2A0]/20 bg-[#0CF2A0]/10">
                  <FileText className="h-6 w-6 text-[#0CF2A0]" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Instant Summaries
                </h3>
              </div>
              <p className="mb-6 leading-relaxed text-gray-400">
                Upload a 100-page report and get a structured summary with key
                points, insights, and action items in under 10 seconds.
              </p>
              <div className="flex flex-wrap gap-2">
                {["Key Points", "Action Items", "Highlights"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-xl border border-[#0CF2A0]/20 bg-[#0CF2A0]/10 px-3 py-1 text-xs text-[#0CF2A0]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="group relative overflow-hidden rounded-2xl border border-gray-800/60 bg-linear-to-br from-[#111] to-[#0d0d0d] p-8 md:col-span-5"
          >
            <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-purple-500/5 blur-3xl transition-all duration-700 group-hover:bg-purple-500/10" />
            <div className="relative z-10">
              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/10">
                  <MessageSquare className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Chat with PDF</h3>
              </div>
              <p className="mb-6 leading-relaxed text-gray-400">
                Ask questions in plain language. Get precise answers with page
                references.
              </p>
              <div className="flex flex-wrap gap-2">
                {["What are the key findings?", "Summarize section 3"].map(
                  (q) => (
                    <div
                      key={q}
                      className="flex items-center gap-2 rounded-xl border border-gray-700/50 bg-white/5 px-3 py-2 text-xs text-gray-300"
                    >
                      <Brain className="h-3.5 w-3.5 shrink-0 text-purple-400" />
                      {q}
                    </div>
                  )
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="group relative flex items-start gap-4 overflow-hidden rounded-2xl border border-gray-800/60 bg-[#111] p-6 md:col-span-4"
          >
            <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-blue-500/5 blur-3xl transition-all duration-700 group-hover:bg-blue-500/10" />
            <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10">
              <Layers className="h-5 w-5 text-blue-400" />
            </div>
            <div className="relative z-10">
              <h4 className="mb-1 font-semibold text-white">Multi-Format</h4>
              <p className="text-sm text-gray-500">
                Any PDF format, any language, any size
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="group relative flex items-start gap-4 overflow-hidden rounded-2xl border border-gray-800/60 bg-[#111] p-6 md:col-span-4"
          >
            <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-amber-500/5 blur-3xl transition-all duration-700 group-hover:bg-amber-500/10" />
            <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10">
              <Sparkles className="h-5 w-5 text-amber-400" />
            </div>
            <div className="relative z-10">
              <h4 className="mb-1 font-semibold text-white">AI-Powered</h4>
              <p className="text-sm text-gray-500">
                Latest models for accurate analysis
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.25, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="group relative flex items-start gap-4 overflow-hidden rounded-2xl border border-gray-800/60 bg-[#111] p-6 md:col-span-4"
          >
            <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-rose-500/5 blur-3xl transition-all duration-700 group-hover:bg-rose-500/10" />
            <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-rose-500/20 bg-rose-500/10">
              <BookOpen className="h-5 w-5 text-rose-400" />
            </div>
            <div className="relative z-10">
              <h4 className="mb-1 font-semibold text-white">Smart Insights</h4>
              <p className="text-sm text-gray-500">
                Beyond summaries — actionable takeaways
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Features;
