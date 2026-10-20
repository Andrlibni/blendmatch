"use client";

import { useTranslations } from "next-intl";
import { useShop } from "@/components/providers/ShopProvider";
import type { CartSummary } from "@/lib/pricing";
import { formatNumber } from "@/lib/format";

export function OrderSummary({ summary }: { summary: CartSummary }) {
  const t = useTranslations("cart.summary");
  const { money, locale } = useShop();
  const trade = summary.mode === "trade";

  const row = (label: string, value: string, strong = false) => (
    <div key={label} className={`flex items-baseline justify-between gap-4 py-2 ${strong ? "text-base font-medium" : "text-sm"}`}>
      <dt>{label}</dt>
      <dd className="tabular-nums">{value}</dd>
    </div>
  );

  return (
    <div>
      <dl className="border-b hairline pb-3">
        {row(trade ? t("subtotalEx") : t("subtotal"), money(summary.subtotal))}
        {summary.discount > 0 &&
          row(
            t("discount", { rate: formatNumber(summary.discountRate * 100, locale, 0) }),
            `− ${money(summary.discount)}`,
          )}
        {row(
          t("shipping"),
          summary.shipping === null
            ? t("shippingQuoted")
            : summary.shipping === 0
              ? t("free")
              : money(summary.shipping),
        )}
        {trade &&
          summary.vat.map((v) =>
            row(t("vat", { rate: formatNumber(v.rate * 100, locale, 0) }), money(v.amount)),
          )}
      </dl>
      <dl className="pt-2">{row(trade ? t("totalTrade") : t("total"), money(summary.total), true)}</dl>
      <p className="mt-2 text-xs leading-relaxed text-muted">
        {trade && summary.regime ? t(`regime.${summary.regime}`) : t("inclVat")}
      </p>
    </div>
  );
}
