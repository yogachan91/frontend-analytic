import { MetricCard } from "@/components/shared/MetricCard";
import { TimelineDataPoint } from "@/types/security";
import { Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { format } from "date-fns";

interface EventsTimelineChartProps {
  timeline: TimelineDataPoint[];
}

export function EventsTimelineChart({ timeline }: EventsTimelineChartProps) {
  // Format data for chart
  const chartData = timeline.map((point) => ({
    time: format(point.timestamp, "HH:mm"),
    fullTime: format(point.timestamp, "MMM dd, HH:mm"),
    count: point.attackCount,
    severity: point.severity,
  }));

  // Calculate threshold for burst detection (e.g., 70th percentile)
  const sortedCounts = [...timeline.map((p) => p.attackCount)].sort((a, b) => a - b);
  const burstThreshold = sortedCounts[Math.floor(sortedCounts.length * 0.7)];

  // Get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "hsl(var(--severity-critical))";
      case "high":
        return "hsl(var(--severity-high))";
      case "medium":
        return "hsl(var(--severity-medium))";
      case "low":
        return "hsl(var(--severity-low))";
      default:
        return "hsl(var(--primary))";
    }
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isBurst = data.count > burstThreshold;

      return (
        <div className="bg-card border border-border rounded-md p-2 shadow-lg">
          <p className="text-xs font-semibold text-foreground">{data.fullTime}</p>
          <p className="text-xs text-muted-foreground">
            Events: <span className="font-bold text-foreground">{data.count}</span>
          </p>
          {isBurst && <p className="text-xs font-semibold text-severity-high mt-1">⚠ Burst Detected</p>}
        </div>
      );
    }
    return null;
  };

  return (
    <MetricCard title="Offense Trend" icon={Activity}>
      <div className="h-full flex flex-col">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 2, right: 2, left: -25, bottom: 2 }}>
            <defs>
              <linearGradient id="eventGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="fullTime"
              tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
              axisLine={{ stroke: "hsl(var(--border))" }}
              interval={Math.floor(chartData.length / 4)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="count"
              stroke="hsl(var(--primary))"
              strokeWidth={1}
              fill="url(#eventGradient)"
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </MetricCard>
  );
}
