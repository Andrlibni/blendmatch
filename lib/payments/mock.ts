import type { PaymentProvider } from "./types";

/** Simulated payment: every checkout succeeds immediately. */
export const mockProvider: PaymentProvider = {
  name: "mock",
  async createCheckout(_order, urls) {
    return { redirectUrl: urls.success, paid: true };
  },
};
