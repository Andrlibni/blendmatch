"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { setCurrency } from "@/app/actions/preferences";
import { currencies } from "@/lib/config";
import { useShop } from "@/components/providers/ShopProvider";

export function CurrencySwitcher() {
  const t = useTranslations("topbar");
  const { currency } = useShop();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div role="group" aria-label={t("currency")} className="flex items-center gap-1">
      {currencies.map((c, i) => (
        <span key={c} className="flex items-center gap-1">
          {i > 0 && <span aria-hidden="true" className="opacity-40">/</span>}
          <button
            type="button"
            disabled={pending}
            aria-pressed={currency === c}
            onClick={() =>
              startTransition(async () => {
                await setCurrency(c);
                router.refresh();
              })
            }
            className={`eyebrow transition-opacity duration-300 ${
              currency === c ? "opacity-100 underline underline-offset-4" : "opacity-60 hover:opacity-100"
            }`}
          >
            {c === "EUR" ? "€ EUR" : "£ GBP"}
          </button>
        </span>
      ))}
    </div>
  );
}
