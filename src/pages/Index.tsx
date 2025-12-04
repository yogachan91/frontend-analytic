import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { GlobeMap } from "@/components/dashboard/GlobeMap";
import { TopIPsPanel } from "@/components/dashboard/TopIPsPanel";
import { MitreStagesPanel } from "@/components/dashboard/MitreStagesPanel";
import { LogIngestionPanel } from "@/components/dashboard/LogIngestionPanel";
import { EventsTimelineChart } from "@/components/dashboard/EventsTimelineChart";
import { useTimeframe } from "@/hooks/useTimeframe";
import { useRealtimeData } from "@/hooks/useRealtimeData";

const Index = () => {
  const { timeframe, isRealtime, setTimeframe } = useTimeframe();
  const { geoAttacks, ipThreats, mitreStages, logIngestion, timeline, connectionStatus, lastUpdate } = useRealtimeData(isRealtime, timeframe);

  return (
    <DashboardLayout
      timeframe={timeframe}
      onTimeframeChange={setTimeframe}
      isRealtime={isRealtime}
      connectionStatus={connectionStatus}
      lastUpdate={lastUpdate}
    >
      <div className="grid gap-1 h-[calc(100vh-80px)]" style={{ gridTemplateColumns: 'minmax(280px, 1fr) 2fr minmax(280px, 1fr)' }}>
        {/* Left Column: Top 3 IPs */}
        <div className="h-full">
          <TopIPsPanel threats={ipThreats} />
        </div>
        
        {/* Center Column: Globe Map (65%) + MITRE (35%) */}
        <div className="h-full flex flex-col gap-1">
          <div className="h-[65%]">
            <GlobeMap attacks={geoAttacks} />
          </div>
          <div className="h-[35%]">
            <MitreStagesPanel stages={mitreStages} />
          </div>
        </div>
        
        {/* Right Column: Log Ingestion (50%) + Timeline (50%) */}
        <div className="h-full flex flex-col gap-1">
          <div className="h-[50%]">
            <LogIngestionPanel data={logIngestion} />
          </div>
          <div className="h-[50%]">
            <EventsTimelineChart timeline={timeline} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
