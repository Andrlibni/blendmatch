"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { usePricingMode, useShop } from "@/components/providers/ShopProvider";
import { getProducer } from "@/data/producers";
import { computeCart, quantityStep } from "@/lib/pricing";
import { RETAIL_RULES } from "@/lib/config";
import { ProductImage } from "@/components/product/ProductImage";
import { QuantityInput } from "./QuantityInput";
import { OrderSummary } from "./OrderSummary";
import { CartIssues } from "./CartIssues";

export function CartView() {
  const t = useTranslations("cart");
  const { cart, cartReady, setQty, removeFromCart, money, trade } = useShop();
  const mode = usePricingMode();
  const summary = computeCart(cart, mode);

  if (!cartReady) {
    return <p className="py-24 text-center text-sm text-muted">{t("loading")}</p>;
  }

  if (summary.lines.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="font-serif text-3xl text-wine">{t("empty")}</p>
        <Link href="/shop" className="eyebrow mt-8 inline-block bg-ink px-6 py-4 text-ivory hover:bg-wine">
          {t("continue")}
        </Link>
      </div>
    );
  }

  const blocked = summary.issues.length > 0;

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-16">
      <section aria-labelledby="cart-lines">
        <h2 id="cart-lines" className="sr-only">
          {t("items")}
        </h2>
        <ul className="border-t hairline">
          {summary.lines.map((l) => {
            const step = quantityStep(l.product, mode);
            return (
              <li key={l.product.slug} className="grid grid-cols-[88px_1fr] gap-5 border-b hairline py-6 sm:grid-cols-[110px_1fr]">
                <Link href={`/shop/${l.product.slug}`} tabIndex={-1} aria-hidden="true" className="group">
                  <ProductImage product={l.product} sizes="110px" compact />
                </Link>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="eyebrow text-muted">{getProducer(l.product.producer)?.name}</p>
                    <h3 className="mt-1 font-serif text-xl leading-tight text-wine">
                      <Link href={`/shop/${l.product.slug}`}>{l.product.name}</Link>
                    </h3>
                    <p className="eyebrow mt-1.5 text-muted">
                      {l.product.format.amount} {l.product.format.unit} · {money(l.unitPrice)}
                      {trade && (
                        <>
                          {" "}
                          <s className="opacity-70">{money(l.retailUnitPrice)}</s>
                        </>
                      )}
                    </p>
                    {trade && l.product.kind === "pantry" && (
                      <p className="eyebrow mt-1 text-muted">{t("caseOf", { size: l.product.caseSize })}</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-6 sm:flex-col sm:items-end">
                    <QuantityInput
                      compact
                      value={l.qty}
                      step={step}
                      min={step}
                      label={t("quantityFor", { name: l.product.name })}
                      onChange={(q) => setQty(l.product.slug, q)}
                    />
                    <div className="text-right">
                      <p className="tabular-nums">{money(l.lineTotal)}</p>
                      <button
                        type="button"
                        onClick={() => removeFromCart(l.product.slug)}
                        className="eyebrow mt-1 text-muted underline-offset-4 hover:text-wine hover:underline"
                      >
                        {t("remove")}
                        <span className="sr-only"> {l.product.name}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        <Link href="/shop" className="eyebrow mt-6 inline-block hover:text-wine">
          ← {t("continue")}
        </Link>
      </section>

      <aside aria-labelledby="summary-heading" className="lg:sticky lg:top-6 lg:self-start">
        <div className="border border-ink p-6">
          <h2 id="summary-heading" className="eyebrow border-b hairline pb-4">
            {trade ? t("tradeSummary") : t("summaryTitle")}
          </h2>
          {trade && (
            <p className="eyebrow pt-4 text-muted">
              {t("bottles", { count: summary.wineBottles })}
            </p>
          )}
          <div className="pt-2">
            <OrderSummary summary={summary} />
          </div>
          {!trade && summary.freeShippingRemaining > 0 && (
            <p className="mt-4 text-sm">
              {t("freeShippingLeft", {
                amount: money(summary.freeShippingRemaining),
                threshold: money(RETAIL_RULES.freeShippingFrom),
              })}
            </p>
          )}
          <CartIssues issues={summary.issues} />
          {blocked ? (
            <button type="button" disabled className="eyebrow mt-6 w-full bg-ink/30 py-4 text-ivory">
              {trade ? t("requestOrder") : t("checkout")}
            </button>
          ) : (
            <Link
              href="/checkout"
              className="eyebrow mt-6 block w-full bg-ink py-4 text-center text-ivory transition-colors duration-300 hover:bg-wine"
            >
              {trade ? t("requestOrder") : t("checkout")}
            </Link>
          )}
        </div>
      </aside>
    </div>
  );
}
