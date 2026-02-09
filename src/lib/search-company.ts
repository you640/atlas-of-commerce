// Shared search logic for IČO Atlas proxy-search API
// Always sends X-ICO-LOOKUP-CONTRACT: js_default

export interface CompanySearchResult {
  /** "success" | "validation_error" | "not_found" | "network_error" */
  type: "success" | "validation_error" | "not_found" | "network_error";
  /** Slovak user-facing message */
  message: string;
  /** Raw HTTP status or null on network error */
  status: number | null;
  /** Parsed JSON body (if any) */
  data: Record<string, unknown> | null;
  /** Raw body text (first 500 chars) */
  bodyPreview: string;
  /** Response headers */
  responseHeaders: Record<string, string>;
  /** Full request URL */
  requestUrl: string;
}

/** Check whether parsed data contains a meaningful company record */
function hasCompanyData(parsed: Record<string, unknown> | null): boolean {
  if (!parsed) return false;
  // Top-level name fields
  if (parsed.name || parsed.company_name || parsed.obchodne_meno) return true;
  // Nested inside a "data" envelope
  const inner = parsed.data;
  if (inner && typeof inner === "object" && !Array.isArray(inner)) {
    const d = inner as Record<string, unknown>;
    if (d.name || d.company_name || d.obchodne_meno) return true;
  }
  return false;
}

const TIMEOUT_MS = 12_000;

export async function searchCompany(ico: string): Promise<CompanySearchResult> {
  const requestUrl = `/api/proxy-search?ico=${encodeURIComponent(ico)}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(requestUrl, {
      method: "GET",
      signal: controller.signal,
      headers: {
        "X-ICO-LOOKUP-CONTRACT": "js_default",
      },
    });

    const headersObj: Record<string, string> = {};
    res.headers.forEach((value, key) => {
      headersObj[key] = value;
    });

    const text = await res.text();
    const bodyPreview = text.slice(0, 500);

    let parsed: Record<string, unknown> | null = null;
    try {
      parsed = JSON.parse(text);
    } catch {
      // not JSON
    }

    // 1) HTTP 400 + body contains "Invalid ICO format" → validation error
    if (res.status === 400 && text.includes("Invalid ICO format")) {
      return {
        type: "validation_error",
        message: "Neplatný formát IČO.",
        status: res.status,
        data: parsed,
        bodyPreview,
        responseHeaders: headersObj,
        requestUrl,
      };
    }

    // 2) HTTP 200 + found:true + meaningful company data → success
    if (res.status === 200 && parsed?.found === true && hasCompanyData(parsed)) {
      return {
        type: "success",
        message: "Záznam nájdený.",
        status: res.status,
        data: parsed,
        bodyPreview,
        responseHeaders: headersObj,
        requestUrl,
      };
    }

    // 3) HTTP 200 with empty/missing data, found:false, 404, or no company name → not found
    if (
      res.status === 404 ||
      (res.status === 200 && parsed?.found === false) ||
      (res.status === 200 && !parsed?.data) ||
      (res.status === 200 && !hasCompanyData(parsed))
    ) {
      return {
        type: "not_found",
        message: "Nenašli sme záznam.",
        status: res.status,
        data: parsed,
        bodyPreview,
        responseHeaders: headersObj,
        requestUrl,
      };
    }

    // 4) Any other non-ok status → treat as not found / error
    if (!res.ok) {
      return {
        type: "not_found",
        message: "Nenašli sme záznam.",
        status: res.status,
        data: parsed,
        bodyPreview,
        responseHeaders: headersObj,
        requestUrl,
      };
    }

    // 5) Fallback for 200 with data
    return {
      type: "success",
      message: "Záznam nájdený.",
      status: res.status,
      data: parsed,
      bodyPreview,
      responseHeaders: headersObj,
      requestUrl,
    };
  } catch (err: unknown) {
    const isTimeout = err instanceof DOMException && err.name === "AbortError";
    const errorMsg = isTimeout
      ? "Časový limit požiadavky vypršal (12 s)."
      : err instanceof Error
        ? err.message
        : String(err);
    return {
      type: "network_error",
      message: "Chyba siete: " + errorMsg,
      status: null,
      data: null,
      bodyPreview: "",
      responseHeaders: {},
      requestUrl,
    };
  } finally {
    clearTimeout(timer);
  }
}
