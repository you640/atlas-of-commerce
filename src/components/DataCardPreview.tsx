import { MapPin, TrendingUp, Users, Building2, Copy, Download } from "lucide-react";
import { useState, type ReactNode } from "react";
import { copyResponse, downloadResponse } from "@/lib/response-actions";
import { Button } from "@/components/ui/button";

/* ── Helpers ── */

/** Clamp invalid numeric values to undefined */
export function normalizeFinanceValue(v: unknown): number | undefined {
  if (v == null || typeof v === "boolean" || (typeof v !== "number" && typeof v !== "string") || (typeof v === "string" && !v.trim())) return undefined;
  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(n)) return undefined;
  return n;
}

/** Format a number as EUR with Slovak-style magnitude suffix.
 *  Negative values use "−" (minus sign U+2212) with absolute formatting.
 *  Uses non-breaking space as thousands separator for plain values. */
export function formatMoneyEUR(value: number): string {
  if (!Number.isFinite(value)) return "—";

  const negative = value < 0;
  const prefix = negative ? "−\u00A0" : "";
  const abs = Math.abs(value);

  if (abs >= 1_000_000) {
    const millions = abs / 1_000_000;
    return `${prefix}${millions.toFixed(1).replace(/\.0$/, "")} mil. €`;
  }
  if (abs >= 1_000) {
    const thousands = abs / 1_000;
    return `${prefix}${thousands.toFixed(1).replace(/\.0$/, "")} tis. €`;
  }

  // For values < 1000, format with locale spacing (e.g. "1 234 €")
  const formatted = Math.round(abs).toLocaleString("sk-SK");
  return `${prefix}${formatted} €`;
}

/**
 * Normalise an address value (string | object | null) into a displayable ReactNode.
 * Returns undefined when there is nothing to show.
 */
export function formatAddress(address: unknown): ReactNode | undefined {
  if (!address) return undefined;

  if (typeof address === "string") {
    const trimmed = address.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }

  if (typeof address === "object" && !Array.isArray(address)) {
    const a = address as Record<string, unknown>;
    const parts: string[] = [];

    // street + number
    const street = [a.street, a.street_name, a.ulica].find((v) => typeof v === "string" && v) as string | undefined;
    const num = [a.number, a.building_number, a.cislo].find((v) => v != null) as string | number | undefined;
    if (street) parts.push(num ? `${street} ${num}` : street);

    // postal + city
    const postal = [a.postal_code, a.zip, a.psc].find((v) => typeof v === "string" && v) as string | undefined;
    const city = [a.city, a.municipality, a.obec, a.mesto].find((v) => typeof v === "string" && v) as string | undefined;
    if (postal || city) parts.push([postal, city].filter(Boolean).join(" "));
    if (typeof a.country === "string" && a.country && parts.length > 0) parts.push(a.country);

    if (parts.length === 0) return undefined;
    return (
      <>
        {parts.map((p, i) => (
          <span key={i}>
            {p}
            {i < parts.length - 1 && <br />}
          </span>
        ))}
      </>
    );
  }

  return undefined;
}

/* ── Internals ── */

/** Try to read a field from data or its nested "data" envelope */
function extractField(data: Record<string, unknown> | null | undefined, ...keys: string[]): string | undefined {
  if (!data) return undefined;
  for (const k of keys) {
    if (typeof data[k] === "string" && (data[k] as string).length > 0) return data[k] as string;
  }
  const inner = data.data;
  if (inner && typeof inner === "object" && !Array.isArray(inner)) {
    const d = inner as Record<string, unknown>;
    for (const k of keys) {
      if (typeof d[k] === "string" && (d[k] as string).length > 0) return d[k] as string;
    }
  }
  return undefined;
}

function extractNumber(data: Record<string, unknown> | null | undefined, ...keys: string[]): number | undefined {
  if (!data) return undefined;
  const sources = [data];
  if (data.data && typeof data.data === "object" && !Array.isArray(data.data)) {
    sources.push(data.data as Record<string, unknown>);
  }
  for (const src of sources) {
    for (const k of keys) {
      const result = normalizeFinanceValue(src[k]);
      if (result !== undefined) return result;
    }
  }
  return undefined;
}

function extractArray(data: Record<string, unknown> | null | undefined, ...keys: string[]): string[] | undefined {
  if (!data) return undefined;
  const sources = [data];
  if (data.data && typeof data.data === "object" && !Array.isArray(data.data)) {
    sources.push(data.data as Record<string, unknown>);
  }
  for (const src of sources) {
    for (const k of keys) {
      const v = src[k];
      if (Array.isArray(v) && v.length > 0) {
        return v.map((item) => (typeof item === "string" ? item : typeof item === "object" && item?.name ? String(item.name) : String(item)));
      }
    }
  }
  return undefined;
}

function extractRawField(data: Record<string, unknown> | null | undefined, ...keys: string[]): unknown {
  if (!data) return undefined;
  const sources = [data];
  if (data.data && typeof data.data === "object" && !Array.isArray(data.data)) {
    sources.push(data.data as Record<string, unknown>);
  }
  for (const src of sources) {
    for (const k of keys) {
      if (src[k] != null) return src[k];
    }
  }
  return undefined;
}

/** Derive active/inactive/unknown status */
function deriveStatus(data: Record<string, unknown> | null): "active" | "inactive" | "unknown" {
  if (!data) return "unknown";
  const raw = extractRawField(data, "status", "active", "state");
  if (raw === true || raw === "active" || raw === "Aktívny" || raw === "aktívny") return "active";
  if (raw === false || raw === "inactive" || raw === "Neaktívny" || raw === "neaktívny" || raw === "zrušený" || raw === "Zrušený" || raw === "v likvidácii") return "inactive";
  if (typeof raw === "string" && raw.length > 0) {
    // Any other non-empty string — try to infer
    const lower = raw.toLowerCase();
    if (lower.includes("neaktív") || lower.includes("zruš") || lower.includes("likvidác") || lower.includes("inactive")) return "inactive";
    if (lower.includes("aktív") || lower.includes("active")) return "active";
  }
  return "unknown";
}

const STATUS_MAP = {
  active: { label: "Aktívny subjekt", dotClass: "bg-accent shadow-[0_0_10px_hsl(var(--accent))]" },
  inactive: { label: "Neaktívny subjekt", dotClass: "bg-destructive shadow-[0_0_10px_hsl(var(--destructive))]" },
  unknown: { label: "Neznámy stav", dotClass: "bg-muted-foreground" },
};

const SparklineChart = ({ values, color }: { values: number[]; color: "blue" | "red" }) => {
  const colorClass = color === "blue" ? "bg-primary" : "bg-secondary";
  return (
    <div className="flex items-end h-8 gap-1 mt-2 opacity-70">
      {values.map((value, index) => (
        <div key={index} className={`sparkline-bar ${colorClass}`} style={{ height: `${value}%` }} />
      ))}
    </div>
  );
};

/* ── Props ── */

type DataCardPreviewProps =
  | { mode: "demo" }
  | { mode?: "api"; data: Record<string, unknown> };

const DEMO_DATA = {
  companyName: "ESET, spol. s r.o.",
  ico: "31333532",
  address: (<>Einsteinova 24<br />851 01 Bratislava</>),
  executives: ["Ing. Miroslav Trnka", "Rudolf Hrubý", "Maroš Grund"],
  revenue: 589_000_000,
  profit: 85_000_000,
};

/* ── Component ── */

const DataCardPreview = (props: DataCardPreviewProps) => {
  const isDemo = props.mode === "demo";
  const data = isDemo ? null : (props as { data: Record<string, unknown> }).data;

  // Name & IČO
  const companyName = isDemo
    ? DEMO_DATA.companyName
    : extractField(data, "name", "company_name", "obchodne_meno") ?? "—";
  const ico = isDemo
    ? DEMO_DATA.ico
    : extractField(data, "ico", "cin") ?? "—";

  // Status
  const status = isDemo ? "active" : deriveStatus(data);
  const { label: statusLabel, dotClass: statusDotClass } = STATUS_MAP[status];

  // Address
  const addressNode = isDemo
    ? DEMO_DATA.address
    : formatAddress(extractRawField(data, "address", "sidlo", "registered_office"));

  // Finances
  const finance = isDemo ? null : extractRawField(data, "finance");
  const financeData = finance && typeof finance === "object" && !Array.isArray(finance) ? finance as Record<string, unknown> : null;
  const revenue = isDemo ? DEMO_DATA.revenue : extractNumber(financeData, "revenue", "trzby", "sales", "total_revenue") ?? extractNumber(data, "revenue", "trzby", "sales", "total_revenue");
  const profit = isDemo ? DEMO_DATA.profit : extractNumber(financeData, "profit", "zisk", "net_income", "net_profit") ?? extractNumber(data, "profit", "zisk", "net_income", "net_profit");
  const financeYear = isDemo ? "2023" : (extractField(financeData, "year", "finance_year") ?? extractField(data, "finance_year", "financial_year", "rok")) ?? "posledný rok";
  const hasFinances = revenue != null || profit != null;

  // Executives
  const executives = isDemo
    ? DEMO_DATA.executives
    : extractArray(data, "statutaries", "statutory_bodies", "executives", "statutarny_organ");
  const hasExecutives = executives && executives.length > 0;

  // Count visible grid sections to decide layout
  const legalForm = isDemo ? undefined : extractField(data, "legal_form");
  const foundedOn = isDemo ? undefined : extractField(data, "founded_on");
  const dissolvedOn = isDemo ? undefined : extractField(data, "dissolved_on");
  const [copied, setCopied] = useState(false);
  const visibleSections: ReactNode[] = [];
  if (legalForm || foundedOn || dissolvedOn) {
    visibleSections.push(
      <div key="registry">
        <h4 className="text-sm text-muted-foreground uppercase mb-4 flex items-center gap-2"><Building2 className="w-4 h-4 text-primary" />Register</h4>
        <dl className="space-y-2 text-sm text-silver">
          {legalForm && <div><dt className="text-muted-foreground">Právna forma</dt><dd className="font-medium">{legalForm}</dd></div>}
          {foundedOn && <div><dt className="text-muted-foreground">Vznik</dt><dd className="font-medium">{new Date(foundedOn).toLocaleDateString("sk-SK")}</dd></div>}
          {dissolvedOn && <div><dt className="text-muted-foreground">Zánik</dt><dd className="font-medium">{new Date(dissolvedOn).toLocaleDateString("sk-SK")}</dd></div>}
        </dl>
      </div>
    );
  }

  // Address section
  if (addressNode) {
    visibleSections.push(
      <div key="address">
        <h4 className="text-sm text-muted-foreground uppercase mb-4 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          Sídlo
        </h4>
        <p className="text-silver font-medium leading-relaxed">{addressNode}</p>
      </div>
    );
  }

  // Finances section
  if (hasFinances) {
    visibleSections.push(
      <div key="finances">
        <h4 className="text-sm text-muted-foreground uppercase mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          Financie ({financeYear})
        </h4>
        <div className="space-y-4">
          {revenue != null && (
            <div>
              <div className="text-xl font-bold text-foreground flex items-center gap-2">
                {formatMoneyEUR(revenue)}
              </div>
              {isDemo && <SparklineChart values={[40, 60, 50, 80, 100]} color="blue" />}
            </div>
          )}
          {profit != null && (
            <div>
              <div className="text-lg font-semibold text-silver flex items-center gap-2">
                Zisk: {formatMoneyEUR(profit)}
              </div>
              {isDemo && <SparklineChart values={[30, 50, 70, 60, 90]} color="red" />}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Executives section
  if (hasExecutives) {
    visibleSections.push(
      <div key="executives">
        <h4 className="text-sm text-muted-foreground uppercase mb-4 flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          Štatutárny orgán
        </h4>
        <ul>
          {executives?.map((name) => (
            <li key={name} className="executive-item text-silver font-medium">
              {name}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="mt-12 w-full max-w-3xl bg-background/80 backdrop-blur-xl border border-border/50 border-t-2 border-t-primary/50 rounded-xl p-8 relative overflow-hidden shadow-2xl animate-slide-up animate-scanline">
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8 pb-4 border-b border-border/50">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-1">{companyName}</h2>
          <span className="text-primary font-semibold tracking-wider">IČO: {ico}</span>
        </div>
        <div className={`flex items-center gap-2 ${status === "active" ? "bg-accent/10 border-accent/30" : status === "inactive" ? "bg-destructive/10 border-destructive/30" : "bg-muted/30 border-border"} px-3 py-1.5 rounded-full border`}>
          <div className={`w-2.5 h-2.5 rounded-full ${statusDotClass} ${status === "active" ? "animate-blink" : ""}`} />
          <span className={`text-sm font-semibold ${status === "active" ? "text-accent" : status === "inactive" ? "text-destructive" : "text-muted-foreground"}`}>
            {statusLabel}
          </span>
        </div>
      </div>

      {/* Data Grid */}
      {visibleSections.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
          {visibleSections}
        </div>
      )}

      {!isDemo && (
        <div className="mt-8 pt-4 border-t border-border/50 flex flex-wrap justify-end gap-2">
          <Button variant="outline" size="sm" onClick={async () => { setCopied(await copyResponse(JSON.stringify(data, null, 2))); setTimeout(() => setCopied(false), 1500); }} className="text-xs gap-2">
            <Copy className="w-3 h-3" />{copied ? "Skopírované" : "Kopírovať údaje"}
          </Button>
          <Button variant="outline" size="sm" onClick={() => downloadResponse(data, `ico-${ico}.json`)} className="text-xs gap-2">
            <Download className="w-3 h-3" />Stiahnuť JSON
          </Button>
        </div>
      )}
    </div>
  );
};

export default DataCardPreview;
