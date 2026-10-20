import { NextResponse } from "next/server";
import { isCountryCode } from "@/lib/config";
import { validateVat } from "@/lib/vat";

/** Live VAT check used by the trade application form. */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { country?: string; vat?: string };
  if (!isCountryCode(body.country) || typeof body.vat !== "string" || body.vat.length > 30) {
    return NextResponse.json({ ok: false, error: "format" }, { status: 400 });
  }
  const result = await validateVat(body.country, body.vat);
  return NextResponse.json(result);
}
