import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ApplicationsPanel } from "@/components/technical/ApplicationsPanel";
import { TimelineChart } from "@/components/technical/TimelineChart";
import { ProtocolChart } from "@/components/technical/ProtocolChart";
import { useTimeframe } from "@/hooks/useTimeframe";
import { useRealtimeData } from "@/hooks/useRealtimeData";
import {
  generateMockApplicationUsage,
  generateMockProtocolDistribution,
  generateMockTimeline,
} from "@/utils/mockData";
import { useState, useEffect } from "react";

const TechnicalDashboard = () => {
  const { timeframe, isRealtime, setTimeframe } = useTimeframe();
  const { connectionStatus, lastUpdate } = useRealtimeData(isRealtime, timeframe);
  
  const [applications, setApplications] = useState(generateMockApplicationUsage());
  const [protocols, setProtocols] = useState(generateMockProtocolDistribution());
  const [timeline, setTimeline] = useState(generateMockTimeline(24));

  useEffect(() => {
    if (!isRealtime) return;

    const interval = setInterval(() => {
      setApplications(generateMockApplicationUsage());
      setProtocols(generateMockProtocolDistribution());
      setTimeline(generateMockTimeline(24));
    }, 3000);

    return () => clearInterval(interval);
  }, [isRealtime]);

  return (
    <DashboardLayout
      timeframe={timeframe}
      onTimeframeChange={setTimeframe}
      isRealtime={isRealtime}
      connectionStatus={connectionStatus}
      lastUpdate={lastUpdate}
    >
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-foreground">Technical Dashboard</h2>
        
        {/* Technical Panels Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-1">
          <ApplicationsPanel applications={applications} />
          <ProtocolChart protocols={protocols} />
        </div>

        {/* Full Width Timeline */}
        <TimelineChart timeline={timeline} />
      </div>
    </DashboardLayout>
  );
};

export default TechnicalDashboard;
