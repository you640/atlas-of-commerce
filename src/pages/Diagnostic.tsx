import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, Play, Loader2, CheckCircle2, XCircle, AlertTriangle, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { searchCompany, type CompanySearchResult } from "@/lib/search-company";

interface DiagnosticEntry {
  ico: string;
  label: string;
  expectedType: CompanySearchResult["type"][];
  result?: CompanySearchResult;
}

const TESTS: Omit<DiagnosticEntry, "result">[] = [
  {
    ico: "31333532",
    label: "Platné IČO (31333532) → očakávame success",
    expectedType: ["success"],
  },
  {
    ico: "test",
    label: "Neplatné IČO (test) → očakávame validation_error",
    expectedType: ["validation_error"],
  },
  {
    ico: "00000000",
    label: "Neexistujúce IČO (00000000) → očakávame not_found",
    expectedType: ["not_found"],
  },
];

const typeIcon = (type: CompanySearchResult["type"], pass: boolean) => {
  if (pass) return <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />;
  return <XCircle className="h-5 w-5 text-destructive shrink-0" />;
};

const typeBadge = (type: CompanySearchResult["type"]) => {
  const map: Record<CompanySearchResult["type"], { label: string; cls: string }> = {
    success: { label: "SUCCESS", cls: "text-accent" },
    validation_error: { label: "VALIDATION ERROR", cls: "text-yellow-400" },
    not_found: { label: "NOT FOUND", cls: "text-muted-foreground" },
    network_error: { label: "NETWORK ERROR", cls: "text-destructive" },
  };
  const { label, cls } = map[type];
  return <span className={`font-bold text-xs uppercase ${cls}`}>{label}</span>;
};

const Diagnostic = () => {
  const [entries, setEntries] = useState<DiagnosticEntry[]>([]);
  const [running, setRunning] = useState(false);

  const handleRun = async () => {
    setRunning(true);
    setEntries([]);
    const results: DiagnosticEntry[] = [];
    for (const test of TESTS) {
      const result = await searchCompany(test.ico);
      results.push({ ...test, result });
    }
    setEntries(results);
    setRunning(false);
  };

  return (
    <>
      <Helmet>
        <title>Diagnostika | IČO ATLAS</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="min-h-screen bg-background p-4 md:p-8 space-y-6 max-w-3xl mx-auto">
        <div className="flex items-center gap-3">
          <Link to="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-foreground">
            API Diagnostika
          </h1>
        </div>

        <Card className="glass border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">Proxy Search Tests</CardTitle>
            <Button
              variant="primary"
              size="sm"
              onClick={handleRun}
              disabled={running}
            >
              {running ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : (
                <Play className="h-4 w-4 mr-1" />
              )}
              Run
            </Button>
          </CardHeader>
          <CardContent className="space-y-1 text-sm text-muted-foreground">
            {TESTS.map((t, i) => (
              <p key={i}>Test {i + 1}: {t.label}</p>
            ))}
          </CardContent>
        </Card>

        {entries.map((entry, i) => {
          const r = entry.result;
          if (!r) return null;
          const pass = entry.expectedType.includes(r.type);

          return (
            <Card key={i} className="glass border-border overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  {typeIcon(r.type, pass)}
                  <CardTitle className="text-sm font-semibold">
                    {entry.label}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                {/* Classification */}
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground font-medium">Typ:</span>
                  {typeBadge(r.type)}
                  <span className="text-muted-foreground">→</span>
                  <span className="text-foreground font-medium">{r.message}</span>
                </div>

                {/* Request URL */}
                <div>
                  <span className="text-muted-foreground block mb-1 font-medium">
                    Request URL
                  </span>
                  <code className="block bg-muted/30 rounded-lg p-2 break-all text-foreground">
                    {r.requestUrl}
                  </code>
                </div>

                {/* Status */}
                <div>
                  <span className="text-muted-foreground block mb-1 font-medium">
                    Status
                  </span>
                  <span
                    className={
                      pass ? "text-accent font-bold" : "text-destructive font-bold"
                    }
                  >
                    {r.status ?? "N/A"}
                  </span>
                </div>

                {/* Response Headers */}
                <div>
                  <span className="text-muted-foreground block mb-1 font-medium">
                    Response Headers
                  </span>
                  <pre className="bg-muted/30 rounded-lg p-2 overflow-x-auto text-foreground whitespace-pre-wrap">
                    {Object.keys(r.responseHeaders).length > 0
                      ? Object.entries(r.responseHeaders)
                          .map(([k, v]) => `${k}: ${v}`)
                          .join("\n")
                      : "—"}
                  </pre>
                </div>

                {/* Body Preview */}
                <div>
                  <span className="text-muted-foreground block mb-1 font-medium">
                    Body (prvých 500 znakov)
                  </span>
                  <pre className="bg-muted/30 rounded-lg p-2 overflow-x-auto text-foreground whitespace-pre-wrap">
                    {r.bodyPreview || "—"}
                  </pre>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
};

export default Diagnostic;
