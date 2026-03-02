"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const CTA = () => {
  const router = useRouter();
  return (
    <section className="py-24 bg-[#0a0a0a] relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(12, 242, 160, 0.06) 0%, transparent 60%)",
        }}
      />
      <div className="max-w-4xl mx-auto px-6 md:px-10 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
            Ready to unlock your
            <br />
            <span className="text-[#0CF2A0]">PDF superpowers?</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-xl mx-auto mb-10 leading-relaxed">
            Summarize, chat, and extract insights from any PDF in seconds
          </p>
          <motion.div>
            <Button
              onClick={() => router.push("/pdf-tools")}
              className="bg-[#0CF2A0] text-[#0a0a0a] hover:bg-[#0CF2A0]/90 rounded-xl px-20 py-5 text-md font-bold shadow-xl shadow-[#0CF2A0]/20 gap-1.5"
            >
              Try Summarist Free
              <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
