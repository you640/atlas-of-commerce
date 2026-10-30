// Shared transport for search and diagnostics. Never replace API data with demos.
export const SEARCH_TIMEOUT_MS = 12_000;
export const SEARCH_HEADERS = { "X-ICO-LOOKUP-CONTRACT": "js_default" };

export interface CompanySearchResult {
  type: "success" | "validation_error" | "not_found" | "network_error";
  message: string;
  status: number | null;
  data: Record<string, unknown> | null;
  bodyPreview: string;
  rawBody?: string;
  latencyMs?: number;
  timestamp?: string;
  responseHeaders: Record<string, string>;
  requestUrl: string;
}

export function isCompanyRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function hasCompanyData(parsed: Record<string, unknown> | null): boolean {
  if (!parsed) return false;
  const sources = [parsed, ...(isCompanyRecord(parsed.data) ? [parsed.data] : [])];
  return sources.some(source => [source.name, source.company_name, source.obchodne_meno]
    .some(name => typeof name === "string" && name.trim().length > 0));
}

export function classifyResponse(status: number, text: string, parsed: Record<string, unknown> | null): Pick<CompanySearchResult, "type" | "message"> {
  if (status === 400 && text.includes("Invalid ICO format")) {
    return { type: "validation_error", message: "Neplatný formát IČO." };
  }
  if (status === 404 || (status === 200 && (parsed?.found === false || !hasCompanyData(parsed)))) {
    return { type: "not_found", message: "Nenašli sme záznam." };
  }
  if (status === 200 && hasCompanyData(parsed)) {
    return { type: "success", message: "Záznam nájdený." };
  }
  return { type: "network_error", message: "Služba je momentálne nedostupná. Skúste to prosím neskôr." };
}

export async function searchCompany(ico: string): Promise<CompanySearchResult> {
  const base = (import.meta.env?.VITE_COMPANY_API_BASE_URL || "").replace(/\/$/, "");
  const path = base ? `${base}/api/company/proxy-search` : "/api/proxy-search";
  const requestUrl = new URL(`${path}?ico=${encodeURIComponent(ico.trim())}`, window.location.origin).href;
  const controller = new AbortController();
  const started = performance.now();
  const timestamp = new Date().toISOString();
  const timer = setTimeout(() => controller.abort(), SEARCH_TIMEOUT_MS);
  let status: number | null = null;
  const responseHeaders: Record<string, string> = {};
  try {
    const res = await fetch(requestUrl, { method: "GET", signal: controller.signal, headers: SEARCH_HEADERS });
    status = res.status;
    res.headers.forEach((value, key) => { responseHeaders[key] = value; });
    const text = await res.text();
    let parsed: Record<string, unknown> | null = null;
    try {
      const value: unknown = JSON.parse(text);
      if (isCompanyRecord(value)) parsed = value;
    } catch { /* HTML and malformed JSON are not company records. */ }
    const classification = status === 200 && !parsed && text.trim()
      ? { type: "network_error" as const, message: "Služba vrátila neplatnú odpoveď. Skúste to prosím neskôr." }
      : classifyResponse(status, text, parsed);
    return { ...classification, status, data: parsed, bodyPreview: text.slice(0, 500), rawBody: text,
      responseHeaders, requestUrl, latencyMs: Math.round(performance.now() - started), timestamp };
  } catch {
    return { type: "network_error", message: controller.signal.aborted
      ? "Služba je momentálne nedostupná (server neodpovedá). Skúste to prosím neskôr."
      : "Nepodarilo sa spojiť so službou. Skontrolujte pripojenie a skúste to znova.",
      status, data: null, bodyPreview: "", rawBody: "", responseHeaders, requestUrl,
      latencyMs: Math.round(performance.now() - started), timestamp };
  } finally { clearTimeout(timer); }
}
