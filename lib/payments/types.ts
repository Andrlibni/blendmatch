export type CheckoutOrder = {
  id: string;
  number: string;
  email: string;
  currency: "EUR" | "GBP";
  /** Total in the order currency. */
  amount: number;
  lines: { name: string; qty: number; unitAmount: number }[];
};

export interface PaymentProvider {
  name: string;
  /** Starts a payment and returns where to send the customer next. */
  createCheckout(order: CheckoutOrder, urls: { success: string; cancel: string }): Promise<{
    redirectUrl: string;
    /** True when the payment is already settled (mock provider). */
    paid: boolean;
  }>;
}
