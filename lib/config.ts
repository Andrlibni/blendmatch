/** Business configuration. Values with an env override can be tuned per deploy. */

export const SITE_NAME = "Lento";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const currencies = ["EUR", "GBP"] as const;
export type Currency = (typeof currencies)[number];

/** How many GBP for 1 EUR. All prices are stored in EUR. */
export const GBP_PER_EUR = Number(process.env.GBP_PER_EUR ?? "0.86");

export const RETAIL_RULES = {
  /** Free shipping threshold, EUR, VAT included. */
  freeShippingFrom: 120,
  /** Flat shipping below the threshold, EUR. */
  shippingFlat: 12,
};

export const TRADE_RULES = {
  /** Wine is sold by the case; cases can be mixed. */
  wineCaseSize: 6,
  /** Minimum wine bottles per trade order. */
  minWineBottles: 12,
  /** Volume discount on wine from this many bottles. */
  discountFromBottles: 36,
  discountRate: 0.05,
};

export const countries = [
  { code: "GB", name: "United Kingdom", eu: false },
  { code: "IE", name: "Ireland", eu: true },
  { code: "DK", name: "Denmark", eu: true },
  { code: "SE", name: "Sweden", eu: true },
  { code: "FI", name: "Finland", eu: true },
  { code: "NO", name: "Norway", eu: false },
  { code: "NL", name: "Netherlands", eu: true },
  { code: "BE", name: "Belgium", eu: true },
  { code: "DE", name: "Germany", eu: true },
  { code: "AT", name: "Austria", eu: true },
  { code: "IT", name: "Italy", eu: true },
] as const;

export type CountryCode = (typeof countries)[number]["code"];

export function isCountryCode(value: unknown): value is CountryCode {
  return countries.some((c) => c.code === value);
}

export function countryName(code: string) {
  return countries.find((c) => c.code === code)?.name ?? code;
}
