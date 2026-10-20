import "server-only";

const VIES_URL =
  "https://ec.europa.eu/taxation_customs/vies/rest-api/check-vat-number";

export type RemoteCheck =
  | { status: "valid"; name?: string; address?: string }
  | { status: "invalid" }
  | { status: "unavailable"; reason: string };

/**
 * Checks an EU VAT number with the European Commission VIES REST API.
 * Any network error, timeout or member-state outage returns "unavailable",
 * so the caller can fall back to format validation and manual review.
 */
export async function checkVies(countryCode: string, vatNumber: string): Promise<RemoteCheck> {
  if (process.env.VIES_ENABLED === "false") return { status: "unavailable", reason: "disabled" };
  try {
    const res = await fetch(VIES_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ countryCode, vatNumber }),
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    const data = (await res.json().catch(() => null)) as {
      valid?: boolean;
      name?: string;
      address?: string;
      errorWrappers?: { error?: string }[];
    } | null;
    if (!res.ok || !data || typeof data.valid !== "boolean") {
      return {
        status: "unavailable",
        reason: data?.errorWrappers?.[0]?.error ?? `HTTP ${res.status}`,
      };
    }
    if (!data.valid) return { status: "invalid" };
    const clean = (s?: string) => (s && s.trim() !== "---" ? s.trim() : undefined);
    return { status: "valid", name: clean(data.name), address: clean(data.address) };
  } catch (error) {
    return { status: "unavailable", reason: error instanceof Error ? error.message : "network" };
  }
}
