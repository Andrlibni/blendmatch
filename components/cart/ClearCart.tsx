"use client";

import { useEffect } from "react";
import { useShop } from "@/components/providers/ShopProvider";

/** Empties the cart once the order has been placed. */
export function ClearCart() {
  const { clearCart, cartReady } = useShop();
  useEffect(() => {
    if (cartReady) clearCart();
  }, [cartReady, clearCart]);
  return null;
}
