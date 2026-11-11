import { useLocale } from "next-intl";
import { formatNumber } from "@/lib/format";
import { formatLabel } from "@/lib/catalog";
import type { Product } from "@/data/types";

/** "75 cl / 12,5°" (or the appellation) for wine, "100 ml / Italian Food Treasure" for pantry. */
export function SpecLine({ product }: { product: Product }) {
  const locale = useLocale();
  const format = formatLabel(product);
  const second =
    product.kind === "wine"
      ? product.abv
        ? `${formatNumber(product.abv, locale)}°`
        : product.appellation
      : product.treasure
        ? "Italian Food Treasure"
        : product.region;
  return (
    <p className="eyebrow text-muted">
      {format} <span aria-hidden="true">/</span> {second}
    </p>
  );
}
