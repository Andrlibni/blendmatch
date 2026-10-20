import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getTradeInfo } from "@/lib/shop-context";
import { placeRetailOrder, placeTradeOrder } from "@/app/actions/orders";
import { CheckoutForm } from "@/components/cart/CheckoutForm";

export async function generateMetadata({ params }: PageProps<"/[locale]/checkout">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "checkout" });
  return { title: t("title"), robots: { index: false } };
}

export default async function CheckoutPage({ params }: PageProps<"/[locale]/checkout">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, trade] = await Promise.all([getTranslations("checkout"), getTradeInfo()]);
  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
      <h1 className="display pb-10 pt-12 text-5xl sm:pt-16">{trade ? t("titleTrade") : t("title")}</h1>
      <CheckoutForm action={trade ? placeTradeOrder : placeRetailOrder} defaults={trade ? { email: trade.email, company: trade.company, country: trade.country } : {}} />
    </div>
  );
}
