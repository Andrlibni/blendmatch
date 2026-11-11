"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { useShop } from "@/components/providers/ShopProvider";

export function CartLink() {
  const t = useTranslations("nav");
  const { cartCount, cartReady } = useShop();
  const count = cartReady ? cartCount : 0;
  const previous = useRef(count);
  const [bump, setBump] = useState(0);

  useEffect(() => {
    // Little bounce when something is added.
    if (cartReady && count > previous.current) setBump((b) => b + 1);
    previous.current = count;
  }, [count, cartReady]);

  return (
    <Link href="/cart" className="eyebrow inline-flex items-center gap-1.5 hover:text-wine">
      {t("cart")}
      <span key={bump} aria-hidden="true" className={`inline-block tabular-nums ${bump ? "bump" : ""}`}>
        ({count})
      </span>
      <span className="sr-only">{t("cartCount", { count })}</span>
    </Link>
  );
}
