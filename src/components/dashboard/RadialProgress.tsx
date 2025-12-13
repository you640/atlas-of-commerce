interface RadialProgressProps {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
}

const RadialProgress = ({
  value,
  max,
  size = 120,
  strokeWidth = 12,
  showLabel = true,
}: RadialProgressProps) => {
  const percentage = Math.min((value / max) * 100, 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  // Color based on percentage
  const getColor = () => {
    if (percentage >= 80) return "hsl(var(--secondary))";
    if (percentage >= 60) return "hsl(45 100% 50%)"; // Warning yellow
    return "hsl(var(--primary))";
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor()}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-500"
          style={{
            filter: `drop-shadow(0 0 8px ${getColor()})`,
          }}
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-foreground">{Math.round(percentage)}%</span>
        </div>
      )}
    </div>
  );
};

export default RadialProgress;
