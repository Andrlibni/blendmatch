"use server";

import { z } from "zod";
import { getLocale } from "next-intl/server";
import { redirect as nextRedirect } from "next/navigation";
import { redirect } from "@/i18n/navigation";
import { db } from "@/lib/db";
import { computeCart, type CartSummary } from "@/lib/pricing";
import { getShopContext } from "@/lib/shop-context";
import { countries, SITE_URL } from "@/lib/config";
import { convert } from "@/lib/format";
import { getPaymentProvider } from "@/lib/payments";
import { getProducer } from "@/data/producers";

export type CheckoutState = {
  error?: string;
  fieldErrors?: Partial<Record<string, string>>;
};

const countryCodes = countries.map((c) => c.code) as [string, ...string[]];

const cartSchema = z
  .array(z.object({ slug: z.string().max(100), qty: z.number().int().positive().max(1000) }))
  .max(100);

const addressSchema = z.object({
  name: z.string().trim().min(2, "required").max(120),
  email: z.email("email").max(200),
  phone: z.string().trim().max(40).optional(),
  address: z.string().trim().min(3, "required").max(200),
  city: z.string().trim().min(2, "required").max(100),
  postcode: z.string().trim().min(2, "required").max(20),
  country: z.enum(countryCodes, "required"),
  notes: z.string().trim().max(1000).optional(),
});

function parseCart(raw: FormDataEntryValue | null) {
  try {
    return cartSchema.parse(JSON.parse(String(raw ?? "[]")));
  } catch {
    return null;
  }
}

function fieldErrors(error: z.ZodError) {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0]);
    out[key] ??= issue.message === "email" ? "email" : "required";
  }
  return out;
}

function lineSnapshot(summary: CartSummary) {
  return summary.lines.map((l) => ({
    slug: l.product.slug,
    name: l.product.name,
    producer: getProducer(l.product.producer)?.name ?? "",
    kind: l.product.kind,
    format: `${l.product.format.amount} ${l.product.format.unit}`,
    qty: l.qty,
    unitPrice: l.unitPrice,
    retailUnitPrice: l.retailUnitPrice,
    lineTotal: l.lineTotal,
  }));
}

export type OrderLineSnapshot = ReturnType<typeof lineSnapshot>[number];

async function nextOrderNumber(prefix: "LT" | "PF") {
  const year = new Date().getFullYear();
  const count = await db.order.count({ where: { number: { startsWith: `${prefix}-${year}-` } } });
  return `${prefix}-${year}-${String(count + 1).padStart(4, "0")}`;
}

/** Retail checkout. Prices are always recomputed on the server. */
export async function placeRetailOrder(
  _prev: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const shop = await getShopContext();
  if (shop.trade) return { error: "tradeSession" };

  const cart = parseCart(formData.get("cart"));
  if (!cart || cart.length === 0) return { error: "emptyCart" };

  const parsed = addressSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) };
  if (formData.get("age") !== "on") return { fieldErrors: { age: "required" } };

  const summary = computeCart(cart, { kind: "retail" });
  if (summary.lines.length === 0) return { error: "emptyCart" };

  const data = parsed.data;
  const number = await nextOrderNumber("LT");
  const order = await db.order.create({
    data: {
      number,
      kind: "retail",
      status: "pending_payment",
      email: data.email,
      name: data.name,
      phone: data.phone || null,
      address: data.address,
      city: data.city,
      postcode: data.postcode,
      country: data.country,
      notes: data.notes || null,
      currency: shop.currency,
      rate: shop.rate,
      subtotal: summary.subtotal,
      discount: 0,
      shipping: summary.shipping,
      vatTotal: 0,
      total: summary.total,
      lines: JSON.stringify(lineSnapshot(summary)),
    },
  });

  const locale = await getLocale();
  const provider = getPaymentProvider();
  const toCurrency = (eur: number) => Math.round(convert(eur, shop.currency, shop.rate) * 100) / 100;
  const result = await provider.createCheckout(
    {
      id: order.id,
      number,
      email: data.email,
      currency: shop.currency,
      amount: toCurrency(summary.total),
      lines: [
        ...summary.lines.map((l) => ({
          name: l.product.name,
          qty: l.qty,
          unitAmount: toCurrency(l.unitPrice),
        })),
        ...(summary.shipping ? [{ name: "Shipping", qty: 1, unitAmount: toCurrency(summary.shipping) }] : []),
      ],
    },
    {
      success: `${SITE_URL}/${locale}/order/${order.id}?placed=1`,
      cancel: `${SITE_URL}/${locale}/checkout`,
    },
  );

  if (result.paid) {
    await db.order.update({ where: { id: order.id }, data: { status: "paid_simulated" } });
    redirect({ href: `/order/${order.id}?placed=1`, locale });
  }
  // External provider (Stripe): leave the site for the hosted checkout page.
  nextRedirect(result.redirectUrl);
}

const tradeSchema = addressSchema.omit({ email: true, country: true }).extend({
  email: z.email("email").max(200),
});

/** Trade checkout: no payment, creates a draft order and its pro-forma. */
export async function placeTradeOrder(
  _prev: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const shop = await getShopContext();
  const trade = shop.trade;
  if (!trade) return { error: "notTrade" };

  const cart = parseCart(formData.get("cart"));
  if (!cart || cart.length === 0) return { error: "emptyCart" };

  const parsed = tradeSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) };

  // The delivery country is always the one the VAT number belongs to.
  const summary = computeCart(cart, { kind: "trade", country: trade.country });
  if (summary.lines.length === 0) return { error: "emptyCart" };
  if (summary.issues.length > 0) return { error: "rules" };

  const data = parsed.data;
  const order = await db.order.create({
    data: {
      number: await nextOrderNumber("PF"),
      kind: "trade",
      status: "draft",
      accountId: trade.accountId,
      email: data.email,
      name: data.name,
      company: trade.company,
      vatNumber: trade.vatNumber,
      phone: data.phone || null,
      address: data.address,
      city: data.city,
      postcode: data.postcode,
      country: trade.country,
      notes: data.notes || null,
      currency: shop.currency,
      rate: shop.rate,
      vatRegime: summary.regime,
      subtotal: summary.subtotal,
      discount: summary.discount,
      shipping: null,
      vatTotal: summary.vatTotal,
      vatBreakdown: JSON.stringify(summary.vat),
      total: summary.total,
      lines: JSON.stringify(lineSnapshot(summary)),
    },
  });

  const locale = await getLocale();
  redirect({ href: `/order/${order.id}?placed=1`, locale });
  return {};
}
