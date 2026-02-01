import { ProtocolDistribution } from "@/types/security";
import { MetricCard } from "@/components/shared/MetricCard";
import { Network } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProtocolChartProps {
  protocols: ProtocolDistribution[];
}

const chartColors = [
  "bg-chart-1",
  "bg-chart-2",
  "bg-chart-3",
  "bg-chart-4",
  "bg-chart-5",
];

export function ProtocolChart({ protocols }: ProtocolChartProps) {
  const total = protocols.reduce((sum, p) => sum + p.count, 0);

  return (
    <MetricCard title="Protocol Distribution" icon={Network}>
      <div className="space-y-6">
        {/* Pie Chart (simplified as bars) */}
        <div className="flex h-8 rounded-lg overflow-hidden">
          {protocols.map((protocol, index) => (
            <div
              key={protocol.protocol}
              className={cn(
                "transition-all hover:opacity-80",
                chartColors[index % chartColors.length]
              )}
              style={{ width: `${protocol.percentage}%` }}
              title={`${protocol.protocol}: ${protocol.percentage}%`}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-3">
          {protocols.map((protocol, index) => (
            <div key={protocol.protocol} className="flex items-center gap-2">
              <div
                className={cn(
                  "h-3 w-3 rounded-sm",
                  chartColors[index % chartColors.length]
                )}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-sm truncate">{protocol.protocol}</span>
                  <span className="text-xs text-muted-foreground">{protocol.percentage}%</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {protocol.count.toLocaleString()} events
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MetricCard>
  );
}
