"use client";

import { motion } from "motion/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs } from "@/data/faqs";

const FAQ = () => {
  return (
    <section className="py-24 bg-[#0a0a0a] relative" id="faq">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-75 bg-[#0CF2A0]/3 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 md:px-10 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="md:sticky md:top-24 md:self-start"
          >
            <span className="text-[#0CF2A0] text-sm font-semibold uppercase tracking-widest mb-4 block">
              FAQs
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
              Your questions answered
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Everything you need to know about Summarist.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <Accordion type="single" collapsible className="space-y-0">
              {faqs.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="border-b border-white/8 py-1"
                >
                  <AccordionTrigger className="text-white text-left font-medium hover:no-underline py-5 text-[15px] hover:text-[#0CF2A0] transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400 leading-relaxed pb-5 text-sm">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
