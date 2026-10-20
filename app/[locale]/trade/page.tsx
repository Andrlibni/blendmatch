import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { db } from "@/lib/db";
import { countryName, TRADE_RULES, type Currency } from "@/lib/config";
import { formatMoney } from "@/lib/format";
import { getTradeInfo, isAdmin } from "@/lib/shop-context";
import { ApplyForm } from "@/components/trade/ApplyForm";

export async function generateMetadata({ params }: PageProps<"/[locale]/trade">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "trade.page" });
  return { title: t("title"), description: t("lead") };
}

export default async function TradePage({ params }: PageProps<"/[locale]/trade">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, ta, trade] = await Promise.all([
    getTranslations("trade.page"),
    getTranslations("trade.band"),
    getTradeInfo(),
  ]);

  const terms = [
    { title: t("terms.prices.title"), body: t("terms.prices.body") },
    { title: t("terms.cases.title"), body: t("terms.cases.body", { size: TRADE_RULES.wineCaseSize, min: TRADE_RULES.minWineBottles }) },
    { title: t("terms.discount.title"), body: t("terms.discount.body", { from: TRADE_RULES.discountFromBottles, rate: TRADE_RULES.discountRate * 100 }) },
    { title: t("terms.vat.title"), body: t("terms.vat.body") },
    { title: t("terms.orders.title"), body: t("terms.orders.body") },
    { title: t("terms.delivery.title"), body: t("terms.delivery.body") },
  ];

  const orders = trade
    ? await db.order.findMany({ where: { accountId: trade.accountId }, orderBy: { createdAt: "desc" }, take: 10 })
    : [];
  const admin = trade ? await isAdmin() : false;

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
      <header className="border-b hairline pb-12 pt-12 text-center sm:pt-16">
        <p className="eyebrow text-muted">{t("kicker")}</p>
        <h1 className="display mt-5 text-5xl sm:text-6xl">{t("title")}</h1>
        <p className="mx-auto mt-5 max-w-2xl font-serif text-xl leading-snug sm:text-2xl">{t("lead")}</p>
      </header>

      {trade && (
        <section className="mt-12 grid gap-10 border border-ink p-6 sm:p-10 lg:grid-cols-[1fr_1.4fr]" aria-labelledby="account">
          <div>
            <p className="eyebrow text-muted">{t("account.kicker")}</p>
            <h2 id="account" className="display mt-3 text-4xl">{trade.company}</h2>
            <dl className="mt-6 space-y-2 text-sm">
              <div className="flex gap-3"><dt className="eyebrow w-24 pt-0.5 text-muted">{ta("vat")}</dt><dd>{trade.vatNumber}</dd></div>
              <div className="flex gap-3"><dt className="eyebrow w-24 pt-0.5 text-muted">{t("account.country")}</dt><dd>{countryName(trade.country)}</dd></div>
              <div className="flex gap-3"><dt className="eyebrow w-24 pt-0.5 text-muted">{t("account.regime")}</dt><dd>{ta(`regime.${trade.regime}`)}</dd></div>
            </dl>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/shop" className="eyebrow bg-ink px-5 py-3 text-ivory hover:bg-wine">{t("account.shop")}</Link>
              {admin && (
                <Link href="/admin" className="eyebrow border border-ink px-5 py-3 hover:bg-ink hover:text-ivory">{t("account.admin")}</Link>
              )}
            </div>
          </div>
          <div>
            <h3 className="eyebrow border-b hairline pb-3">{t("account.orders")}</h3>
            {orders.length === 0 ? (
              <p className="mt-4 text-sm text-muted">{t("account.noOrders")}</p>
            ) : (
              <ul>
                {orders.map((o) => (
                  <li key={o.id} className="border-b hairline">
                    <Link href={`/order/${o.id}`} className="flex flex-wrap items-baseline justify-between gap-3 py-3 text-sm hover:text-wine">
                      <span className="font-serif text-lg text-wine">{o.number}</span>
                      <span className="text-muted">{new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(o.createdAt)}</span>
                      <span className="eyebrow">{o.status}</span>
                      <span className="tabular-nums">{formatMoney(o.total, o.currency as Currency, locale, o.rate)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      <section className="mt-16" aria-labelledby="terms">
        <h2 id="terms" className="display text-4xl sm:text-5xl">{t("termsTitle")}</h2>
        <ul className="mt-10 grid gap-x-12 border-t hairline sm:grid-cols-2 lg:grid-cols-3">
          {terms.map((term, i) => (
            <li key={term.title} className="border-b hairline py-8">
              <p className="font-serif text-lg text-muted">0{i + 1}</p>
              <h3 className="eyebrow mt-2">{term.title}</h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed">{term.body}</p>
            </li>
          ))}
        </ul>
      </section>

      {!trade && (
        <section id="apply" className="mt-24 grid scroll-mt-8 gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20" aria-labelledby="apply-heading">
          <div>
            <p className="eyebrow text-muted">{t("applyKicker")}</p>
            <h2 id="apply-heading" className="display mt-4 text-4xl sm:text-5xl">{t("applyTitle")}</h2>
            <p className="mt-5 leading-relaxed">{t("applyBody")}</p>
            <ol className="mt-8 space-y-3 border-t hairline pt-6 text-sm">
              {[t("steps.one"), t("steps.two"), t("steps.three")].map((s, i) => (
                <li key={s} className="flex gap-4">
                  <span className="font-serif text-lg leading-none text-wine">{i + 1}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
            <p className="mt-8 text-sm">
              {t("already")}{" "}
              <Link href="/trade/login" className="underline underline-offset-4 hover:text-wine">{t("login")}</Link>
            </p>
          </div>
          <ApplyForm />
        </section>
      )}
    </div>
  );
}
