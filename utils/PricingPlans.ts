import { isDev } from "@/utils/helper";

export const plans = [
  {
    id: "free",
    name: "Free",
    subtitle: "Get started",
    price: 0,
    period: "forever",
    features: [
      "2 PDF summaries / month",
      "2 PDF chats / month",
      "Standard processing",
      "Email support",
    ],
    buttonText: "Start Free",
    popular: false,
    accent: false,
    paymentLink: null, // no checkout needed — free plan
    priceId: null,
  },
  {
    id: "pro",
    name: "Pro",
    subtitle: "For power users",
    price: 5,
    period: "month",
    features: [
      "10 PDF summaries / month",
      "10 PDF chats / month",
      "Priority processing",
      "24/7 priority support",
      "Markdown export",
      "Docs export",
    ],
    buttonText: "Go Pro",
    popular: true,
    accent: true,
    paymentLink: isDev
      ? "https://buy.stripe.com/test_14AeV68Hz0ThbWn6l7dUY02"
      : "https://buy.stripe.com/YOUR_PRO_LINK",
    priceId: isDev ? "price_1T97Wv2LylM2AQ375vrRpJEs" : "price_LIVE_PRO_ID",
  },
  {
    id: "unlimited",
    name: "Unlimited",
    subtitle: "No limits, ever",
    price: 20,
    period: "month",
    features: [
      "Unlimited PDF summaries",
      "Unlimited PDF chats",
      "Priority processing",
      "24/7 priority support",
      "Markdown export",
      "Docs export",
    ],
    buttonText: "Go Unlimited",
    popular: false,
    accent: false,
    paymentLink: isDev
      ? "https://buy.stripe.com/test_00wcMY0b3gSf0dFfVHdUY03"
      : "https://buy.stripe.com/YOUR_UNLIMITED_LINK",
    priceId: isDev
      ? "price_1T97ZV2LylM2AQ37pbH5KH8f"
      : "price_LIVE_UNLIMITED_ID",
  },
];
