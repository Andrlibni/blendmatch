import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter_Tight } from "next/font/google";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { SITE_NAME, SITE_URL } from "@/lib/config";
import { SITE_INDEXABLE } from "@/lib/indexing";
import { AGE_COOKIE, getShopContext } from "@/lib/shop-context";
import { ShopProvider } from "@/components/providers/ShopProvider";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AgeGate } from "@/components/layout/AgeGate";
import { TradeBand } from "@/components/layout/TradeBand";
import "../globals.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const sans = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#fbf8f2",
};

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: `${SITE_NAME} — ${t("title")}`, template: `%s — ${SITE_NAME}` },
    description: t("description"),
    openGraph: {
      siteName: SITE_NAME,
      type: "website",
      locale,
      title: `${SITE_NAME} — ${t("title")}`,
      description: t("description"),
    },
    alternates: {
      languages: Object.fromEntries(routing.locales.map((l) => [l, `/${l}`])),
    },
    robots: SITE_INDEXABLE ? undefined : { index: false, follow: false },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const [shop, store, t] = await Promise.all([
    getShopContext(),
    cookies(),
    getTranslations("common"),
  ]);
  const ageConfirmed = store.get(AGE_COOKIE)?.value === "1";

  return (
    <html lang={locale} className={`${serif.variable} ${sans.variable}`}>
      <body className="min-h-dvh">
        <NextIntlClientProvider>
          <ShopProvider value={shop}>
            <div id="site" className="flex min-h-dvh flex-col">
              <a
                href="#main"
                className="eyebrow sr-only z-50 bg-ink px-4 py-3 text-ivory focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
              >
                {t("skip")}
              </a>
              {shop.trade && <TradeBand trade={shop.trade} />}
              <TopBar trade={shop.trade} />
              <Header />
              <main id="main" className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
            {!ageConfirmed && <AgeGate />}
          </ShopProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
