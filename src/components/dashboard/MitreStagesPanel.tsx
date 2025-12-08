import { useNavigate } from "react-router-dom";
import { MitreStage } from "@/types/security";
import { MetricCard } from "@/components/shared/MetricCard";
import { Shield } from "lucide-react";
import { navigateToSearchWithMitreStage } from "@/utils/navigation";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface MitreStagesPanelProps {
  stages: MitreStage[];
}

export function MitreStagesPanel({ stages }: MitreStagesPanelProps) {
  const navigate = useNavigate();
  const totalEvents = stages.reduce((sum, stage) => sum + stage.count, 0);
  const maxCount = Math.max(...stages.map((s) => s.count));

  const severityStyles = {
    low: "border-severity-low/50 bg-severity-low/5 hover:border-severity-low",
    medium: "border-severity-medium/50 bg-severity-medium/5 hover:border-severity-medium",
    high: "border-severity-high/50 bg-severity-high/5 hover:border-severity-high",
    critical: "border-severity-critical/50 bg-severity-critical/5 hover:border-severity-critical",
  };

  const severityProgressStyles = {
    low: "[&>div]:bg-severity-low",
    medium: "[&>div]:bg-severity-medium",
    high: "[&>div]:bg-severity-high",
    critical: "[&>div]:bg-severity-critical",
  };

  const handleStageClick = (stageId: string) => {
    navigate(navigateToSearchWithMitreStage(stageId as any));
  };

  return (
    <MetricCard title="MITRE ATT&CK" icon={Shield} className="h-full">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2 overflow-auto h-full">
        {stages.map((stage) => {
          const isHighest = stage.count === maxCount;

          return (
            <button
              key={stage.id}
              onClick={() => handleStageClick(stage.name)}
              className={cn(
                "p-2 rounded-lg border transition-all text-left group",
                "hover:shadow-lg hover:scale-105",
                severityStyles[stage.severity],
                isHighest && "shadow-md",
              )}
            >
              <div className="space-y-1.5">
                {/* Stage Name */}
                <h3
                  className={cn(
                    "font-semibold text-[11px] group-hover:text-primary transition-colors",
                    isHighest && "text-primary",
                  )}
                >
                  {stage.name}
                </h3>

                {/* Description */}
                <p className="text-[9px] text-muted-foreground line-clamp-1">{stage.description}</p>

                {/* Count Fraction */}
                <div className="flex items-baseline gap-1">
                  <span className={cn("text-lg font-bold", isHighest ? "text-primary" : "text-foreground")}>
                    {stage.count}
                  </span>
                  {/* <span className="text-[10px] text-muted-foreground">/ {totalEvents}</span> */}
                </div>

                {/* Progress Bar */}
                <div className="space-y-0.5">
                  <Progress value={Math.round(stage.count / maxCount * 100)} className={cn("h-1", severityProgressStyles[stage.severity])} />
                  {/* <div className="text-[9px] text-muted-foreground">{Math.round(stage.percentage)}%</div> */}
                  <div className="text-[9px] text-muted-foreground">{
    (maxCount && stage.count)
      ? `${Math.round(stage.count / maxCount * 100)}%`
      : '0%'
  }</div>
                </div>

                {/* Techniques */}
                <div className="flex flex-wrap gap-1">
                  {stage.techniques.slice(0, 2).map((technique) => (
                    <span
                      key={technique}
                      className="text-[9px] px-1 py-0.5 rounded bg-muted text-muted-foreground font-mono"
                    >
                      {technique}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </MetricCard>
  );
}

// import { useNavigate } from "react-router-dom";
// import { MitreStage } from "@/types/security";
// import { MetricCard } from "@/components/shared/MetricCard";
// import { Shield } from "lucide-react";
// import { navigateToSearchWithMitreStage } from "@/utils/navigation";
// import { Progress } from "@/components/ui/progress";
// import { cn } from "@/lib/utils";

// interface MitreStagesPanelProps {
//   // Ubah tipe prop menjadi opsional/null agar lebih aman
//   stages?: MitreStage[] | null;
// }

// export function MitreStagesPanel({ stages }: MitreStagesPanelProps) {
//   const navigate = useNavigate();

//   // 1. SAFEGUARD ARRAY UTAMA: Pastikan stages selalu array
//   const safeStages = stages || []; 

//   // 2. Gunakan safeStages untuk perhitungan (menghindari error saat stages undefined)
//   const totalEvents = safeStages.reduce((sum, stage) => sum + stage.count, 0); 
//   const maxCount = safeStages.length > 0 
//     ? Math.max(...safeStages.map((s) => s.count)) 
//     : 0; 
  
//   const severityStyles = {
//     low: "border-severity-low/50 bg-severity-low/5 hover:border-severity-low",
//     medium: "border-severity-medium/50 bg-severity-medium/5 hover:border-severity-medium",
//     high: "border-severity-high/50 bg-severity-high/5 hover:border-severity-high",
//     critical: "border-severity-critical/50 bg-severity-critical/5 hover:border-severity-critical",
//   };

//   const severityProgressStyles = {
//     low: "[&>div]:bg-severity-low",
//     medium: "[&>div]:bg-severity-medium",
//     high: "[&>div]:bg-severity-high",
//     critical: "[&>div]:bg-severity-critical",
//   };

//   const handleStageClick = (stageId: string) => {
//     navigate(navigateToSearchWithMitreStage(stageId as any));
//   };
  
//   // Tambahkan kondisi jika tidak ada data untuk UX yang lebih baik
//   if (safeStages.length === 0) {
//     return (
//       <MetricCard title="MITRE ATT&CK" icon={Shield} className="h-full">
//         <div className="flex items-center justify-center h-full text-muted-foreground">
//           No MITRE stages data available for this timeframe.
//         </div>
//       </MetricCard>
//     );
//   }

//   return (
//     <MetricCard title="MITRE ATT&CK" icon={Shield} className="h-full">
//       <div className="grid grid-cols-1 md:grid-cols-5 gap-2 overflow-auto h-full">
//         {safeStages.map((stage) => { // Menggunakan safeStages
//           const isHighest = stage.count === maxCount;

//           return (
//             <button
//               key={stage.id}
//               onClick={() => handleStageClick(stage.id)}
//               className={cn(
//                 "p-2 rounded-lg border transition-all text-left group",
//                 "hover:shadow-lg hover:scale-105",
//                 severityStyles[stage.severity],
//                 isHighest && "shadow-md",
//               )}
//             >
//               <div className="space-y-1.5">
//                 {/* Stage Name */}
//                 <h3
//                   className={cn(
//                     "font-semibold text-[11px] group-hover:text-primary transition-colors",
//                     isHighest && "text-primary",
//                   )}
//                 >
//                   {stage.name}
//                 </h3>

//                 {/* Description */}
//                 <p className="text-[9px] text-muted-foreground line-clamp-1">{stage.description}</p>

//                 {/* Count Fraction */}
//                 <div className="flex items-baseline gap-1">
//                   <span className={cn("text-lg font-bold", isHighest ? "text-primary" : "text-foreground")}>
//                     {stage.count}
//                   </span>
//                   <span className="text-[10px] text-muted-foreground">/ {totalEvents}</span>
//                 </div>

//                 {/* Progress Bar */}
//                 <div className="space-y-0.5">
//                   <Progress value={stage.percentage} className={cn("h-1", severityProgressStyles[stage.severity])} />
//                   <div className="text-[9px] text-muted-foreground">{stage.percentage}%</div>
//                 </div>

//                 {/* Techniques */}
//                 <div className="flex flex-wrap gap-1">
//                   {/* 3. SAFEGUARD BARIS 83: Tambahkan operator '|| []' untuk memastikan techniques adalah array */}
//                   {(stage.techniques || []).slice(0, 2).map((technique) => (
//                     <span
//                       key={technique}
//                       className="text-[9px] px-1 py-0.5 rounded bg-muted text-muted-foreground font-mono"
//                     >
//                       {technique}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             </button>
//           );
//         })}
//       </div>
//     </MetricCard>
//   );
// }