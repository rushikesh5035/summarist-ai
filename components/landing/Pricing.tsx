"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { ArrowRight, Check, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

import { getUserCredits } from "@/actions/credits-actions";
import { Button } from "@/components/ui/button";
import { plans } from "@/utils/PricingPlans";

const planRank: Record<string, number> = { free: 0, pro: 1, unlimited: 2 };

const Pricing = () => {
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);
  const [userPlanId, setUserPlanId] = useState<string | null>(null);

  useEffect(() => {
    getUserCredits().then((c) => {
      if (c) setUserPlanId(c.planId);
    });
  }, []);

  const handleCheckout = async (
    planId: string,
    planName: string,
    priceId: string
  ) => {
    // Guard: already on this plan or a higher one
    if (userPlanId) {
      const currentRank = planRank[userPlanId] ?? 0;
      const targetRank = planRank[planId] ?? 0;

      if (currentRank === targetRank) {
        const suffix =
          planId === "pro"
            ? " If you want more, select the Unlimited plan."
            : "";
        toast.info(
          `You're already subscribed to the ${planName} plan.${suffix}`
        );
        return;
      }

      if (currentRank > targetRank) {
        toast.info(
          "You're already on a higher plan. To downgrade, cancel your current subscription first."
        );
        return;
      }
    }

    // Create a Stripe Checkout Session and redirect to it
    setLoadingPlanId(planId);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Could not start checkout. Please try again.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Could not start checkout. Please try again.");
    } finally {
      setLoadingPlanId(null);
    }
  };

  return (
    <section className="relative bg-[#0a0a0a] py-24" id="pricing">
      <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <span className="mb-4 block text-sm font-semibold tracking-widest text-[#0CF2A0] uppercase">
            Pricing
          </span>
          <h2 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            Simple, transparent
            <br />
            <span className="text-gray-500">pricing</span>
          </h2>
          <p className="mx-auto max-w-xl text-lg text-gray-400">
            Start free. Upgrade when you need more. Cancel anytime.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.12, duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className={`relative rounded-2xl border p-8 ${
                plan.popular
                  ? "border-[#0CF2A0]/30 bg-linear-to-b from-[#0CF2A0]/10 to-[#111] ring-1 ring-[#0CF2A0]/10"
                  : "border-gray-800/60 bg-[#111]"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-[#0CF2A0] px-4 py-1 text-xs font-bold tracking-wider text-[#0a0a0a] uppercase">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-8">
                <h4 className="mb-1 text-xl font-bold text-white">
                  {plan.name}
                </h4>
                <p className="text-sm text-gray-500">{plan.subtitle}</p>
              </div>

              <div className="mb-8 flex items-baseline">
                <span className="text-5xl font-bold text-white">
                  ${plan.price}
                </span>
                <span className="ml-2 text-sm text-gray-500">
                  /{plan.period}
                </span>
              </div>

              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {plan.priceId ? (
                  <Button
                    onClick={() =>
                      handleCheckout(plan.id, plan.name, plan.priceId!)
                    }
                    disabled={loadingPlanId === plan.id}
                    className={`w-full gap-2 rounded-xl py-5 text-sm font-bold ${
                      plan.accent
                        ? "bg-[#0CF2A0] text-[#0a0a0a] shadow-lg shadow-[#0CF2A0]/20 hover:bg-[#0CF2A0]/90"
                        : "border border-gray-700 bg-white/5 text-white hover:bg-white/10"
                    }`}
                  >
                    {loadingPlanId === plan.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        {plan.buttonText}
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                ) : (
                  <Link href="/sign-up">
                    <Button className="w-full gap-2 rounded-xl border border-gray-700 bg-white/5 py-5 text-sm font-bold text-white hover:bg-white/10">
                      {plan.buttonText}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
              </motion.div>

              <div className="mt-8 space-y-3.5">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0CF2A0]/10">
                      <Check className="h-3 w-3 text-[#0CF2A0]" />
                    </div>
                    <span className="text-sm text-gray-400">{feature}</span>
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
