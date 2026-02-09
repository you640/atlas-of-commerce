import { MapPin, TrendingUp, Users, ExternalLink, ArrowUp } from "lucide-react";

const SparklineChart = ({ values, color }: { values: number[]; color: "blue" | "red" }) => {
  const colorClass = color === "blue" ? "bg-primary" : "bg-secondary";
  
  return (
    <div className="flex items-end h-8 gap-1 mt-2 opacity-70">
      {values.map((value, index) => (
        <div
          key={index}
          className={`sparkline-bar ${colorClass}`}
          style={{ height: `${value}%` }}
        />
      ))}
    </div>
  );
};

/** Extract a human-readable company name from the API response */
function extractField(data: Record<string, unknown> | null | undefined, ...keys: string[]): string | undefined {
  if (!data) return undefined;
  for (const k of keys) {
    if (typeof data[k] === "string" && (data[k] as string).length > 0) return data[k] as string;
  }
  // Try nested "data" envelope
  const inner = data.data;
  if (inner && typeof inner === "object" && !Array.isArray(inner)) {
    const d = inner as Record<string, unknown>;
    for (const k of keys) {
      if (typeof d[k] === "string" && (d[k] as string).length > 0) return d[k] as string;
    }
  }
  return undefined;
}

type DataCardPreviewProps =
  | { mode: "demo" }
  | { mode?: "api"; data: Record<string, unknown> };

const DEMO_DATA = {
  companyName: "ESET, spol. s r.o.",
  ico: "31333532",
  address: <>Einsteinova 24<br />851 01 Bratislava</>,
  executives: ["Ing. Miroslav Trnka", "Rudolf Hrubý", "Maroš Grund"],
};

const DataCardPreview = (props: DataCardPreviewProps) => {
  const isDemo = props.mode === "demo";
  const data = isDemo ? null : (props as { data: Record<string, unknown> }).data;

  const companyName = isDemo
    ? DEMO_DATA.companyName
    : extractField(data, "name", "company_name", "obchodne_meno") ?? "—";
  const ico = isDemo
    ? DEMO_DATA.ico
    : extractField(data, "ico", "cin") ?? "—";
  const address = isDemo
    ? DEMO_DATA.address
    : extractField(data, "address", "sidlo", "registered_office") ?? "—";
  const executives = DEMO_DATA.executives;

  return (
    <div className="mt-12 w-full max-w-3xl bg-background/80 backdrop-blur-xl border border-border/50 border-t-2 border-t-primary/50 rounded-xl p-8 relative overflow-hidden shadow-2xl animate-slide-up animate-scanline">
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8 pb-4 border-b border-border/50">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-1">{companyName}</h2>
          <span className="text-primary font-semibold tracking-wider">IČO: {ico}</span>
        </div>
        <div className="flex items-center gap-2 bg-accent/10 px-3 py-1.5 rounded-full border border-accent/30">
          <div className="w-2.5 h-2.5 bg-accent rounded-full shadow-[0_0_10px_hsl(var(--accent))] animate-blink" />
          <span className="text-accent text-sm font-semibold">Aktívny subjekt</span>
        </div>
      </div>

      {/* Data Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Address */}
        <div>
          <h4 className="text-sm text-muted-foreground uppercase mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            Sídlo
          </h4>
          <p className="text-silver font-medium leading-relaxed">
            {address}
          </p>
        </div>

        {/* Finances */}
        <div>
          <h4 className="text-sm text-muted-foreground uppercase mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Financie (2023)
          </h4>
          <div className="space-y-4">
            <div>
              <div className="text-xl font-bold text-foreground flex items-center gap-2">
                589 mil. €
                <span className="text-accent text-sm flex items-center">
                  <ArrowUp className="w-3 h-3" /> rast
                </span>
              </div>
              <SparklineChart values={[40, 60, 50, 80, 100]} color="blue" />
            </div>
            <div>
              <div className="text-lg font-semibold text-silver flex items-center gap-2">
                Zisk: 85 mil. €
                <span className="text-accent text-xs flex items-center">
                  <ArrowUp className="w-3 h-3" /> rast
                </span>
              </div>
              <SparklineChart values={[30, 50, 70, 60, 90]} color="red" />
            </div>
          </div>
        </div>

        {/* Executives */}
        <div>
          <h4 className="text-sm text-muted-foreground uppercase mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            Štatutárny orgán
          </h4>
          <ul>
            {executives.map((name) => (
              <li key={name} className="executive-item text-silver font-medium">
                {name}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Corner Button */}
      <a
        href="#"
        className="absolute bottom-0 right-0 bg-border/50 hover:bg-primary px-4 py-3 text-xs text-foreground rounded-tl-xl transition-colors flex items-center gap-2"
      >
        Zobraziť úplný profil & vzťahy
        <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
};

export default DataCardPreview;
