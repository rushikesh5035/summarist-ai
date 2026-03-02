"use client";

import { Button } from "@/components/ui/button";
import { plans } from "@/data/PricingPlans";
import { Check, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

const Pricing = () => {
  return (
    <section className="py-24 bg-[#0a0a0a] relative" id="pricing">
      {/* <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(12, 242, 160, 0.04) 0%, transparent 60%)",
        }}
      /> */}

      <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[#0CF2A0] text-sm font-semibold uppercase tracking-widest mb-4 block">
            Pricing
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            Simple, transparent
            <br />
            <span className="text-gray-500">pricing</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-xl mx-auto">
            Start free. Upgrade when you need more. Cancel anytime.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.12, duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className={`rounded-2xl p-8 border relative ${
                plan.popular
                  ? "bg-linear-to-b from-[#0CF2A0]/10 to-[#111] border-[#0CF2A0]/30 ring-1 ring-[#0CF2A0]/10"
                  : "bg-[#111] border-gray-800/60"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-[#0CF2A0] text-[#0a0a0a] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-8">
                <h4 className="text-xl font-bold text-white mb-1">
                  {plan.name}
                </h4>
                <p className="text-gray-500 text-sm">{plan.subtitle}</p>
              </div>

              <div className="flex items-baseline mb-8">
                <span className="text-5xl font-bold text-white">
                  ${plan.price}
                </span>
                <span className="text-gray-500 ml-2 text-sm">
                  /{plan.period}
                </span>
              </div>

              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  className={`w-full py-5 rounded-xl font-bold text-sm gap-2 ${
                    plan.accent
                      ? "bg-[#0CF2A0] hover:bg-[#0CF2A0]/90 text-[#0a0a0a] shadow-lg shadow-[#0CF2A0]/20"
                      : "bg-white/5 hover:bg-white/10 text-white border border-gray-700"
                  }`}
                >
                  {plan.buttonText}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>

              <div className="mt-8 space-y-3.5">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#0CF2A0]/10 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-[#0CF2A0]" />
                    </div>
                    <span className="text-gray-400 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
