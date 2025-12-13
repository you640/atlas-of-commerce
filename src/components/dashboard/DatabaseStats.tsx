import { Area, AreaChart, ResponsiveContainer } from "recharts";
import StatsCard from "./StatsCard";

const data = [
  { value: 400000 },
  { value: 420000 },
  { value: 450000 },
  { value: 480000 },
  { value: 510000 },
  { value: 530000 },
  { value: 540000 },
];

const DatabaseStats = () => {
  return (
    <StatsCard title="Databáza Firiem" glowColor="primary">
      <div className="relative">
        <p className="text-4xl font-bold text-foreground mb-1">540,000+</p>
        <p className="text-sm text-muted-foreground">Aktívnych subjektov v SR</p>
        
        {/* Background Chart */}
        <div className="absolute inset-0 top-8 opacity-30 pointer-events-none">
          <ResponsiveContainer width="100%" height={60}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                fill="url(#colorValue)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </StatsCard>
  );
};

export default DatabaseStats;
