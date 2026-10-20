import "server-only";
import { countries, type CountryCode } from "@/lib/config";
import { displayVat, normalizeVat, vatPatterns } from "./formats";
import { isValidItalianVat, isValidNorwegianOrgNumber } from "./checksum";
import { checkVies } from "./vies";
import { checkHmrc } from "./hmrc";

export type VatCheckMethod = "vies" | "hmrc" | "format" | "unverified";

export type VatValidation =
  | { ok: false; error: "format" | "checksum" | "notFound" }
  | {
      ok: true;
      vatNumber: string;
      /** vies/hmrc: confirmed by the official register; format: no register for this country;
       *  unverified: the register did not answer, manual check needed. */
      method: VatCheckMethod;
      name?: string;
      address?: string;
      note?: string;
    };

/**
 * Validates a VAT number in three layers: format (per-country regex),
 * checksum (Italy, Norway) and a live check against VIES (EU) or HMRC (UK).
 * When the live service is down the number is accepted as "unverified" so
 * that the account can still be created and checked by hand before approval.
 */
export async function validateVat(country: CountryCode, raw: string): Promise<VatValidation> {
  const normalized = normalizeVat(country, raw);
  if (!vatPatterns[country].test(normalized)) return { ok: false, error: "format" };
  if (country === "IT" && !isValidItalianVat(normalized)) return { ok: false, error: "checksum" };
  if (country === "NO" && !isValidNorwegianOrgNumber(normalized)) return { ok: false, error: "checksum" };

  const vatNumber = displayVat(country, normalized);
  const eu = countries.find((c) => c.code === country)?.eu;

  if (eu) {
    const res = await checkVies(country, normalized);
    if (res.status === "invalid") return { ok: false, error: "notFound" };
    if (res.status === "valid") return { ok: true, vatNumber, method: "vies", name: res.name, address: res.address };
    return { ok: true, vatNumber, method: "unverified", note: `VIES unavailable (${res.reason})` };
  }

  if (country === "GB") {
    const res = await checkHmrc(normalized);
    if (res.status === "invalid") return { ok: false, error: "notFound" };
    if (res.status === "valid") return { ok: true, vatNumber, method: "hmrc", name: res.name, address: res.address };
    return { ok: true, vatNumber, method: "unverified", note: `HMRC check skipped (${res.reason})` };
  }

  // Norway: no public VAT register API wired yet (Brønnøysund could be added).
  return { ok: true, vatNumber, method: "format", note: "Norwegian org. number checksum valid" };
}
