interface DeadlineProgressProps {
  daysLeft: number;
  maxDays?: number;
  size?: number;
}

export function DeadlineProgress({ daysLeft, maxDays = 30, size = 100 }: DeadlineProgressProps) {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  
  // Calculate progress: days left / max days, but capped at 100%
  const percentage = Math.min((daysLeft / maxDays) * 100, 100);
  const offset = circumference - (percentage / 100) * circumference;

  const getColor = () => {
    if (daysLeft <= 3) return "stroke-destructive";
    if (daysLeft <= 7) return "stroke-accent";
    return "stroke-primary";
  };

  const getTextColor = () => {
    if (daysLeft <= 3) return "text-destructive";
    if (daysLeft <= 7) return "text-accent";
    return "text-primary";
  };

  const getSeverityLabel = () => {
    if (daysLeft <= 3) return "Urgent";
    if (daysLeft <= 7) return "Soon";
    return "Safe";
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
        <span className={`text-2xl font-display font-bold ${getTextColor()}`}>
          {daysLeft}
        </span>
        <span className="text-xs text-muted-foreground">days</span>
      </div>
    </div>
  );
}
