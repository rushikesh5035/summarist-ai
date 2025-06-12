import Stripe from "stripe";
import { getDBConnection } from "@/lib/db";

export const handleCheckoutSessionCompleted = async ({
  session,
  stripe,
}: {
  session: Stripe.Checkout.Session;
  stripe: Stripe;
}) => {
  //
  console.log("Checkout session completed", session);

  const customerId = session.customer as string;
  const customer = await stripe.customers.retrieve(customerId);
  const priceId = session.line_items?.data[0].price?.id;

  if ("email" in customer && priceId) {
    const sql = await getDBConnection();

    await createOrUpdateUser({
      email: customer.email as string,
      fullName: customer.name as string,
      customerId,
      priceId: priceId as string,
      status: "active",
    });

    await createPayment({
      session,
      priceId: priceId as string,
      userEmail: customer.email as string,
    });
  }
};

export const handleSubscriptionDeleted = async ({
  subscriptionId,
  stripe,
}: {
  subscriptionId: string;
  stripe: Stripe;
}) => {
  console.log("subscription deleted", subscriptionId);
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    const sql = await getDBConnection();

    await sql`UPDATE users SET status = 'cancelled' WHERE customer_id=${subscription.customer}`;

    console.log("subscription cancelled successfully");
  } catch (error) {
    console.error("Errror handling subscription deleted", error);
  }
};

// create or update user in DB
async function createOrUpdateUser({
  email,
  fullName,
  customerId,
  priceId,
  status,
}: {
  email: string;
  fullName: string;
  customerId: string;
  priceId: string;
  status: string;
}) {
  try {
    const sql = await getDBConnection();
    const user = await sql`SELECT * FROM users WHERE email=${email}`;

    if (user.length === 0) {
      await sql`INSERT INTO users (email, full_name, customer_id, price_id, status) VALUES (${email},${fullName}, ${customerId}, ${priceId}, ${status} )`;
    }
  } catch (error) {
    console.error("Error creating or updating user", error);
  }
}

// Insert payment in DB
async function createPayment({
  session,
  priceId,
  userEmail,
}: {
  session: Stripe.Checkout.Session;
  priceId: string;
  userEmail: string;
}) {
  try {
    const sql = await getDBConnection();
    const { amount_total, status, id } = session;
    await sql`INSERT INTO payments (amount, status, stripe_payment_id, price_id, user_email) VALUES (${amount_total}, ${status}, ${id}, ${priceId}, ${userEmail})`;
  } catch (error) {
    console.error("Error creating payment", error);
  }
}
