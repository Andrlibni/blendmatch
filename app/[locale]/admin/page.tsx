import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link, redirect } from "@/i18n/navigation";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/shop-context";
import { countryName, type Currency } from "@/lib/config";
import { formatMoney } from "@/lib/format";
import { setApproval, setOrderStatus } from "@/app/actions/admin";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };

export default async function AdminPage({ params }: PageProps<"/[locale]/admin">) {
  const { locale } = await params;
  setRequestLocale(locale);
  if (!(await isAdmin())) {
    redirect({ href: `/trade/login?callbackUrl=/${locale}/admin`, locale });
  }
  const [t, tt] = await Promise.all([getTranslations("admin"), getTranslations("trade.apply.types")]);
  const [accounts, orders] = await Promise.all([
    db.tradeAccount.findMany({ where: { role: "trade" }, orderBy: [{ approved: "asc" }, { createdAt: "desc" }] }),
    db.order.findMany({ where: { kind: "trade" }, orderBy: { createdAt: "desc" }, take: 30 }),
  ]);
  const date = (d: Date) => new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(d);
  const pending = accounts.filter((a) => !a.approved).length;

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
      <header className="pb-10 pt-12 sm:pt-16">
        <p className="eyebrow text-muted">Admin</p>
        <h1 className="display mt-4 text-5xl">{t("title")}</h1>
        <p className="mt-3 text-muted">{t("pending", { count: pending })}</p>
      </header>

      <section aria-labelledby="accounts">
        <h2 id="accounts" className="eyebrow border-b border-ink pb-3">{t("accounts")}</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="eyebrow border-b hairline text-left text-muted">
                <th scope="col" className="py-3 pr-4 font-medium">{t("company")}</th>
                <th scope="col" className="py-3 pr-4 font-medium">{t("vat")}</th>
                <th scope="col" className="py-3 pr-4 font-medium">{t("check")}</th>
                <th scope="col" className="py-3 pr-4 font-medium">{t("created")}</th>
                <th scope="col" className="py-3 pr-4 font-medium">{t("status")}</th>
                <th scope="col" className="py-3 font-medium"><span className="sr-only">{t("actions")}</span></th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((a) => (
                <tr key={a.id} className="border-b hairline align-top">
                  <td className="py-4 pr-4">
                    <p className="font-serif text-lg text-wine">{a.company}</p>
                    <p className="text-muted">{a.contactName} · {a.email}</p>
                    <p className="eyebrow mt-1 text-muted">{a.businessType && tt.has(a.businessType) ? tt(a.businessType) : a.businessType} · {countryName(a.country)}</p>
                  </td>
                  <td className="py-4 pr-4 font-mono text-[0.8rem]">{a.vatNumber}</td>
                  <td className="py-4 pr-4">
                    <span className={`eyebrow ${a.vatCheck === "vies" || a.vatCheck === "hmrc" ? "text-ok" : a.vatCheck === "unverified" ? "text-alert" : ""}`}>
                      {t(`method.${a.vatCheck}`)}
                    </span>
                    {a.vatCheckName && <p className="mt-1 text-xs">{a.vatCheckName}</p>}
                    {a.vatCheckNote && <p className="mt-1 text-xs text-muted">{a.vatCheckNote}</p>}
                  </td>
                  <td className="py-4 pr-4 text-muted">{date(a.createdAt)}</td>
                  <td className="py-4 pr-4">
                    <span className={`eyebrow ${a.approved ? "text-ok" : "text-alert"}`}>
                      {a.approved ? t("approved") : t("waiting")}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <form action={setApproval}>
                      <input type="hidden" name="id" value={a.id} />
                      <input type="hidden" name="approved" value={String(!a.approved)} />
                      <button
                        type="submit"
                        className={`eyebrow px-4 py-2 transition-colors ${a.approved ? "border border-ink hover:bg-ivory-deep" : "bg-ink text-ivory hover:bg-wine"}`}
                      >
                        {a.approved ? t("revoke") : t("approve")}
                        <span className="sr-only"> {a.company}</span>
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-20" aria-labelledby="orders">
        <h2 id="orders" className="eyebrow border-b border-ink pb-3">{t("orders")}</h2>
        {orders.length === 0 ? (
          <p className="py-6 text-sm text-muted">{t("noOrders")}</p>
        ) : (
          <ul>
            {orders.map((o) => (
              <li key={o.id} className="flex flex-wrap items-center justify-between gap-4 border-b hairline py-4 text-sm">
                <Link href={`/order/${o.id}`} className="font-serif text-lg text-wine hover:underline underline-offset-4">{o.number}</Link>
                <span>{o.company}</span>
                <span className="text-muted">{date(o.createdAt)}</span>
                <span className="tabular-nums">{formatMoney(o.total, o.currency as Currency, locale, o.rate)}</span>
                <form action={setOrderStatus} className="flex items-center gap-2">
                  <input type="hidden" name="id" value={o.id} />
                  <label className="sr-only" htmlFor={`status-${o.id}`}>{t("status")}</label>
                  <select id={`status-${o.id}`} name="status" defaultValue={o.status} className="eyebrow border-b border-ink bg-transparent py-1">
                    {["draft", "confirmed", "cancelled"].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <button type="submit" className="eyebrow underline underline-offset-4 hover:text-wine">{t("save")}</button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
