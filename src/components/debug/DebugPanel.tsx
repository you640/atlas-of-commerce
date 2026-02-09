import { useState, useEffect, useCallback } from "react";
import { X, Copy, Play, Save, ChevronDown, ChevronRight, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  getLastRequest,
  getLastError,
  clearLastError,
  saveFixture,
  loadFixture,
  getUseFixture,
  setUseFixture,
  buildCurl,
  subscribeDebug,
  type DebugRequestRecord,
  type DebugErrorRecord,
} from "@/lib/debug-store";

/* ── Clipboard helper ── */
async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // fallback
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  }
}

/* ── Collapsible Section ── */
function Collapsible({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border/50 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-muted-foreground uppercase hover:bg-muted/30 transition-colors"
      >
        {open ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        {title}
      </button>
      {open && (
        <div className="max-h-64 overflow-auto border-t border-border/30">
          {children}
        </div>
      )}
    </div>
  );
}

/* ── Copy Row ── */
function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const doCopy = async () => {
    await copyText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="flex items-start gap-2 group">
      <div className="flex-1 min-w-0">
        <span className="text-[10px] text-muted-foreground uppercase block">{label}</span>
        <span className="text-xs text-foreground font-mono break-all">{value}</span>
      </div>
      <button
        onClick={doCopy}
        className="shrink-0 p-1 rounded hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
        title="Kopírovať"
      >
        {copied ? <span className="text-accent text-[10px]">✓</span> : <Copy className="w-3 h-3" />}
      </button>
    </div>
  );
}

/* ── Main Panel ── */
interface DebugPanelProps {
  open: boolean;
  onClose: () => void;
  onReplay: () => void;
}

export default function DebugPanel({ open, onClose, onReplay }: DebugPanelProps) {
  const [lastReq, setLastReq] = useState<DebugRequestRecord | null>(getLastRequest());
  const [lastErr, setLastErr] = useState<DebugErrorRecord | null>(getLastError());
  const [useFixture, setFixtureToggle] = useState(getUseFixture());
  const [hasFixture, setHasFixture] = useState(!!loadFixture());

  useEffect(() => {
    const unsub = subscribeDebug(() => {
      setLastReq(getLastRequest());
      setLastErr(getLastError());
      setFixtureToggle(getUseFixture());
      setHasFixture(!!loadFixture());
    });
    return unsub;
  }, []);

  const handleFixtureToggle = useCallback((on: boolean) => {
    setUseFixture(on);
    setFixtureToggle(on);
  }, []);

  const handleSaveFixture = useCallback(() => {
    if (lastReq) {
      saveFixture(lastReq);
      setHasFixture(true);
    }
  }, [lastReq]);

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-[90] bg-black/60" onClick={onClose} />
      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 z-[91] w-full max-w-md bg-background border-l border-border shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            🧪 Debug Ops
          </h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-muted/50 transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {/* Fixture toggle */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/50">
            <div>
              <span className="text-xs font-semibold text-foreground block">Použiť fixture</span>
              <span className="text-[10px] text-muted-foreground">
                {hasFixture ? "Fixture uložená" : "Žiadna fixture"}
              </span>
            </div>
            <Switch
              checked={useFixture}
              onCheckedChange={handleFixtureToggle}
              disabled={!hasFixture}
            />
          </div>

          {lastReq ? (
            <>
              {/* Request info */}
              <div className="space-y-2">
                <CopyRow label="URL" value={lastReq.requestUrl} />
                <CopyRow
                  label="Headers"
                  value={Object.entries(lastReq.requestHeaders)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join("\n")}
                />
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Status</span>
                    <span className={`font-mono font-bold ${lastReq.httpStatus && lastReq.httpStatus < 400 ? "text-accent" : "text-destructive"}`}>
                      {lastReq.httpStatus ?? "—"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Latencia</span>
                    <span className="font-mono text-foreground">{lastReq.latencyMs} ms</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Čas</span>
                    <span className="font-mono text-foreground text-[10px]">
                      {new Date(lastReq.timestamp).toLocaleTimeString("sk-SK")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Raw JSON */}
              <Collapsible title="Raw JSON Response">
                <pre className="p-3 text-[11px] font-mono text-foreground whitespace-pre-wrap break-all">
                  {lastReq.rawJson}
                </pre>
              </Collapsible>

              {/* Normalized Result */}
              <Collapsible title="Normalized CompanyResult">
                <pre className="p-3 text-[11px] font-mono text-foreground whitespace-pre-wrap break-all">
                  {JSON.stringify(lastReq.normalizedResult, null, 2)}
                </pre>
              </Collapsible>

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => copyText(lastReq.rawJson)}
                >
                  <Copy className="w-3 h-3 mr-1" /> Raw JSON
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => copyText(JSON.stringify(lastReq.normalizedResult, null, 2))}
                >
                  <Copy className="w-3 h-3 mr-1" /> Normalized
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => copyText(buildCurl(lastReq))}
                >
                  <Copy className="w-3 h-3 mr-1" /> cURL
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={handleSaveFixture}
                >
                  <Save className="w-3 h-3 mr-1" /> Fixture
                </Button>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={onReplay}
              >
                <Play className="w-3 h-3 mr-1" /> Replay last request
              </Button>
            </>
          ) : (
            <p className="text-xs text-muted-foreground text-center py-8">
              Žiadny request zatiaľ. Vyhľadajte niečo.
            </p>
          )}

          {/* Last Error */}
          {lastErr && (
            <div className="border border-destructive/30 rounded-lg p-3 space-y-2 bg-destructive/5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-destructive flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Last Error
                </h3>
                <button
                  onClick={() => { clearLastError(); setLastErr(null); }}
                  className="text-[10px] text-muted-foreground hover:text-foreground"
                >
                  Vymazať
                </button>
              </div>
              <div className="space-y-1 text-xs font-mono">
                <div><span className="text-muted-foreground">Query:</span> {lastErr.query}</div>
                <div><span className="text-muted-foreground">URL:</span> {lastErr.url}</div>
                <div><span className="text-muted-foreground">Status:</span> {lastErr.status ?? "—"}</div>
                <div><span className="text-muted-foreground">Latencia:</span> {lastErr.latencyMs} ms</div>
                <div><span className="text-muted-foreground">Čas:</span> {lastErr.timestamp}</div>
                <div className="text-[10px] break-all text-muted-foreground mt-1">{lastErr.responseSnippet.slice(0, 200)}</div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => copyText(JSON.stringify(lastErr, null, 2))}
              >
                <Copy className="w-3 h-3 mr-1" /> Copy error report
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
