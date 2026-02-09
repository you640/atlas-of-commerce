import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, Play, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

interface DiagnosticResult {
  label: string;
  requestUrl: string;
  status: number | null;
  statusText: string;
  responseHeaders: Record<string, string>;
  bodyPreview: string;
  error?: string;
  pass: boolean;
}

async function fetchDiagnostic(
  ico: string,
  label: string,
  expectStatus?: number[]
): Promise<DiagnosticResult> {
  const requestUrl = `${SUPABASE_URL}/functions/v1/proxy-search?ico=${encodeURIComponent(ico)}`;

  try {
    const res = await fetch(requestUrl, {
      method: "GET",
      headers: {
        "X-ICO-LOOKUP-CONTRACT": "js_default",
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        apikey: SUPABASE_ANON_KEY,
      },
    });

    const headersObj: Record<string, string> = {};
    res.headers.forEach((value, key) => {
      headersObj[key] = value;
    });

    const text = await res.text();
    const bodyPreview = text.slice(0, 500);

    const pass = expectStatus ? expectStatus.includes(res.status) : res.ok;

    return {
      label,
      requestUrl,
      status: res.status,
      statusText: res.statusText,
      responseHeaders: headersObj,
      bodyPreview,
      pass,
    };
  } catch (err: any) {
    return {
      label,
      requestUrl,
      status: null,
      statusText: "Network Error",
      responseHeaders: {},
      bodyPreview: "",
      error: err.message || String(err),
      pass: false,
    };
  }
}

async function runDiagnostics(): Promise<DiagnosticResult[]> {
  const results: DiagnosticResult[] = [];

  // Test 1: Valid ICO
  const test1 = await fetchDiagnostic(
    "31333532",
    "Valid ICO lookup (31333532)",
    [200]
  );
  results.push(test1);

  // Test 2: Invalid ICO "test" — expect 404 or error
  const test2 = await fetchDiagnostic(
    "test",
    "Invalid ICO lookup (test) — expect 404",
    [404]
  );
  results.push(test2);

  return results;
}

const Diagnostic = () => {
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [running, setRunning] = useState(false);

  const handleRun = async () => {
    setRunning(true);
    setResults([]);
    try {
      const res = await runDiagnostics();
      setResults(res);
    } finally {
      setRunning(false);
    }
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
            <p>Test 1: GET proxy-search?ico=31333532 → expect 200</p>
            <p>Test 2: GET proxy-search?ico=test → expect 404 + error message</p>
          </CardContent>
        </Card>

        {results.map((r, i) => (
          <Card key={i} className="glass border-border overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                {r.pass ? (
                  <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
                ) : (
                  <XCircle className="h-5 w-5 text-destructive shrink-0" />
                )}
                <CardTitle className="text-sm font-semibold">
                  {r.label}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
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
                    r.pass ? "text-accent font-bold" : "text-destructive font-bold"
                  }
                >
                  {r.status ?? "N/A"} {r.statusText}
                </span>
              </div>

              {/* Error */}
              {r.error && (
                <div>
                  <span className="text-destructive block mb-1 font-medium">
                    Error
                  </span>
                  <code className="block bg-destructive/10 rounded-lg p-2 text-destructive break-all">
                    {r.error}
                  </code>
                </div>
              )}

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
                  Body (first 500 chars)
                </span>
                <pre className="bg-muted/30 rounded-lg p-2 overflow-x-auto text-foreground whitespace-pre-wrap">
                  {r.bodyPreview || "—"}
                </pre>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

export default Diagnostic;
