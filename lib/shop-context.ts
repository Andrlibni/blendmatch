import "server-only";
import { cookies } from "next/headers";
import { GBP_PER_EUR, type Currency, type CountryCode } from "./config";
import type { VatRegime } from "./vat-regime";

export type TradeInfo = {
  accountId: string;
  company: string;
  email: string;
  vatNumber: string;
  country: CountryCode;
  regime: VatRegime;
  vatRate: number;
};

export type ShopContext = {
  currency: Currency;
  rate: number;
  trade: TradeInfo | null;
};

export const CURRENCY_COOKIE = "lento_currency";
export const AGE_COOKIE = "lento_age";

export async function getCurrency(): Promise<Currency> {
  const store = await cookies();
  return store.get(CURRENCY_COOKIE)?.value === "GBP" ? "GBP" : "EUR";
}

export async function getTradeInfo(): Promise<TradeInfo | null> {
  return null;
}

export async function getShopContext(): Promise<ShopContext> {
  const [currency, trade] = await Promise.all([getCurrency(), getTradeInfo()]);
  return { currency, rate: GBP_PER_EUR, trade };
}
