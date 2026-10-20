import "server-only";
import { db } from "./db";
import { getTradeInfo } from "./shop-context";
import type { OrderLineSnapshot } from "@/app/actions/orders";

/**
 * Loads an order the current visitor may see: retail orders by their
 * unguessable id, trade orders only by their owner or an admin.
 */
export async function getVisibleOrder(id: string) {
  const order = await db.order.findUnique({ where: { id } });
  if (!order) return null;
  if (order.kind === "trade") {
    const trade = await getTradeInfo();
    const isAdmin = trade ? (await db.tradeAccount.findUnique({ where: { id: trade.accountId } }))?.role === "admin" : false;
    if (!trade || (trade.accountId !== order.accountId && !isAdmin)) return null;
  }
  return { ...order, lines: JSON.parse(order.lines) as OrderLineSnapshot[] };
}
