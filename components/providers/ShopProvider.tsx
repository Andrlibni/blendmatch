"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useLocale } from "next-intl";
import type { ShopContext } from "@/lib/shop-context";
import { formatMoney } from "@/lib/format";
import type { PricingMode } from "@/lib/pricing";

export type CartLine = { slug: string; qty: number };

type ShopValue = ShopContext & {
  locale: string;
  money: (amountEur: number) => string;
  cart: CartLine[];
  cartReady: boolean;
  cartCount: number;
  addToCart: (slug: string, qty: number) => void;
  setQty: (slug: string, qty: number) => void;
  removeFromCart: (slug: string) => void;
  clearCart: () => void;
};

const Ctx = createContext<ShopValue | null>(null);
const STORAGE_KEY = "lento_cart_v1";

function readCart(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as CartLine[]) : [];
    return Array.isArray(parsed)
      ? parsed.filter((l) => typeof l.slug === "string" && l.qty > 0)
      : [];
  } catch {
    return [];
  }
}

export function ShopProvider({
  value,
  children,
}: {
  value: ShopContext;
  children: ReactNode;
}) {
  const locale = useLocale();
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartReady, setCartReady] = useState(false);

  useEffect(() => {
    // Hydrate from localStorage once on the client.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCart(readCart());
    setCartReady(true);
  }, []);

  useEffect(() => {
    if (!cartReady) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      /* storage unavailable: cart lives for this tab only */
    }
  }, [cart, cartReady]);

  const addToCart = useCallback((slug: string, qty: number) => {
    setCart((prev) => {
      const existing = prev.find((l) => l.slug === slug);
      if (existing) {
        return prev.map((l) => (l.slug === slug ? { ...l, qty: l.qty + qty } : l));
      }
      return [...prev, { slug, qty }];
    });
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    setCart((prev) =>
      qty <= 0
        ? prev.filter((l) => l.slug !== slug)
        : prev.map((l) => (l.slug === slug ? { ...l, qty } : l)),
    );
  }, []);

  const removeFromCart = useCallback((slug: string) => {
    setCart((prev) => prev.filter((l) => l.slug !== slug));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const shop = useMemo<ShopValue>(
    () => ({
      ...value,
      locale,
      money: (amount: number) => formatMoney(amount, value.currency, locale, value.rate),
      cart,
      cartReady,
      cartCount: cart.reduce((sum, l) => sum + l.qty, 0),
      addToCart,
      setQty,
      removeFromCart,
      clearCart,
    }),
    [value, locale, cart, cartReady, addToCart, setQty, removeFromCart, clearCart],
  );

  return <Ctx.Provider value={shop}>{children}</Ctx.Provider>;
}

export function useShop() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useShop must be used inside <ShopProvider>");
  return ctx;
}

export function usePricingMode(): PricingMode {
  const { trade } = useShop();
  return useMemo(
    () => (trade ? { kind: "trade", country: trade.country } : { kind: "retail" }),
    [trade],
  );
}
