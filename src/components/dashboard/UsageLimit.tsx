import StatsCard from "./StatsCard";
import RadialProgress from "./RadialProgress";

const UsageLimit = () => {
  const used = 425;
  const total = 500;

  return (
    <StatsCard title="Využitie Limitu Dnes" glowColor="secondary">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold text-foreground">
            {used}/{total}
          </p>
          <p className="text-sm text-muted-foreground">dopytov</p>
        </div>
        <RadialProgress value={used} max={total} size={100} strokeWidth={10} />
      </div>
    </StatsCard>
  );
};

export default UsageLimit;
