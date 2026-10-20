import { GBP_PER_EUR, type Currency } from "./config";

const intlLocale: Record<string, string> = {
  en: "en-GB",
  it: "it-IT",
  de: "de-DE",
  da: "da-DK",
  sv: "sv-SE",
  nl: "nl-NL",
};

export function convert(amountEur: number, currency: Currency, rate = GBP_PER_EUR) {
  return currency === "GBP" ? amountEur * rate : amountEur;
}

export function formatMoney(
  amountEur: number,
  currency: Currency,
  locale: string,
  rate = GBP_PER_EUR,
) {
  return new Intl.NumberFormat(intlLocale[locale] ?? "en-GB", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(convert(amountEur, currency, rate));
}

export function formatNumber(value: number, locale: string, digits = 1) {
  return new Intl.NumberFormat(intlLocale[locale] ?? "en-GB", {
    maximumFractionDigits: digits,
  }).format(value);
}
