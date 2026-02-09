/**
 * Debug data store – captures request metadata for the debug panel.
 * All state lives in-memory (singleton) + localStorage for fixtures/errors.
 */

import type { CompanySearchResult } from "./search-company";

export interface DebugRequestRecord {
  query: string;
  requestUrl: string;
  requestHeaders: Record<string, string>;
  httpStatus: number | null;
  latencyMs: number;
  timestamp: string;
  rawJson: string;
  normalizedResult: CompanySearchResult;
}

export interface DebugErrorRecord {
  query: string;
  url: string;
  status: number | null;
  latencyMs: number;
  responseSnippet: string;
  timestamp: string;
}

const LS_FIXTURE = "icoatlas:fixture:last";
const LS_ERROR = "icoatlas:lastError";
const LS_USE_FIXTURE = "icoatlas:useFixture";

/* ── Singleton state ── */
let _lastRequest: DebugRequestRecord | null = null;
const _listeners = new Set<() => void>();

function notify() { _listeners.forEach((fn) => fn()); }

export function subscribeDebug(fn: () => void) {
  _listeners.add(fn);
  return () => { _listeners.delete(fn); };
}

export function getLastRequest(): DebugRequestRecord | null { return _lastRequest; }

export function setLastRequest(record: DebugRequestRecord) {
  _lastRequest = record;
  // If non-success, save error
  if (record.normalizedResult.type !== "success") {
    const errorRecord: DebugErrorRecord = {
      query: record.query,
      url: record.requestUrl,
      status: record.httpStatus,
      latencyMs: record.latencyMs,
      responseSnippet: record.rawJson.slice(0, 500),
      timestamp: record.timestamp,
    };
    try { localStorage.setItem(LS_ERROR, JSON.stringify(errorRecord)); } catch {}
  }
  notify();
}

/* ── Last Error ── */
export function getLastError(): DebugErrorRecord | null {
  try {
    const raw = localStorage.getItem(LS_ERROR);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function clearLastError() {
  try { localStorage.removeItem(LS_ERROR); } catch {}
  notify();
}

/* ── Fixture ── */
export function saveFixture(record: DebugRequestRecord) {
  try { localStorage.setItem(LS_FIXTURE, JSON.stringify(record)); } catch {}
}

export function loadFixture(): DebugRequestRecord | null {
  try {
    const raw = localStorage.getItem(LS_FIXTURE);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function getUseFixture(): boolean {
  try { return localStorage.getItem(LS_USE_FIXTURE) === "1"; } catch { return false; }
}

export function setUseFixture(on: boolean) {
  try { localStorage.setItem(LS_USE_FIXTURE, on ? "1" : "0"); } catch {}
  notify();
}

/* ── cURL builder ── */
export function buildCurl(record: DebugRequestRecord): string {
  const origin = window.location.origin;
  const fullUrl = record.requestUrl.startsWith("http")
    ? record.requestUrl
    : `${origin}${record.requestUrl}`;
  const parts = [`curl -X GET '${fullUrl}'`];
  parts.push(`  -H 'X-ICO-LOOKUP-CONTRACT: js_default'`);
  for (const [k, v] of Object.entries(record.requestHeaders)) {
    if (k.toLowerCase() === "x-ico-lookup-contract") continue;
    parts.push(`  -H '${k}: ${v}'`);
  }
  return parts.join(" \\\n");
}
