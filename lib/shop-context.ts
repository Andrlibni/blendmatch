import "server-only";
import { cookies } from "next/headers";
import { cache } from "react";
import { auth } from "@/auth";
import { db } from "./db";
import { GBP_PER_EUR, isCountryCode, type Currency, type CountryCode } from "./config";
import { vatRegimeFor, type VatRegime } from "./vat-regime";

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

/** The signed-in trade account, re-read from the database on every request
 *  so that revoking approval takes effect immediately. */
export const getTradeAccount = cache(async () => {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) return null;
  const account = await db.tradeAccount.findUnique({ where: { id } });
  return account?.approved ? account : null;
});

export const getTradeInfo = cache(async (): Promise<TradeInfo | null> => {
  const account = await getTradeAccount();
  if (!account || !isCountryCode(account.country)) return null;
  const { regime, rate } = vatRegimeFor(account.country);
  return {
    accountId: account.id,
    company: account.company,
    email: account.email,
    vatNumber: account.vatNumber,
    country: account.country,
    regime,
    vatRate: rate,
  };
});

export async function isAdmin() {
  return (await getTradeAccount())?.role === "admin";
}

export async function getShopContext(): Promise<ShopContext> {
  const [currency, trade] = await Promise.all([getCurrency(), getTradeInfo()]);
  return { currency, rate: GBP_PER_EUR, trade };
}
