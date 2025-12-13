import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import StatsCard from "./StatsCard";

const data = [
  { day: "1", calls: 4200 },
  { day: "5", calls: 5800 },
  { day: "10", calls: 4900 },
  { day: "15", calls: 6200 },
  { day: "20", calls: 5100 },
  { day: "25", calls: 7800 },
  { day: "30", calls: 6500 },
];

const UsageChart = () => {
  return (
    <StatsCard title="Štatistika Využitia API" glowColor="primary">
      <div className="h-40 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.6} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                color: "hsl(var(--foreground))",
              }}
              formatter={(value) => [`${value} volaní`, "API"]}
              labelFormatter={(label) => `Deň ${label}`}
            />
            <Area
              type="monotone"
              dataKey="calls"
              stroke="hsl(var(--primary))"
              fill="url(#colorCalls)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-lg font-bold text-foreground">154,200</p>
          <p className="text-xs text-muted-foreground">Celkom volaní</p>
        </div>
        <div>
          <p className="text-lg font-bold text-accent">120ms</p>
          <p className="text-xs text-muted-foreground">Priem. odozva</p>
        </div>
        <div>
          <p className="text-lg font-bold text-accent">0.01%</p>
          <p className="text-xs text-muted-foreground">Chybovosť</p>
        </div>
      </div>
    </StatsCard>
  );
};

export default UsageChart;
