"use client";

import { motion } from "motion/react";
import {
  FileText,
  MessageSquare,
  Layers,
  Sparkles,
  BookOpen,
  Brain,
} from "lucide-react";

const Features = () => {
  return (
    <section
      id="features"
      className="py-24 bg-[#0a0a0a] relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(12,242,160,0.04),transparent_50%)]" />
      <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="text-[#0CF2A0] text-sm font-semibold uppercase tracking-[0.15em] mb-3 block">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Everything you need to master PDFs
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Powerful AI tools designed to transform how you work with documents.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="md:col-span-7 bg-linear-to-br from-[#111] to-[#0d0d0d] rounded-2xl p-8 border border-gray-800/60 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#0CF2A0]/5 rounded-full blur-3xl group-hover:bg-[#0CF2A0]/10 transition-all duration-700" />
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#0CF2A0]/10 border border-[#0CF2A0]/20 flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6 text-[#0CF2A0]" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Instant Summaries
                </h3>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                Upload a 100-page report and get a structured summary with key
                points, insights, and action items in under 10 seconds.
              </p>
              <div className="flex flex-wrap gap-2">
                {["Key Points", "Action Items", "Highlights"].map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-[#0CF2A0]/10 text-[#0CF2A0] px-3 py-1 rounded-xl border border-[#0CF2A0]/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="md:col-span-5 bg-linear-to-br from-[#111] to-[#0d0d0d] rounded-2xl p-8 border border-gray-800/60 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl group-hover:bg-purple-500/10 transition-all duration-700" />
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Chat with PDF</h3>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                Ask questions in plain language. Get precise answers with page
                references.
              </p>
              <div className="flex flex-wrap gap-2">
                {["What are the key findings?", "Summarize section 3"].map(
                  (q) => (
                    <div
                      key={q}
                      className="text-xs bg-white/5 text-gray-300 px-3 py-2 rounded-xl border border-gray-700/50 flex items-center gap-2"
                    >
                      <Brain className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      {q}
                    </div>
                  ),
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="md:col-span-4 bg-[#111] rounded-2xl p-6 border border-gray-800/60 flex items-start gap-4 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-all duration-700" />
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 relative z-10">
              <Layers className="w-5 h-5 text-blue-400" />
            </div>
            <div className="relative z-10">
              <h4 className="text-white font-semibold mb-1">Multi-Format</h4>
              <p className="text-gray-500 text-sm">
                Any PDF format, any language, any size
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="md:col-span-4 bg-[#111] rounded-2xl p-6 border border-gray-800/60 flex items-start gap-4 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-all duration-700" />
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 relative z-10">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div className="relative z-10">
              <h4 className="text-white font-semibold mb-1">AI-Powered</h4>
              <p className="text-gray-500 text-sm">
                Latest models for accurate analysis
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="md:col-span-4 bg-[#111] rounded-2xl p-6 border border-gray-800/60 flex items-start gap-4 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl group-hover:bg-rose-500/10 transition-all duration-700" />
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0 relative z-10">
              <BookOpen className="w-5 h-5 text-rose-400" />
            </div>
            <div className="relative z-10">
              <h4 className="text-white font-semibold mb-1">Smart Insights</h4>
              <p className="text-gray-500 text-sm">
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
