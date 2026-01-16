interface ComplianceProgressProps {
  percentage: number;
  size?: number;
}

export function ComplianceProgress({ percentage, size = 120 }: ComplianceProgressProps) {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const getColor = () => {
    if (percentage >= 80) return "stroke-primary";
    if (percentage >= 50) return "stroke-accent";
    return "stroke-destructive";
  };

  const getTextColor = () => {
    if (percentage >= 80) return "text-primary";
    if (percentage >= 50) return "text-accent";
    return "text-destructive";
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-muted"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={`${getColor()} transition-all duration-1000 ease-out`}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
          }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`text-3xl font-display font-bold ${getTextColor()}`}>
          {percentage}%
        </span>
        <span className="text-xs text-muted-foreground">Health</span>
      </div>
    </div>
  );
}
