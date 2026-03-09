import { plans } from "./PricingPlans";

export const pricingPlans = plans;

// Credit limits per plan id
export const PLAN_LIMITS: Record<string, { summaries: number; chats: number }> =
  {
    free: { summaries: 2, chats: 2 },
    pro: { summaries: 10, chats: 10 },
    unlimited: { summaries: 9999, chats: 9999 },
  };

export const containerVarient = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

export const itemVarient = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 50,
      duration: 0.8,
    },
  },
};

export const buttonVarient = {
  scale: 1.05,
  transition: {
    type: "spring",
    stiffness: 300,
    duration: 10,
  },
};

export const listVarient = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", damping: 20, stiffness: 100 },
  },
};
