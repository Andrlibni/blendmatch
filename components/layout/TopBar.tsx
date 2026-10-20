import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { CurrencySwitcher } from "./CurrencySwitcher";
import type { TradeInfo } from "@/lib/shop-context";

export async function TopBar({ trade }: { trade: TradeInfo | null }) {
  const t = await getTranslations("topbar");
  return (
    <div className="no-print bg-ink text-ivory">
      <div className="mx-auto flex h-9 max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-4 sm:gap-6">
          <LocaleSwitcher />
          <CurrencySwitcher />
        </div>
        <p className="eyebrow hidden opacity-80 md:block">{t("shippingNote")}</p>
        {trade ? (
          <Link href="/trade" className="eyebrow hover:underline underline-offset-4">
            {t("tradeArea")}
          </Link>
        ) : (
          <Link href="/trade/login" className="eyebrow hover:underline underline-offset-4">
            {t("tradeLogin")}
          </Link>
        )}
      </div>
    </div>
  );
}
