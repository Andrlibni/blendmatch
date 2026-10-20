import { getTranslations } from "next-intl/server";
import { signOutAction } from "@/app/actions/auth";
import type { TradeInfo } from "@/lib/shop-context";

export async function TradeBand({ trade }: { trade: TradeInfo }) {
  const t = await getTranslations("trade.band");
  return (
    <div className="no-print border-b border-wine/20 bg-ivory-dark text-ink">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-x-6 gap-y-1 px-4 py-2 sm:px-6">
        <p className="eyebrow flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="text-wine">{t("label")}</span>
          <span aria-hidden="true" className="text-line">|</span>
          <span>{trade.company}</span>
          <span aria-hidden="true" className="text-line">|</span>
          <span>{t("vat")} {trade.vatNumber}</span>
          <span aria-hidden="true" className="text-line">|</span>
          <span>{t(`regime.${trade.regime}`)}</span>
        </p>
        <form action={signOutAction}>
          <button type="submit" className="eyebrow underline underline-offset-4 hover:text-wine">
            {t("logout")}
          </button>
        </form>
      </div>
    </div>
  );
}
