"use client";

import { motion } from "motion/react";

import { testimonials } from "@/data/Testimonials";

import { TestimonialsColumn } from "../common/testimonials-columns";

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

const Testimonials = () => {
  return (
    <section className="relative overflow-hidden bg-[#0a0a0a] py-24">
      <div className="z-10 mx-auto max-w-6xl px-6 md:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-80px" }}
          className="mx-auto flex max-w-135 flex-col items-center justify-center"
        >
          <span className="block text-sm font-semibold tracking-widest text-[#0CF2A0] uppercase">
            Testimonials
          </span>

          <h2 className="mt-4 text-center text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            What our users say
          </h2>
          <p className="mt-4 text-center text-base text-gray-400">
            See how professionals are transforming their PDF workflows.
          </p>
        </motion.div>

        <div className="mt-12 flex max-h-185 justify-center gap-6 overflow-hidden mask-[linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn
            testimonials={secondColumn}
            className="hidden md:block"
            duration={19}
          />
          <TestimonialsColumn
            testimonials={thirdColumn}
            className="hidden lg:block"
            duration={17}
          />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
