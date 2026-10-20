import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link, redirect } from "@/i18n/navigation";
import { getTradeInfo } from "@/lib/shop-context";
import { LoginForm } from "@/components/trade/LoginForm";

export async function generateMetadata({ params }: PageProps<"/[locale]/trade/login">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "trade.login" });
  return { title: t("title"), robots: { index: false } };
}

const isDev = process.env.NODE_ENV !== "production";

export default async function TradeLoginPage({ params, searchParams }: PageProps<"/[locale]/trade/login">) {
  const { locale } = await params;
  setRequestLocale(locale);
  if (await getTradeInfo()) redirect({ href: "/trade", locale });
  const sp = await searchParams;
  const callbackUrl = typeof sp.callbackUrl === "string" ? sp.callbackUrl : undefined;
  const t = await getTranslations("trade.login");

  return (
    <div className="mx-auto grid max-w-[1100px] gap-16 px-4 pb-8 pt-12 sm:px-6 sm:pt-16 md:grid-cols-2">
      <div>
        <p className="eyebrow text-muted">{t("kicker")}</p>
        <h1 className="display mt-4 text-5xl">{t("title")}</h1>
        <p className="mt-5 leading-relaxed text-muted">{t("body")}</p>
        <div className="mt-10">
          <LoginForm callbackUrl={callbackUrl} demo={isDev} />
        </div>
      </div>
      <aside className="space-y-10 md:border-l md:hairline md:pl-16">
        <div>
          <h2 className="font-serif text-3xl text-wine">{t("noAccount")}</h2>
          <p className="mt-3 text-sm leading-relaxed">{t("noAccountBody")}</p>
          <Link href="/trade#apply" className="eyebrow mt-6 inline-block border-b border-ink pb-1 hover:text-wine">
            {t("apply")} →
          </Link>
        </div>
        {isDev && (
          <div className="border border-dashed border-line p-5 text-sm">
            <p className="eyebrow text-muted">{t("demoTitle")}</p>
            <ul className="mt-3 space-y-2 font-mono text-[0.8rem] leading-relaxed">
              <li>trade@demo.lento · demo-trade <span className="text-muted">(DE · reverse charge)</span></li>
              <li>enoteca@demo.lento · demo-trade <span className="text-muted">(IT · IVA 22%)</span></li>
              <li>london@demo.lento · demo-trade <span className="text-muted">(GB · export)</span></li>
              <li>pending@demo.lento · demo-trade <span className="text-muted">(pending)</span></li>
              <li>admin@lento.local · demo-admin <span className="text-muted">(admin)</span></li>
            </ul>
          </div>
        )}
      </aside>
    </div>
  );
}
