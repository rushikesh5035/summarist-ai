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
    <section className="relative bg-[#0a0a0a] py-24" id="faq">
      <div className="pointer-events-none absolute top-0 left-1/2 h-75 w-150 -translate-x-1/2 rounded-full bg-[#0CF2A0]/3 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 md:px-10">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, margin: "-80px" }}
            className="md:sticky md:top-24 md:self-start"
          >
            <span className="mb-4 block text-sm font-semibold tracking-widest text-[#0CF2A0] uppercase">
              FAQs
            </span>
            <h2 className="mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
              Your questions answered
            </h2>
            <p className="text-lg leading-relaxed text-gray-400">
              Everything you need to know about Summarist.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, margin: "-80px" }}
          >
            <Accordion type="single" collapsible className="space-y-0">
              {faqs.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="border-b border-white/8 py-1"
                >
                  <AccordionTrigger className="bg-transparent py-5 text-left text-[15px] font-medium text-white transition-colors hover:text-[#0CF2A0] hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-sm leading-relaxed text-gray-400">
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
