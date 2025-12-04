import { ApplicationUsage } from "@/types/security";
import { MetricCard } from "@/components/shared/MetricCard";
import { BarChart3 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ApplicationsPanelProps {
  applications: ApplicationUsage[];
}

export function ApplicationsPanel({ applications }: ApplicationsPanelProps) {
  return (
    <MetricCard title="Top 5 Applications" icon={BarChart3}>
      <div className="space-y-4">
        {applications.map((app, index) => (
          <div key={app.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-primary">#{index + 1}</span>
                <span className="font-semibold text-foreground">{app.name}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-foreground">{app.eventCount}</span>
                <span className="text-xs text-muted-foreground">events</span>
              </div>
            </div>
            <Progress value={app.percentage} className="h-2" />
            <div className="text-xs text-muted-foreground text-right">
              {app.percentage}% of total
            </div>
          </div>
        ))}
      </div>
    </MetricCard>
  );
}
