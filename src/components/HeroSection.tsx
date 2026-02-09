import { useState } from "react";
import { AlertTriangle, SearchX } from "lucide-react";
import SearchBox from "./SearchBox";
import DataCardPreview from "./DataCardPreview";
import { searchCompany, type CompanySearchResult } from "@/lib/search-company";

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CompanySearchResult | null>(null);

  const handleSubmit = async () => {
    const trimmed = query.trim();
    if (!trimmed || loading) return;
    setLoading(true);
    setResult(null);
    const res = await searchCompany(trimmed);
    setResult(res);
    setLoading(false);
  };

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
        </div>
      )}

      {/* Success → show the existing data card */}
      {result?.type === "success" && <DataCardPreview data={result.data} />}

      {/* Show static preview when no search has been performed yet */}
      {!result && !loading && <DataCardPreview />}
    </main>
  );
};

export default HeroSection;
