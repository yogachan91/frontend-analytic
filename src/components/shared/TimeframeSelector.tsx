import { Button } from "@/components/ui/button";
import { TimeframeType } from "@/types/security";
import { cn } from "@/lib/utils";

interface TimeframeSelectorProps {
  value: TimeframeType;
  onChange: (value: TimeframeType) => void;
  className?: string;
}

const timeframes: { value: TimeframeType; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "lastDay", label: "Last Day" },
  { value: "lastWeek", label: "Last Week" },
  { value: "lastMonth", label: "Last Month" },
];

export function TimeframeSelector({ value, onChange, className }: TimeframeSelectorProps) {
  return (
    <div className={cn("flex gap-2", className)}>
      {timeframes.map((timeframe) => (
        <Button
          key={timeframe.value}
          variant={value === timeframe.value ? "default" : "outline"}
          size="sm"
          onClick={() => onChange(timeframe.value)}
          className={cn(
            "transition-all",
            value === timeframe.value && "shadow-lg"
          )}
        >
          {timeframe.label}
        </Button>
      ))}
    </div>
  );
}
