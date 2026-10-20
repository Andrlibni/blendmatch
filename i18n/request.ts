import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import en from "../messages/en.json";

type Messages = Record<string, unknown>;

// Missing keys in a locale fall back to English, so new languages can be
// translated incrementally.
function deepMerge(base: Messages, override: Messages): Messages {
  const out: Messages = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const prev = out[key];
    out[key] =
      value && typeof value === "object" && prev && typeof prev === "object"
        ? deepMerge(prev as Messages, value as Messages)
        : value;
  }
  return out;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const messages =
    locale === "en"
      ? en
      : deepMerge(en, (await import(`../messages/${locale}.json`)).default);

  return { locale, messages };
});
