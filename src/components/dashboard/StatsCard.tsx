import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  children: ReactNode;
  className?: string;
  glowColor?: "primary" | "secondary" | "accent";
}

const StatsCard = ({ title, children, className, glowColor = "primary" }: StatsCardProps) => {
  const glowClasses = {
    primary: "border-t-primary/50",
    secondary: "border-t-secondary/50",
    accent: "border-t-accent/50",
  };

  return (
    <div
      className={cn(
        "glass rounded-xl p-5 border-t-2 relative overflow-hidden",
        glowClasses[glowColor],
        className
      )}
    >
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
        {title}
      </h3>
      {children}
    </div>
  );
};

export default StatsCard;
