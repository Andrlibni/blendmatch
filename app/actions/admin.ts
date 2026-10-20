"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/shop-context";

async function requireAdmin() {
  if (!(await isAdmin())) throw new Error("Forbidden");
}

export async function setApproval(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const approved = formData.get("approved") === "true";
  await db.tradeAccount.update({
    where: { id },
    data: { approved, approvedAt: approved ? new Date() : null },
  });
  revalidatePath("/[locale]/admin", "page");
}

export async function setOrderStatus(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const status = String(formData.get("status"));
  if (!["draft", "confirmed", "cancelled"].includes(status)) return;
  await db.order.update({ where: { id }, data: { status } });
  revalidatePath("/[locale]/admin", "page");
}
