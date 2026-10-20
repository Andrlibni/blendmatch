"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { sortOptions, type SortOption } from "@/lib/catalog";

export function SortSelect({ value, hrefs }: { value: SortOption; hrefs: Record<SortOption, string> }) {
  const t = useTranslations("shop.sort");
  const router = useRouter();
  return (
    <label className="flex items-center gap-3">
      <span className="eyebrow text-muted">{t("label")}</span>
      <select
        value={value}
        onChange={(e) => router.push(hrefs[e.target.value as SortOption], { scroll: false })}
        className="eyebrow cursor-pointer border-b border-ink bg-transparent py-1 pr-6"
      >
        {sortOptions.map((o) => (
          <option key={o} value={o}>
            {t(o)}
          </option>
        ))}
      </select>
    </label>
  );
}
