"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { localeNames, locales, type Locale } from "@/i18n/routing";

export function LocaleSwitcher({ className = "" }: { className?: string }) {
  const t = useTranslations("topbar");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  return (
    <label className={`inline-flex items-center gap-2 ${className}`}>
      <span className="sr-only">{t("language")}</span>
      <select
        value={locale}
        disabled={pending}
        onChange={(e) => {
          const next = e.target.value as Locale;
          startTransition(() => {
            router.replace(`${pathname}${window.location.search}`, { locale: next });
          });
        }}
        className="eyebrow cursor-pointer appearance-none bg-transparent pr-1 text-inherit outline-offset-2"
      >
        {locales.map((l) => (
          <option key={l} value={l} className="text-ink">
            {l.toUpperCase()} · {localeNames[l]}
          </option>
        ))}
      </select>
    </label>
  );
}
