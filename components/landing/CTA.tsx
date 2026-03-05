"use client";

import { useRouter } from "next/navigation";

import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";

const CTA = () => {
  const router = useRouter();
  return (
    <section className="relative overflow-hidden bg-[#0a0a0a] py-24">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(12, 242, 160, 0.06) 0%, transparent 60%)",
        }}
      />
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="mb-6 text-4xl leading-tight font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            Ready to unlock your
            <br />
            <span className="text-[#0CF2A0]">PDF superpowers?</span>
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-gray-400">
            Summarize, chat, and extract insights from any PDF in seconds
          </p>
          <motion.div>
            <Button
              onClick={() => router.push("/pdf-tools")}
              className="text-md gap-1.5 rounded-xl bg-[#0CF2A0] px-20 py-5 font-bold text-[#0a0a0a] shadow-xl shadow-[#0CF2A0]/20 hover:bg-[#0CF2A0]/90"
            >
              Try Summarist Free
              <ArrowRight className="h-5 w-5" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
