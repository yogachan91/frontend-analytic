import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { GlobeMap } from "@/components/maps/GlobeMap";
import { TopIPsPanel } from "@/components/dashboard/TopIPsPanel";
import { MitreStagesPanel } from "@/components/dashboard/MitreStagesPanel";
import { LogIngestionPanel } from "@/components/dashboard/LogIngestionPanel";
import { EventsTimelineChart } from "@/components/dashboard/EventsTimelineChart";
import { useTimeframe } from "@/hooks/useTimeframe";
import { useRealtimeData } from "@/hooks/useRealtimeData";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { timeframe, isRealtime, setTimeframe } = useTimeframe();
  const { geoAttacks, ipThreats, mitreStages, logIngestion, timeline, connectionStatus, lastUpdate, isLoading } = useRealtimeData(isRealtime, timeframe);

  return (
    <DashboardLayout
      timeframe={timeframe}
      onTimeframeChange={setTimeframe}
      isRealtime={isRealtime}
      connectionStatus={connectionStatus}
      lastUpdate={lastUpdate}
    >
      <div className="relative h-[calc(100vh-80px)]">
        {/* ANIMASI LOADING OVERLAY */}
        {isLoading && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] transition-all">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-2xl flex flex-col items-center">
              <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
              <p className="mt-4 text-white font-semibold tracking-wide">Updating Timeframe...</p>
            </div>
          </div>
        )}
      
      
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
    </div>  
    </DashboardLayout>
  );
};

export default Index;
