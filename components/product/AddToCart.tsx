"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { usePricingMode, useShop } from "@/components/providers/ShopProvider";
import { getProduct } from "@/data/products";
import { defaultAddQuantity, quantityStep } from "@/lib/pricing";
import { QuantityInput } from "@/components/cart/QuantityInput";

export function AddToCart({ slug }: { slug: string }) {
  const t = useTranslations("product");
  const { addToCart, money } = useShop();
  const mode = usePricingMode();
  const product = getProduct(slug)!;
  const step = quantityStep(product, mode);
  const [qty, setQty] = useState(() => defaultAddQuantity(product, mode));
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const id = setTimeout(() => setAdded(false), 4000);
    return () => clearTimeout(id);
  }, [added]);

  const price = mode.kind === "trade" ? product.tradePrice : product.retailPrice;

  return (
    <div>
      <div className="flex items-stretch gap-3">
        <QuantityInput
          value={qty}
          step={step}
          min={step}
          onChange={setQty}
          label={t("quantity")}
        />
        <button
          type="button"
          onClick={() => {
            addToCart(product.slug, qty);
            setAdded(true);
          }}
          className="eyebrow flex-1 bg-ink px-6 py-4 text-ivory transition-colors duration-300 hover:bg-wine"
        >
          {t("add")} · {money(price * qty)}
        </button>
      </div>
      <p aria-live="polite" className="mt-3 min-h-5 text-sm">
        {added && (
          <>
            {t("added", { qty })}{" "}
            <Link href="/cart" className="underline underline-offset-4 hover:text-wine">
              {t("viewCart")}
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
