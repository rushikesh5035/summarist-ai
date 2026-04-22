// "use client";

// import { useEffect, useState } from "react";

// import Link from "next/link";
// import { useRouter } from "next/navigation";

// import { useUser } from "@clerk/nextjs";
// import { ArrowRight, Check, Loader2 } from "lucide-react";
// import { motion } from "motion/react";
// import { toast } from "sonner";

// import { getUserCredits } from "@/actions/credits-actions";
// import { Button } from "@/components/ui/button";
// import { plans } from "@/utils/PricingPlans";

// const planRank: Record<string, number> = { free: 0, pro: 1, unlimited: 2 };

// const Pricing = () => {
//   const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);
//   const [userPlanId, setUserPlanId] = useState<string | null>(null);
//   const [userEmail, setUserEmail] = useState<string | null>(null);
//   const router = useRouter();
//   const { user, isSignedIn } = useUser();

//   useEffect(() => {
//     getUserCredits().then((c) => {
//       if (c) setUserPlanId(c.planId);
//     });
//     if (user?.emailAddresses?.[0]?.emailAddress) {
//       setUserEmail(user.emailAddresses[0].emailAddress);
//     }
//   }, [user]);

//   const handleCheckout = (
//     planId: string,
//     planName: string,
//     productId: string
//   ) => {
//     if (!isSignedIn) {
//       router.push("/sign-in");
//       return;
//     }

//     if (userPlanId) {
//       const currentRank = planRank[userPlanId] ?? 0;
//       const targetRank = planRank[planId] ?? 0;

//       if (currentRank === targetRank) {
//         toast.info(`You're already on the ${planName} plan.`);
//         return;
//       }
//       if (currentRank > targetRank) {
//         toast.info(
//           "You're on a higher plan. Cancel your current plan first to downgrade."
//         );
//         return;
//       }
//     }

//     setLoadingPlanId(planId);

//     // polar checkout - redirect
//     const params = new URLSearchParams({ products: productId });
//     if (userEmail) params.set("customerEmail", userEmail);
//     router.push(`/api/checkout?${params.toString()}`);
//   };

//   return (
//     <section className="relative bg-[#0a0a0a] py-24" id="pricing">
//       <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-10 lg:px-16">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
//           viewport={{ once: true, margin: "-80px" }}
//           className="mb-16 text-center"
//         >
//           <span className="mb-4 block text-sm font-semibold tracking-widest text-[#0CF2A0] uppercase">
//             Pricing
//           </span>
//           <h2 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
//             Simple, transparent
//             <br />
//             <span className="text-gray-500">pricing</span>
//           </h2>
//           <p className="mx-auto max-w-xl text-lg text-gray-400">
//             Start free. Upgrade when you need more. Cancel anytime.
//           </p>
//         </motion.div>

//         <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
//           {plans.map((plan, index) => (
//             <motion.div
//               key={plan.name}
//               initial={{ opacity: 0, y: 24 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{
//                 delay: index * 0.08,
//                 duration: 0.7,
//                 ease: [0.16, 1, 0.3, 1],
//               }}
//               viewport={{ once: true, margin: "-80px" }}
//               whileHover={{ y: -8 }}
//               className={`relative rounded-2xl border p-8 ${
//                 plan.popular
//                   ? "border-[#0CF2A0]/30 bg-linear-to-b from-[#0CF2A0]/10 to-[#111] ring-1 ring-[#0CF2A0]/10"
//                   : "border-gray-800/60 bg-[#111]"
//               }`}
//             >
//               {plan.popular && (
//                 <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
//                   <span className="rounded-full bg-[#0CF2A0] px-4 py-1 text-xs font-bold tracking-wider text-[#0a0a0a] uppercase">
//                     Most Popular
//                   </span>
//                 </div>
//               )}

//               <div className="mb-8">
//                 <h4 className="mb-1 text-xl font-bold text-white">
//                   {plan.name}
//                 </h4>
//                 <p className="text-sm text-gray-500">{plan.subtitle}</p>
//               </div>

//               <div className="mb-8 flex items-baseline">
//                 <span className="text-5xl font-bold text-white">
//                   ${plan.price}
//                 </span>
//                 <span className="ml-2 text-sm text-gray-500">
//                   /{plan.period}
//                 </span>
//               </div>

//               <motion.div
//                 whileHover={{ scale: 1.03 }}
//                 whileTap={{ scale: 0.97 }}
//               >
//                 {plan.productId ? (
//                   <Button
//                     onClick={() =>
//                       handleCheckout(plan.id, plan.name, plan.productId!)
//                     }
//                     disabled={loadingPlanId === plan.id}
//                     className={`w-full gap-2 rounded-xl py-5 text-sm font-bold ${
//                       plan.accent
//                         ? "bg-[#0CF2A0] text-[#0a0a0a] shadow-lg shadow-[#0CF2A0]/20 hover:bg-[#0CF2A0]/90"
//                         : "border border-gray-700 bg-white/5 text-white hover:bg-white/10"
//                     }`}
//                   >
//                     {loadingPlanId === plan.id ? (
//                       <Loader2 className="h-4 w-4 animate-spin" />
//                     ) : (
//                       <>
//                         {plan.buttonText}
//                         <ArrowRight className="h-4 w-4" />
//                       </>
//                     )}
//                   </Button>
//                 ) : (
//                   <Link href="/sign-up">
//                     <Button className="w-full gap-2 rounded-xl border border-gray-700 bg-white/5 py-5 text-sm font-bold text-white hover:bg-white/10">
//                       {plan.buttonText}
//                       <ArrowRight className="h-4 w-4" />
//                     </Button>
//                   </Link>
//                 )}
//               </motion.div>

//               <div className="mt-8 space-y-3.5">
//                 {plan.features.map((feature) => (
//                   <div key={feature} className="flex items-center gap-3">
//                     <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0CF2A0]/10">
//                       <Check className="h-3 w-3 text-[#0CF2A0]" />
//                     </div>
//                     <span className="text-sm text-gray-400">{feature}</span>
//                   </div>
//                 ))}
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Pricing;

"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useUser } from "@clerk/nextjs";
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
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    getUserCredits().then((c) => {
      if (c) setUserPlanId(c.planId);
    });
    if (user?.emailAddresses?.[0]?.emailAddress) {
      setUserEmail(user.emailAddresses[0].emailAddress);
    }
  }, [user]);

  const handleCheckout = (
    planId: string,
    planName: string,
    productId: string
  ) => {
    // Guard: user not signed in
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    // Guard: already on this plan or higher
    if (userPlanId) {
      const currentRank = planRank[userPlanId] ?? 0;
      const targetRank = planRank[planId] ?? 0;

      if (currentRank === targetRank) {
        toast.info(`You're already on the ${planName} plan.`);
        return;
      }
      if (currentRank > targetRank) {
        toast.info(
          "You're on a higher plan. Cancel your current plan first to downgrade."
        );
        return;
      }
    }

    setLoadingPlanId(planId);

    // ✅ Polar checkout: just redirect to GET /api/checkout?products=PRODUCT_ID
    // Optionally pass customerEmail to pre-fill the checkout form
    const params = new URLSearchParams({ products: productId });
    if (userEmail) params.set("customerEmail", userEmail);

    // Navigate to the checkout handler which redirects to Polar hosted checkout
    router.push(`/api/checkout?${params.toString()}`);
  };

  return (
    <section className="relative bg-[#0a0a0a] py-24" id="pricing">
      <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-80px" }}
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
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.08,
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
              }}
              viewport={{ once: true, margin: "-80px" }}
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
                {plan.productId ? (
                  <Button
                    onClick={() =>
                      handleCheckout(plan.id, plan.name, plan.productId!)
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
                  <Button
                    asChild
                    className="w-full gap-2 rounded-xl border border-gray-700 bg-white/5 py-5 text-sm font-bold text-white hover:bg-white/10"
                  >
                    <Link href="/sign-up">
                      {plan.buttonText}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
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
