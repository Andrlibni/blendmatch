import type { CountryCode } from "@/lib/config";

/** VAT number patterns, without the country prefix. */
export const vatPatterns: Record<CountryCode, RegExp> = {
  AT: /^U\d{8}$/,
  BE: /^[01]\d{9}$/,
  DE: /^\d{9}$/,
  DK: /^\d{8}$/,
  FI: /^\d{8}$/,
  IE: /^(\d{7}[A-W][A-I]?|\d[A-Z+*]\d{5}[A-W])$/,
  IT: /^\d{11}$/,
  NL: /^\d{9}B\d{2}$/,
  SE: /^\d{10}01$/,
  GB: /^(\d{9}|\d{12}|GD[0-4]\d{2}|HA[5-9]\d{2})$/,
  // Norwegian organisation number, optionally followed by MVA (VAT registered).
  NO: /^\d{9}(MVA)?$/,
};

/** Example shown as a placeholder in the form. */
export const vatExamples: Record<CountryCode, string> = {
  AT: "ATU12345678",
  BE: "BE0123456789",
  DE: "DE123456789",
  DK: "DK12345678",
  FI: "FI12345678",
  IE: "IE1234567FA",
  IT: "IT12345678901",
  NL: "NL123456789B01",
  SE: "SE123456789001",
  GB: "GB123456789",
  NO: "NO123456789MVA",
};

/** Uppercases, strips spaces/punctuation and the country prefix. */
export function normalizeVat(country: CountryCode, raw: string) {
  let value = raw.toUpperCase().replace(/[^A-Z0-9+*]/g, "");
  if (value.startsWith(country)) value = value.slice(country.length);
  return value;
}

export function displayVat(country: CountryCode, normalized: string) {
  return `${country}${normalized}`;
}
