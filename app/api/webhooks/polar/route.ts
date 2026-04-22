import { Webhooks } from "@polar-sh/nextjs";

import {
  handleSubscriptionActive,
  handleSubscriptionCanceled,
  handleSubscriptionUpdated,
} from "@/lib/payments";
import { POLAR_WEBHOOK_SECRET } from "@/utils/polar";

export const POST = Webhooks({
  webhookSecret: POLAR_WEBHOOK_SECRET,

  // Fires when a subscription becomes active (new subscription OR reactivation after trial)
  onSubscriptionActive: async (payload) => {
    await handleSubscriptionActive(payload);
  },

  // Fires on any subscription update (plan change, renewal, etc.)
  onSubscriptionUpdated: async (payload) => {
    await handleSubscriptionUpdated(payload);
  },

  // Fires when a subscription is cancelled (at period end)
  onSubscriptionCanceled: async (payload) => {
    await handleSubscriptionCanceled(payload);
  },

  // Fires when a subscription access is fully revoked (after period ends)
  onSubscriptionRevoked: async (payload) => {
    await handleSubscriptionCanceled(payload);
  },

  // fires whenever ANYTHING changes about a customer's billing state.
  onCustomerStateChanged: async () => {
    // // payload.data contains full customer state including all subscriptions
    console.warn("[Polar Webhook] customer.state_changed received");
  },
  onOrderPaid: async (payload) => {
    // Optional: record successful payment for analytics
    console.warn("[Polar Webhook] Order paid:", payload.data.id);
  },
});
