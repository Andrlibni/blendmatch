"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useShop } from "@/components/providers/ShopProvider";

export function CartLink() {
  const t = useTranslations("nav");
  const { cartCount, cartReady } = useShop();
  const count = cartReady ? cartCount : 0;
  return (
    <Link href="/cart" className="eyebrow inline-flex items-center gap-1.5 hover:text-wine">
      {t("cart")}
      <span aria-hidden="true">({count})</span>
      <span className="sr-only">{t("cartCount", { count })}</span>
    </Link>
  );
}
