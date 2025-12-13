import { Building2, UserPlus, MapPin } from "lucide-react";
import StatsCard from "./StatsCard";

const changes = [
  { type: "location", text: "Zmena sídla: Firma X", icon: MapPin },
  { type: "executive", text: "Nový konateľ: Firma Y", icon: UserPlus },
  { type: "company", text: "Nový subjekt: Firma Z", icon: Building2 },
];

const WatchedCompanies = () => {
  return (
    <StatsCard title="Moje Sledované Firmy" glowColor="accent">
      <p className="text-4xl font-bold text-foreground mb-4">42</p>
      
      <div className="space-y-2">
        {changes.map((change, index) => (
          <div
            key={index}
            className="flex items-center gap-2 text-xs text-muted-foreground"
          >
            <change.icon className="h-3 w-3 text-accent" />
            <span>{change.text}</span>
          </div>
        ))}
      </div>
    </StatsCard>
  );
};

export default WatchedCompanies;
