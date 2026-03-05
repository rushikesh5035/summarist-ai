import React from "react";

import { motion } from "motion/react";

interface Testimonial {
  text: string;
  image: string;
  name: string;
  role: string;
}

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          y: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[...new Array(2)].map((_, index) => (
          <React.Fragment key={index}>
            {props.testimonials.map(({ text, image, name, role }, i) => (
              <div
                className="w-full max-w-xs rounded-2xl border border-white/6 bg-white/2 p-8 shadow-lg shadow-[#0CF2A0]/3 backdrop-blur-sm"
                key={i}
              >
                <p className="text-[15px] leading-relaxed text-gray-300">
                  {text}
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <img
                    width={40}
                    height={40}
                    src={image}
                    alt={name}
                    className="h-10 w-10 rounded-full border border-white/10 object-cover"
                  />
                  <div className="flex flex-col">
                    <div className="text-sm leading-5 font-medium tracking-tight text-white">
                      {name}
                    </div>
                    <div className="text-xs leading-5 tracking-tight text-gray-500">
                      {role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
};
