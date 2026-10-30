import { describe, expect, test, afterEach } from "bun:test";
import { classifyResponse, hasCompanyData, searchCompany, SEARCH_TIMEOUT_MS } from "./search-company";

describe("company response contract", () => {
  test("top-level VPS company is a success without a data envelope", () => {
    expect(classifyResponse(200, "", { found: true, name: "ESET, spol. s r.o." }).type).toBe("success");
  });
  test("400 Invalid ICO format is validation, not not-found", () => {
    expect(classifyResponse(400, '{"error":"Invalid ICO format"}', null)).toEqual({ type: "validation_error", message: "Neplatný formát IČO." });
  });
  test("404 is not-found", () => {
    expect(classifyResponse(404, "", null).message).toBe("Nenašli sme záznam.");
  });
  test("empty 200 is not-found", () => {
    expect(classifyResponse(200, "", null).type).toBe("not_found");
  });
  test("missing name is not-found even if VPS says found", () => {
    expect(classifyResponse(200, "", { found: true, name: null }).type).toBe("not_found");
  });
  test("whitespace and non-string names are not companies", () => {
    expect(hasCompanyData({ name: "  " })).toBe(false);
    expect(hasCompanyData({ name: 42 })).toBe(false);
  });
  test("found false cannot render company data", () => {
    expect(classifyResponse(200, "", { found: false, name: "ESET" }).type).toBe("not_found");
  });
  test("server errors are not misreported as missing companies", () => {
    expect(classifyResponse(502, "Bad gateway", null).type).toBe("network_error");
  });
});

const originalFetch = globalThis.fetch;
afterEach(() => { globalThis.fetch = originalFetch; });
test("real search sends required contract header and retains full body", async () => {
  Object.defineProperty(globalThis, "window", { configurable: true, value: { location: { origin: "http://localhost:8080" } } });
  let seenHeaders: HeadersInit | undefined;
  globalThis.fetch = (async (_url: unknown, init?: RequestInit) => {
    seenHeaders = init?.headers;
    return new Response(JSON.stringify({ found: true, name: "ESET", extra: "x".repeat(600) }), { status: 200 });
  }) as typeof fetch;
  const result = await searchCompany("31333532");
  expect(new Headers(seenHeaders).get("X-ICO-LOOKUP-CONTRACT")).toBe("js_default");
  expect(result.bodyPreview.length).toBe(500);
  expect(result.rawBody?.length).toBeGreaterThan(600);
  expect(result.requestUrl).toBe("http://localhost:8080/api/proxy-search?ico=31333532");
});
test("search aborts at the requested twelve-second timeout", async () => {
  Object.defineProperty(globalThis, "window", { configurable: true, value: { location: { origin: "http://localhost:8080" } } });
  let aborted = false;
  globalThis.fetch = ((_url: unknown, init?: RequestInit) => new Promise((_resolve, reject) => {
    init?.signal?.addEventListener("abort", () => { aborted = true; reject(new DOMException("Aborted", "AbortError")); });
  })) as typeof fetch;
  expect(SEARCH_TIMEOUT_MS).toBe(12000);
  const result = await searchCompany("31333532");
  expect(aborted).toBe(true);
  expect(result.type).toBe("network_error");
  expect(result.message).toContain("server neodpovedá");
}, 14000);