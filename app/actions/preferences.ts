"use server";

import { cookies } from "next/headers";
import { CURRENCY_COOKIE } from "@/lib/shop-context";

export async function setCurrency(currency: string) {
  const store = await cookies();
  store.set(CURRENCY_COOKIE, currency === "GBP" ? "GBP" : "EUR", {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}
