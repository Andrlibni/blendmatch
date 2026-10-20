import { getProduct } from "@/data/products";
import type { Product } from "@/data/types";
import { RETAIL_RULES, TRADE_RULES, type CountryCode } from "./config";
import { vatRegimeFor, type VatRegime } from "./vat-regime";

export type PricingMode = { kind: "retail" } | { kind: "trade"; country: CountryCode };

export type CartInput = { slug: string; qty: number }[];

export type CartIssue =
  | { code: "minWine"; min: number; current: number }
  | { code: "wineCase"; caseSize: number; missing: number }
  | { code: "pantryCase"; slug: string; name: string; caseSize: number };

export type PricedLine = {
  product: Product;
  qty: number;
  unitPrice: number;
  /** Retail unit price, shown struck through in trade mode. */
  retailUnitPrice: number;
  lineTotal: number;
};

export type CartSummary = {
  mode: PricingMode["kind"];
  lines: PricedLine[];
  wineBottles: number;
  subtotal: number;
  discount: number;
  discountRate: number;
  /** null = quoted later (trade orders). */
  shipping: number | null;
  /** Retail: EUR still needed for free shipping. */
  freeShippingRemaining: number;
  regime: VatRegime | null;
  /** VAT added on top (trade only; retail prices already include it). */
  vat: { rate: number; base: number; amount: number }[];
  vatTotal: number;
  total: number;
  issues: CartIssue[];
};

const round = (n: number) => Math.round(n * 100) / 100;

export function unitPrice(product: Product, mode: PricingMode) {
  return mode.kind === "trade" ? product.tradePrice : product.retailPrice;
}

/** Quantity step used by the quantity selector. */
export function quantityStep(product: Product, mode: PricingMode) {
  if (mode.kind === "retail") return 1;
  // Wine cases are mixable, so single bottles are allowed as long as the
  // order adds up to full cases; pantry items go by their own case size.
  return product.kind === "wine" ? 1 : product.caseSize;
}

/** Default quantity added by the "Add to cart" button. */
export function defaultAddQuantity(product: Product, mode: PricingMode) {
  if (mode.kind === "retail") return 1;
  return product.kind === "wine" ? TRADE_RULES.wineCaseSize : product.caseSize;
}

export function computeCart(input: CartInput, mode: PricingMode): CartSummary {
  const lines: PricedLine[] = input.flatMap(({ slug, qty }) => {
    const product = getProduct(slug);
    if (!product || qty <= 0) return [];
    const price = unitPrice(product, mode);
    return [
      {
        product,
        qty,
        unitPrice: price,
        retailUnitPrice: product.retailPrice,
        lineTotal: round(price * qty),
      },
    ];
  });

  const wineBottles = lines
    .filter((l) => l.product.kind === "wine")
    .reduce((sum, l) => sum + l.qty, 0);
  const subtotal = round(lines.reduce((sum, l) => sum + l.lineTotal, 0));

  if (mode.kind === "retail") {
    const free = subtotal >= RETAIL_RULES.freeShippingFrom || subtotal === 0;
    const shipping = free ? 0 : RETAIL_RULES.shippingFlat;
    return {
      mode: "retail",
      lines,
      wineBottles,
      subtotal,
      discount: 0,
      discountRate: 0,
      shipping,
      freeShippingRemaining: free ? 0 : round(RETAIL_RULES.freeShippingFrom - subtotal),
      regime: null,
      vat: [],
      vatTotal: 0,
      total: round(subtotal + shipping),
      issues: [],
    };
  }

  // ——— Trade ———
  const issues: CartIssue[] = [];
  if (wineBottles < TRADE_RULES.minWineBottles) {
    issues.push({ code: "minWine", min: TRADE_RULES.minWineBottles, current: wineBottles });
  }
  const remainder = wineBottles % TRADE_RULES.wineCaseSize;
  if (remainder !== 0) {
    issues.push({
      code: "wineCase",
      caseSize: TRADE_RULES.wineCaseSize,
      missing: TRADE_RULES.wineCaseSize - remainder,
    });
  }
  for (const l of lines) {
    if (l.product.kind === "pantry" && l.qty % l.product.caseSize !== 0) {
      issues.push({
        code: "pantryCase",
        slug: l.product.slug,
        name: l.product.name,
        caseSize: l.product.caseSize,
      });
    }
  }

  const discountRate =
    wineBottles >= TRADE_RULES.discountFromBottles ? TRADE_RULES.discountRate : 0;

  // The volume discount applies to wine only; VAT is computed per rate on
  // the discounted amounts.
  const byRate = new Map<number, number>();
  let discount = 0;
  const { regime, rate: regimeRate } = vatRegimeFor(mode.country);
  for (const l of lines) {
    const lineDiscount = l.product.kind === "wine" ? l.lineTotal * discountRate : 0;
    discount += lineDiscount;
    const rate = regime === "domestic" ? l.product.vatRateIT : regimeRate;
    byRate.set(rate, (byRate.get(rate) ?? 0) + l.lineTotal - lineDiscount);
  }
  discount = round(discount);

  const vat = [...byRate.entries()]
    .sort(([a], [b]) => b - a)
    .map(([rate, base]) => ({ rate, base: round(base), amount: round(base * rate) }));
  const vatTotal = round(vat.reduce((sum, v) => sum + v.amount, 0));
  const net = round(subtotal - discount);

  return {
    mode: "trade",
    lines,
    wineBottles,
    subtotal,
    discount,
    discountRate,
    shipping: null,
    freeShippingRemaining: 0,
    regime,
    vat,
    vatTotal,
    total: round(net + vatTotal),
    issues,
  };
}
