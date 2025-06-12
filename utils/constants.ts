import { isDev } from "@/utils/helper";

export const pricingPlans = [
  {
    name: "Basic",
    price: 7,
    description: "Perfect for occasinal use",
    items: [
      "5 PDF summaries per month",
      "Standard processing speed",
      "Email support",
    ],
    id: "basic",
    paymentLink: isDev
      ? "https://buy.stripe.com/test_fZu4gs2jb45t2lNeRDdUY01"
      : "",
    priceId: isDev ? "price_1RWVmJ2LylM2AQ37bPxiYzPg" : "",
  },
  {
    name: "Pro",
    price: 15,
    description: "For professionals and teams",
    items: [
      "Unlimited PDF summaries",
      "Priority processing",
      "24/7 priority support",
      "Markdown Export",
    ],
    id: "pro",
    paymentLink: isDev
      ? "https://buy.stripe.com/test_6oUbIUcXPcBZ4tVbFrdUY00"
      : "",
    priceId: isDev ? "price_1RWVmJ2LylM2AQ37gnG24lfU" : "",
  },
];

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
