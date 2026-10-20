import { defineRouting } from "next-intl/routing";

export const locales = ["en", "it", "de", "da", "sv", "nl"] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: "English",
  it: "Italiano",
  de: "Deutsch",
  da: "Dansk",
  sv: "Svenska",
  nl: "Nederlands",
};

export const routing = defineRouting({
  locales,
  defaultLocale: "en",
  localePrefix: "always",
});
