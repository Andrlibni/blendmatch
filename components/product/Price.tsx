"use client";

import { useTranslations } from "next-intl";
import { useShop } from "@/components/providers/ShopProvider";
import type { Product } from "@/data/types";

export function Price({ product, size = "md" }: { product: Product; size?: "md" | "lg" }) {
  const t = useTranslations("price");
  const { trade, money } = useShop();
  const unit = product.kind === "wine" ? t("perBottle") : t("each");
  const big = size === "lg" ? "text-2xl" : "text-[0.95rem]";

  if (trade) {
    return (
      <p className="flex flex-wrap items-baseline gap-x-2">
        <span className={`${big} font-medium tabular-nums`}>{money(product.tradePrice)}</span>
        <s className="text-sm text-muted tabular-nums" aria-label={t("retailWas")}>
          {money(product.retailPrice)}
        </s>
        <span className="eyebrow text-muted">{t("exVat")}</span>
      </p>
    );
  }

  return (
    <p className="flex flex-wrap items-baseline gap-x-2">
      <span className={`${big} font-medium tabular-nums`}>{money(product.retailPrice)}</span>
      <span className="eyebrow text-muted">{unit}</span>
    </p>
  );
}
