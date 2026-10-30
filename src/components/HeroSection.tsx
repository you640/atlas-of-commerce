import { useState, useCallback, forwardRef, useImperativeHandle } from "react";
import { AlertTriangle, RotateCw, SearchX } from "lucide-react";
import SearchBox from "./SearchBox";
import DataCardPreview from "./DataCardPreview";
import { searchCompany, type CompanySearchResult } from "@/lib/search-company";
import { setLastRequest, loadFixture, getUseFixture, type DebugRequestRecord } from "@/lib/debug-store";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onDebugCommand?: () => void;
}

const HeroSection = forwardRef<{ replay: () => void }, HeroSectionProps>(({ onDebugCommand }, ref) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CompanySearchResult | null>(null);

  const handleSubmit = useCallback(async () => {
    const trimmed = query.trim();
    if (!trimmed || loading) return;

    // Debug command: typing "debug" toggles debug mode
    if (trimmed.toLowerCase() === "debug") {
      setQuery("");
      onDebugCommand?.();
      return;
    }

    // Check fixture mode
    if (getUseFixture()) {
      const fixture = loadFixture();
      if (fixture) {
        setResult(fixture.normalizedResult);
        setLastRequest({ ...fixture, query: trimmed, timestamp: new Date().toISOString() });
        return;
      }
    }

    setLoading(true);
    setResult(null);

    const res = await searchCompany(trimmed);
    const latencyMs = res.latencyMs ?? 0;

    setResult(res);
    setLoading(false);

    // Capture debug record
    const debugRecord: DebugRequestRecord = {
      query: trimmed,
      requestUrl: res.requestUrl,
      requestHeaders: { "X-ICO-LOOKUP-CONTRACT": "js_default" },
      httpStatus: res.status,
      latencyMs,
      timestamp: new Date().toISOString(),
      rawJson: res.rawBody || res.bodyPreview || JSON.stringify(res.data, null, 2) || "",
      normalizedResult: res,
    };
    setLastRequest(debugRecord);
  }, [query, loading, onDebugCommand]);

  // Replay: re-run the last query
  const replay = useCallback(() => {
    if (query.trim()) {
      handleSubmit();
    }
  }, [query, handleSubmit]);
  useImperativeHandle(ref, () => ({ replay }), [replay]);

  return (
    <main className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-16 lg:py-24">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-metallic mb-4 leading-tight">
        Kompletný obraz o slovenských firmách.
      </h1>
      <p className="text-lg text-silver opacity-90 max-w-2xl mb-12">
        Získajte overené finančné a právne dáta v reálnom čase. Rýchlo, presne a cez API.
      </p>

      <SearchBox
        value={query}
        onChange={setQuery}
        onSubmit={handleSubmit}
        loading={loading}
      />

      {/* Validation error */}
      {result?.type === "validation_error" && (
        <div className="mt-8 flex items-center gap-3 text-yellow-400">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span className="text-lg font-medium">{result.message}</span>
        </div>
      )}

      {/* Not found */}
      {result?.type === "not_found" && (
        <div className="mt-8 flex items-center gap-3 text-muted-foreground">
          <SearchX className="w-5 h-5 shrink-0" />
          <span className="text-lg font-medium">{result.message}</span>
        </div>
      )}

      {/* Network error */}
      {result?.type === "network_error" && (
        <div className="mt-8 flex items-center gap-3 text-destructive">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span className="text-lg font-medium">{result.message}</span>
          <Button variant="ghost" size="sm" onClick={replay} className="ml-2 gap-1"><RotateCw className="w-4 h-4" />Skúsiť znova</Button>
        </div>
      )}

      {/* Success → show the data card with API data */}
      {result?.type === "success" && result.data && <DataCardPreview data={result.data} />}

      {/* Show demo preview only when no search has been performed yet */}
      {!result && !loading && <DataCardPreview mode="demo" />}
    </main>
  );
});

// Expose replay via ref pattern — we use a simpler callback approach from parent
export default HeroSection;
