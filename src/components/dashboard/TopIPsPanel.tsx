import { useNavigate } from "react-router-dom";
import { IPThreat } from "@/types/security";
import { MetricCard } from "@/components/shared/MetricCard";
import { SeverityBadge } from "@/components/shared/SeverityBadge";
import { AlertTriangle } from "lucide-react";
import { navigateToSearchWithIP } from "@/utils/navigation";
import { Progress } from "@/components/ui/progress";

interface TopIPsPanelProps {
  threats: IPThreat[];
}

export function TopIPsPanel({ threats }: TopIPsPanelProps) {
  const navigate = useNavigate();

  const handleIPClick = (ip: string) => {
    navigate(navigateToSearchWithIP(ip));
  };

  const criticalHighThreats = threats.filter((threat) => threat.severity === "medium" || threat.severity === "low");

  return (
    <MetricCard title="Top 5 Critical Threats" icon={AlertTriangle} className="h-full">
      <div className="space-y-2 overflow-auto h-full">
        {criticalHighThreats.slice(0, 5).map((threat, index) => (
          <button
            key={threat.ip}
            onClick={() => handleIPClick(threat.ip)}
            className="w-full text-left p-2 rounded-lg border border-border hover:border-primary bg-card/50 hover:bg-card transition-all group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-1.5">
                {/* IP and Rank */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-primary">#{index + 1}</span>
                  <span className="font-mono text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                    {threat.ip}
                  </span>
                </div>

                {/* Severity Badge */}
                <SeverityBadge severity={threat.severity} />

                {/* Magnitude Score */}
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-muted-foreground">Magnitude</span>
                    <span className="font-semibold text-foreground">{Math.round(threat.magnitude)}/100</span>
                  </div>
                  <Progress value={threat.magnitude} className="h-1.5" />
                </div>

                {/* Event Count */}
                <div className="text-[10px] text-muted-foreground">{threat.eventCount} events</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-2 text-[10px] text-muted-foreground text-center flex-shrink-0">
        Click on any IP to view related events
      </div>
    </MetricCard>
  );
}
