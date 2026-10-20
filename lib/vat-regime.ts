import type { CountryCode } from "./config";
import { countries } from "./config";

export type VatRegime = "domestic" | "reverse_charge" | "export";

/** The seller is an Italian entity: IT is domestic, EU is intra-community, the rest is export. */
export function vatRegimeFor(country: CountryCode): { regime: VatRegime; rate: number } {
  if (country === "IT") return { regime: "domestic", rate: 0.22 };
  const eu = countries.find((c) => c.code === country)?.eu;
  return eu ? { regime: "reverse_charge", rate: 0 } : { regime: "export", rate: 0 };
}
