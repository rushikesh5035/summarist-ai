ALTER TABLE "subscription" RENAME COLUMN "stripe_customer_id" TO "polar_customer_id";--> statement-breakpoint
ALTER TABLE "subscription" RENAME COLUMN "stripe_subscription_id" TO "polar_subscription_id";--> statement-breakpoint
ALTER TABLE "subscription" RENAME COLUMN "price_id" TO "polar_product_id";
