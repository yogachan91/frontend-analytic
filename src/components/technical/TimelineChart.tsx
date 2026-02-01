import { TimelineDataPoint } from "@/types/security";
import { MetricCard } from "@/components/shared/MetricCard";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelineChartProps {
  timeline: TimelineDataPoint[];
}

export function TimelineChart({ timeline }: TimelineChartProps) {
  const maxCount = Math.max(...timeline.map(d => d.attackCount));

  return (
    <MetricCard title="Attack Timeline (24 Hours)" icon={Clock}>
      <div className="space-y-4">
        {/* Chart */}
        <div className="h-48 flex items-end gap-1">
          {timeline.map((point, index) => {
            const height = (point.attackCount / maxCount) * 100;
            
            return (
              <div
                key={index}
                className="flex-1 group relative"
              >
                <div
                  className={cn(
                    "w-full rounded-t transition-all cursor-pointer hover:opacity-80",
                    point.severity === "critical" && "bg-severity-critical",
                    point.severity === "high" && "bg-severity-high",
                    point.severity === "medium" && "bg-severity-medium",
                    point.severity === "low" && "bg-severity-low"
                  )}
                  style={{ height: `${height}%` }}
                />
                
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  <div className="bg-popover border border-border rounded-md p-2 shadow-lg whitespace-nowrap">
                    <div className="text-xs font-medium">
                      {point.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {point.attackCount} attacks
                    </div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {point.severity} severity
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* X-axis labels */}
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{timeline[0]?.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          <span>Now</span>
        </div>
      </div>
    </MetricCard>
  );
}
