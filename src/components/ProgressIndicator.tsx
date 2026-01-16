interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i + 1 <= currentStep
              ? "bg-primary w-8"
              : "bg-muted w-4"
          }`}
        />
      ))}
      <span className="ml-2 text-sm text-muted-foreground">
        Step {currentStep} of {totalSteps}
      </span>
    </div>
  );
}
