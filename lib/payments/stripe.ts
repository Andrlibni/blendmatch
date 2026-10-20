import type { PaymentProvider } from "./types";

/**
 * Stripe Checkout adapter, ready to be completed:
 *   1. npm i stripe
 *   2. set PAYMENT_PROVIDER="stripe" and STRIPE_SECRET_KEY
 *   3. uncomment the implementation below
 *   4. add a webhook route (app/api/stripe/webhook/route.ts) that listens to
 *      `checkout.session.completed` and marks the order as "paid".
 */
export const stripeProvider: PaymentProvider = {
  name: "stripe",
  async createCheckout(/* order, urls */) {
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    // const session = await stripe.checkout.sessions.create({
    //   mode: "payment",
    //   customer_email: order.email,
    //   client_reference_id: order.id,
    //   metadata: { orderNumber: order.number },
    //   line_items: order.lines.map((l) => ({
    //     quantity: l.qty,
    //     price_data: {
    //       currency: order.currency.toLowerCase(),
    //       unit_amount: Math.round(l.unitAmount * 100),
    //       product_data: { name: l.name },
    //     },
    //   })),
    //   success_url: urls.success,
    //   cancel_url: urls.cancel,
    // });
    // return { redirectUrl: session.url!, paid: false };
    throw new Error("Stripe is not configured yet — see lib/payments/stripe.ts");
  },
};
