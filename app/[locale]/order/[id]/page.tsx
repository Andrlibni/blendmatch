import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getVisibleOrder } from "@/lib/orders";
import { formatMoney, formatNumber } from "@/lib/format";
import { countryName, type Currency } from "@/lib/config";
import { ClearCart } from "@/components/cart/ClearCart";
import { PrintButton } from "@/components/ui/PrintButton";

export const metadata: Metadata = { robots: { index: false } };

export default async function OrderPage({ params, searchParams }: PageProps<"/[locale]/order/[id]">) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const placed = (await searchParams).placed === "1";
  const order = await getVisibleOrder(id);
  if (!order) notFound();

  const t = await getTranslations("order");
  const money = (eur: number) => formatMoney(eur, order.currency as Currency, locale, order.rate);
  const trade = order.kind === "trade";
  const date = new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(order.createdAt);
  const vatLines: { rate: number; amount: number }[] = order.vatBreakdown
    ? JSON.parse(order.vatBreakdown)
    : [];

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6">
      {placed && <ClearCart />}
      <header className="no-print pb-10 pt-12 text-center sm:pt-16">
        <p className="eyebrow text-muted">{trade ? t("tradeKicker") : t("kicker")}</p>
        <h1 className="display mt-4 text-5xl">{trade ? t("tradeTitle") : t("title")}</h1>
        <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted">
          {trade ? t("tradeBody", { email: order.email }) : t("body", { email: order.email })}
        </p>
      </header>

      {/* Order / pro-forma document */}
      <article className="border border-ink bg-ivory p-6 sm:p-10" aria-labelledby="doc-title">
        <div className="flex flex-col justify-between gap-6 border-b hairline pb-6 sm:flex-row">
          <div>
            <p className="font-serif text-3xl tracking-[0.32em] text-wine">LENTO</p>
            <p className="mt-2 text-xs leading-relaxed text-muted">
              Lento S.r.l. · Via dell&apos;Esempio 1, 20100 Milano, Italia
              <br />
              P.IVA IT00000000000 · Excise warehouse ref. IT00XXX000000X
            </p>
          </div>
          <div className="sm:text-right">
            <h2 id="doc-title" className="eyebrow">
              {trade ? t("proforma") : t("confirmation")}
            </h2>
            <p className="mt-2 font-serif text-2xl text-wine">{order.number}</p>
            <p className="eyebrow mt-1 text-muted">{date}</p>
            <p className="eyebrow mt-1 text-muted">{t(`status.${order.status}`)}</p>
          </div>
        </div>

        <div className="grid gap-6 border-b hairline py-6 text-sm sm:grid-cols-2">
          <div>
            <p className="eyebrow text-muted">{t("billTo")}</p>
            <p className="mt-2 leading-relaxed">
              {order.company && (
                <>
                  <strong className="font-medium">{order.company}</strong>
                  <br />
                </>
              )}
              {order.name}
              <br />
              {order.email}
              {order.vatNumber && (
                <>
                  <br />
                  {t("vatNumber")}: {order.vatNumber}
                </>
              )}
            </p>
          </div>
          <div>
            <p className="eyebrow text-muted">{t("shipTo")}</p>
            <p className="mt-2 leading-relaxed">
              {order.address}
              <br />
              {order.postcode} {order.city}
              <br />
              {countryName(order.country)}
            </p>
          </div>
        </div>

        <table className="w-full text-sm">
          <caption className="sr-only">{t("lines")}</caption>
          <thead>
            <tr className="eyebrow border-b hairline text-left text-muted">
              <th scope="col" className="py-3 font-medium">{t("product")}</th>
              <th scope="col" className="py-3 text-right font-medium">{t("qty")}</th>
              <th scope="col" className="hidden py-3 text-right font-medium sm:table-cell">{t("unit")}</th>
              <th scope="col" className="py-3 text-right font-medium">{t("amount")}</th>
            </tr>
          </thead>
          <tbody>
            {order.lines.map((l) => (
              <tr key={l.slug} className="border-b hairline align-top">
                <td className="py-3 pr-4">
                  <span className="eyebrow block text-muted">{l.producer}</span>
                  {l.name} · {l.format}
                </td>
                <td className="py-3 text-right tabular-nums">{l.qty}</td>
                <td className="hidden py-3 text-right tabular-nums sm:table-cell">{money(l.unitPrice)}</td>
                <td className="py-3 text-right tabular-nums">{money(l.lineTotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <dl className="ml-auto mt-4 max-w-xs space-y-1.5 text-sm">
          <div className="flex justify-between gap-4">
            <dt>{trade ? t("subtotalEx") : t("subtotal")}</dt>
            <dd className="tabular-nums">{money(order.subtotal)}</dd>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between gap-4">
              <dt>{t("discount")}</dt>
              <dd className="tabular-nums">− {money(order.discount)}</dd>
            </div>
          )}
          <div className="flex justify-between gap-4">
            <dt>{t("shipping")}</dt>
            <dd className="tabular-nums">
              {order.shipping === null ? t("shippingQuoted") : order.shipping === 0 ? t("free") : money(order.shipping)}
            </dd>
          </div>
          {vatLines.map((v) => (
            <div key={v.rate} className="flex justify-between gap-4">
              <dt>{t("vat", { rate: formatNumber(v.rate * 100, locale, 0) })}</dt>
              <dd className="tabular-nums">{money(v.amount)}</dd>
            </div>
          ))}
          <div className="flex justify-between gap-4 border-t border-ink pt-2 text-base font-medium">
            <dt>{t("total")}</dt>
            <dd className="tabular-nums">{money(order.total)}</dd>
          </div>
        </dl>

        <p className="mt-8 border-t hairline pt-4 text-xs leading-relaxed text-muted">
          {trade && order.vatRegime ? t(`regime.${order.vatRegime}`) : t("inclVat")}
          {order.currency === "GBP" && ` ${t("fx", { rate: formatNumber(order.rate, locale, 4) })}`}
        </p>
      </article>

      <div className="no-print mt-8 flex flex-wrap items-center justify-between gap-4">
        <Link href="/shop" className="eyebrow hover:text-wine">
          ← {t("continue")}
        </Link>
        <PrintButton label={trade ? t("printProforma") : t("print")} />
      </div>
    </div>
  );
}
