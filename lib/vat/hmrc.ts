import "server-only";
import type { RemoteCheck } from "./vies";

/**
 * HMRC "Check a UK VAT number" API, v2.0 (application-restricted).
 * Needs HMRC_CLIENT_ID / HMRC_CLIENT_SECRET from the HMRC Developer Hub;
 * HMRC_API_BASE is https://test-api.service.hmrc.gov.uk (sandbox) or
 * https://api.service.hmrc.gov.uk (production).
 */
let cachedToken: { value: string; expiresAt: number } | null = null;

async function getToken(base: string) {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.value;
  const res = await fetch(`${base}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.HMRC_CLIENT_ID!,
      client_secret: process.env.HMRC_CLIENT_SECRET!,
    }),
    signal: AbortSignal.timeout(8000),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`HMRC token HTTP ${res.status}`);
  const data = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = { value: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
  return cachedToken.value;
}

export function hmrcConfigured() {
  return Boolean(process.env.HMRC_CLIENT_ID && process.env.HMRC_CLIENT_SECRET);
}

export async function checkHmrc(vrn: string): Promise<RemoteCheck> {
  if (!hmrcConfigured()) return { status: "unavailable", reason: "not configured" };
  const base = process.env.HMRC_API_BASE ?? "https://test-api.service.hmrc.gov.uk";
  try {
    const token = await getToken(base);
    const res = await fetch(`${base}/organisations/vat/check-vat-number/lookup/${encodeURIComponent(vrn)}`, {
      headers: { Accept: "application/vnd.hmrc.2.0+json", Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    if (res.status === 404) return { status: "invalid" };
    if (!res.ok) return { status: "unavailable", reason: `HTTP ${res.status}` };
    const data = (await res.json()) as {
      target?: { name?: string; address?: Record<string, string> };
    };
    const address = data.target?.address ? Object.values(data.target.address).join(", ") : undefined;
    return { status: "valid", name: data.target?.name, address };
  } catch (error) {
    return { status: "unavailable", reason: error instanceof Error ? error.message : "network" };
  }
}
