// import { LogIngestion } from "@/types/security";
// import { MetricCard } from "@/components/shared/MetricCard";
// import { Activity, TrendingUp } from "lucide-react";
// import { cn } from "@/lib/utils";

// interface LogIngestionPanelProps {
//   data: LogIngestion;
// }

// export function LogIngestionPanel({ data }: LogIngestionPanelProps) {
//   const statusConfig = {
//     healthy: {
//       label: "Healthy",
//       className: "bg-severity-low text-white",
//       dotClass: "bg-severity-low",
//     },
//     warning: {
//       label: "Warning",
//       className: "bg-severity-medium text-black",
//       dotClass: "bg-severity-medium",
//     },
//     critical: {
//       label: "Critical",
//       className: "bg-severity-critical text-white",
//       dotClass: "bg-severity-critical",
//     },
//   };

//   const config = statusConfig[data.status];

//   return (
//     <MetricCard title="Top Ingest – Monitored Assets Coverage" icon={Activity} className="h-full">
//       <div className="space-y-2 overflow-auto h-full">
//         {/* Total Events Counter */}
//         <div className="text-center space-y-1">
//           <div className="text-xs text-muted-foreground">Total Events</div>
//           <div className="text-2xl font-bold text-primary tabular-nums">{data.totalEvents.toLocaleString()}</div>
//         </div>

//         {/* Events/Second Rate */}
//         <div className="flex items-center justify-between p-2 rounded-lg bg-card/50 border border-border">
//           <div className="flex items-center gap-2">
//             <TrendingUp className="h-4 w-4 text-primary" />
//             <span className="text-xs font-medium">Events/Second</span>
//           </div>
//           <span className="text-xl font-bold text-foreground tabular-nums">{data.eventsPerSecond}</span>
//         </div>

//         {/* Status Indicator */}
//         <div className="flex items-center justify-between p-2 rounded-lg bg-card/50 border border-border">
//           <span className="text-xs font-medium">Connection Status</span>
//           <div className="flex items-center gap-2">
//             <div className={cn("h-1.5 w-1.5 rounded-full animate-pulse", config.dotClass)} />
//             <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", config.className)}>
//               {config.label}
//             </span>
//           </div>
//         </div>

//         {/* Trend Sparkline */}
//         <div className="space-y-1">
//           <div className="text-xs font-medium">Last 1 Hour</div>
//           <div className="h-12 flex items-end gap-0.5">
//             {data.trendData.map((value, index) => {
//               const maxValue = Math.max(...data.trendData);
//               const height = (value / maxValue) * 100;

//               return (
//                 <div
//                   key={index}
//                   className={cn(
//                     "flex-1 rounded-t transition-all",
//                     value > 500 ? "bg-severity-critical" : value > 300 ? "bg-severity-high" : "bg-primary",
//                   )}
//                   style={{ height: `${height}%` }}
//                   title={`${value} events/sec`}
//                 />
//               );
//             })}
//           </div>
//         </div>

//         {/* Last Update */}
//         <div className="text-[10px] text-muted-foreground text-center flex-shrink-0">
//           Last updated: {data.lastUpdate.toLocaleTimeString()}
//         </div>
//       </div>
//     </MetricCard>
//   );
// }
import { useNavigate } from "react-router-dom";
import { LogIngestion } from "@/types/security";
import { MetricCard } from "@/components/shared/MetricCard";
import { Activity, TrendingUp } from "lucide-react";
import { navigateToSearchWithEventType } from "@/utils/navigation";
import { cn } from "@/lib/utils";

interface LogIngestionPanelProps {
  data: LogIngestion;
}

export function LogIngestionPanel({ data }: LogIngestionPanelProps) {
    const navigate = useNavigate();
    const statusConfig = {
        // ... (Konfigurasi statusConfig tetap sama)
        healthy: {
            label: "Healthy",
            className: "bg-severity-low text-white",
            dotClass: "bg-severity-low",
        },
        warning: {
            label: "Warning",
            className: "bg-severity-medium text-black",
            dotClass: "bg-severity-medium",
        },
        critical: {
            label: "Critical",
            className: "bg-severity-critical text-white",
            dotClass: "bg-severity-critical",
        },
    };

    const config = statusConfig[data.status];

    // 🆕 Mapping Event Type berdasarkan POSISI di array data.trendData (yang diisi di useRealtimeData.ts)
    // Urutan: Index 0=Suricata, 1=Sophos, 2=Panw
    const eventTypeMap = [
        { 
            label: "Suricata", 
            className: "bg-severity-critical",
            textColor: "text-white"
        },
        { 
            label: "Sophos", // Disesuaikan dengan urutan pengisian di useRealtimeData
            className: "bg-primary",
            textColor: "text-white"
        },
        { 
            label: "Panw", 
            className: "bg-severity-high",
            textColor: "text-black"
        },
    ];

    // ✅ BUAT LEGEND DINAMIS dari data.trendData dan mapping
    const trendLegend = data.trendData.map((total, index) => {
        const config = eventTypeMap[index] || { label: `Unknown ${index}`, className: "bg-gray-400", textColor: "text-white" };
        return { 
            label: `${config.label}: ${total.toLocaleString()}`, // Contoh: Suricata: 0
            judul: config.label,
            className: config.className,
            textColor: config.textColor
        };
    });
    
    // ✅ HITUNG TOTAL MAKSIMUM untuk scaling 3 Bar
    const maxIngestionCount = Math.max(0, ...data.trendData);
    const scaleMax = maxIngestionCount > 0 ? maxIngestionCount : 1; 

    const handleStageClick = (stageId: string) => {
        navigate(navigateToSearchWithEventType(stageId as any));
      };


    return (
        <MetricCard title="Top Ingest – Monitored Assets Coverage" icon={Activity} className="h-full">
            {/* 🛑 INI ADALAH DIV UTAMA PEMBUNGKUS YANG PENTING */}
            <div className="space-y-2 overflow-auto h-full"> 
                
                {/* 1. Total Events Counter (Bagian yang hilang) */}
                <div className="text-center space-y-1">
                    <div className="text-xs text-muted-foreground">Total Events</div>
                    <div className="text-2xl font-bold text-primary tabular-nums">{data.totalEvents.toLocaleString()}</div>
                </div>

                {/* 2. Events/Second Rate (Bagian yang hilang) */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-card/50 border border-border">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <span className="text-xs font-medium">Events/Second (Today Only)</span>
                    </div>
                    <span className="text-xl font-bold text-foreground tabular-nums">{data.eventsPerSecond}</span>
                </div>

                {/* 3. Status Indicator */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-card/50 border border-border">
                    <span className="text-xs font-medium">Connection Status</span>
                    <div className="flex items-center gap-2">
                        <div className={cn("h-1.5 w-1.5 rounded-full animate-pulse", config.dotClass)} />
                        <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", config.className)}>
                            {config.label}
                        </span>
                    </div>
                </div>

                {/* 4. Trend Sparkline -> DIUBAH MENJADI 3 BAR COUNT */}
                <div className="space-y-1">
  <div className="h-28 flex items-end justify-around gap-4">
    {data.trendData.map((value, index) => {
      const config = eventTypeMap[index];
      if (!config) return null;

      let height = (value / scaleMax) * 100;
      height = value > 0 && height < 5 ? 5 : height;

      return (
        <div
          key={index}
          className="flex flex-col items-center justify-end flex-1 min-w-[70px]"
        >
          {/* COUNT */}
          <div className="text-[10px] text-muted-foreground mb-1 font-semibold tabular-nums">
            {value.toLocaleString()}
          </div>

          {/* BAR AREA (INI KUNCINYA) */}
          <div className="relative h-16 w-full flex items-end justify-center">
            <div
              className={cn(
                "w-full max-w-[30px] rounded-t transition-all duration-300 ease-in-out",
                config.className
              )}
              style={{ height: `${Math.min(height, 100)}%` }}
              title={`${config.label}: ${value.toLocaleString()} events`}
            />
          </div>

          {/* LABEL */}
          <div className="text-[10px] font-medium text-center mt-1 whitespace-nowrap">
            {config.label.toUpperCase()}
          </div>
        </div>
      );
    })}
  </div>
</div>

                {/* 5. Last Update */}
                <div className="text-[10px] text-muted-foreground text-center flex-shrink-0">
                    Last updated: {data.lastUpdate.toLocaleTimeString()}
                </div>

                {/* 6. Legend Kritisitas Trend -> DIUBAH MENJADI LEGEND COUNT SUMBER */}
                <div className="pt-3 border-t border-border mt-3">
                    <div className="text-xs font-medium mb-2 text-center text-muted-foreground">Ingestion Summary</div>
                    <div className="flex flex-wrap justify-center gap-2">
                        {trendLegend.map((item) => (
                            <button 
                                key={item.label} 
                                onClick={() => handleStageClick(item.judul)}
                                className={cn(
                                    "flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold",
                                    item.className,
                                    item.textColor
                                )}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </MetricCard>
    );
}