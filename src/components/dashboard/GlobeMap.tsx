// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { GeoAttack } from "@/types/security";
// import { MetricCard } from "@/components/shared/MetricCard";
// import { Globe } from "lucide-react";
// import { navigateToSearchWithCountry } from "@/utils/navigation";
// import { cn } from "@/lib/utils";
// import worldMapImage from "@/assets/world-map-dark.png";

// interface GlobeMapProps {
//   attacks: GeoAttack[];
// }

// // Convert lat/lng to SVG coordinates (simplified Mercator projection)
// const coordsToSVG = (coords: [number, number]): [number, number] => {
//   const [lng, lat] = coords;
//   // Map longitude (-180 to 180) to SVG x (0 to 900)
//   const x = ((lng + 180) / 360) * 900;
//   // Map latitude (90 to -90) to SVG y (0 to 350) with Mercator-like distortion
//   const y = ((90 - lat) / 180) * 350;
//   return [x, y];
// };

// export function GlobeMap({ attacks }: GlobeMapProps) {
//   const navigate = useNavigate();
//   const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

//   // Get unique countries with their total attack counts
//   const countryStats = attacks.reduce((acc, attack) => {
//     if (!acc[attack.sourceCountry]) {
//       acc[attack.sourceCountry] = {
//         count: 0,
//         severity: attack.severity,
//         coords: attack.sourceCoords,
//       };
//     }
//     acc[attack.sourceCountry].count += attack.attackCount;
    
//     return acc;
//   }, {} as Record<string, { count: number; severity: string; coords: [number, number] }>);

//   const handleCountryClick = (country: string) => {
//     navigate(navigateToSearchWithCountry(country));
//   };

//   // Generate animated pulse paths
//   const pulseLines = attacks.slice(0, 8).map((attack, index) => {
//     const [x1, y1] = coordsToSVG(attack.sourceCoords);
//     const [x2, y2] = coordsToSVG(attack.destinationCoords);
    
//     // Create curved path using quadratic bezier
//     const midX = (x1 + x2) / 2;
//     const midY = Math.min(y1, y2) - 50; // Arc upward
//     const path = `M ${x1},${y1} Q ${midX},${midY} ${x2},${y2}`;
    
//     return {
//       path,
//       severity: attack.severity,
//       index,
//       sourceCoords: [x1, y1] as [number, number],
//       destCoords: [x2, y2] as [number, number],
//     };
//   });

//   const getSeverityColor = (severity: string) => {
//     switch (severity) {
//       case "critical": return "hsl(var(--severity-critical))";
//       case "high": return "hsl(var(--severity-high))";
//       case "medium": return "hsl(var(--severity-medium))";
//       case "low": return "hsl(var(--severity-low))";
//       default: return "hsl(var(--muted-foreground))";
//     }
//   };

//   return (
//     <MetricCard title="Global Attack Map" icon={Globe} className="h-full">
//       <div className="relative h-full bg-background rounded-lg border border-border overflow-hidden min-h-0">
//         {/* Background World Map Image */}
//         <div className="absolute inset-0">
//           <img 
//             src={worldMapImage} 
//             alt="World Map" 
//             className="w-full h-full object-cover opacity-60"
//             style={{ objectPosition: 'center' }}
//           />
//           {/* Dark overlay for better contrast */}
//           <div className="absolute inset-0 bg-gradient-to-br from-background/40 via-background/30 to-primary/10" />
//         </div>

//         {/* Animated Pulse Lines */}
//         <svg className="absolute inset-0 pointer-events-none" viewBox="0 0 900 350">
//           <defs>
//             <filter id="line-glow">
//               <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
//               <feMerge>
//                 <feMergeNode in="coloredBlur"/>
//                 <feMergeNode in="coloredBlur"/>
//                 <feMergeNode in="SourceGraphic"/>
//               </feMerge>
//             </filter>
//           </defs>

//           {pulseLines.map((line) => {
//             const color = getSeverityColor(line.severity);
//             return (
//               <g key={line.index}>
//                 {/* Attack path line */}
//                 <path
//                   d={line.path}
//                   fill="none"
//                   stroke={color}
//                   strokeWidth="1.5"
//                   opacity="0.4"
//                   filter="url(#line-glow)"
//                 />
                
//                 {/* Animated pulse dots */}
//                 {[0, 1, 2].map((pulseIndex) => (
//                   <circle
//                     key={`${line.index}-pulse-${pulseIndex}`}
//                     r="3"
//                     fill={color}
//                     filter="url(#line-glow)"
//                     opacity="0.9"
//                   >
//                     <animateMotion
//                       dur={`${3 + line.index * 0.3}s`}
//                       repeatCount="indefinite"
//                       path={line.path}
//                       begin={`${pulseIndex * 1}s`}
//                     />
//                     <animate
//                       attributeName="r"
//                       values="2;5;2"
//                       dur="2s"
//                       repeatCount="indefinite"
//                     />
//                   </circle>
//                 ))}

//                 {/* Source marker */}
//                 <circle
//                   cx={line.sourceCoords[0]}
//                   cy={line.sourceCoords[1]}
//                   r="4"
//                   fill={color}
//                   opacity="0.8"
//                   filter="url(#line-glow)"
//                   className="animate-pulse"
//                 />

//                 {/* Destination marker */}
//                 <circle
//                   cx={line.destCoords[0]}
//                   cy={line.destCoords[1]}
//                   r="4"
//                   fill={color}
//                   opacity="0.8"
//                   filter="url(#line-glow)"
//                   className="animate-pulse"
//                   style={{ animationDelay: "0.5s" }}
//                 />
//               </g>
//             );
//           })}
//         </svg>

//         {/* Country stats overlay */}
//         <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-1.5 pointer-events-none">
//           {Object.entries(countryStats).slice(0, 6).map(([country, stats]) => (
//             <div
//               key={country}
//               className={cn(
//                 "px-2 py-0.5 rounded text-[10px] font-medium backdrop-blur-sm border",
//                 "bg-background/80",
//                 hoveredCountry === country && "ring-1 ring-primary"
//               )}
//               style={{
//                 borderColor: getSeverityColor(stats.severity),
//                 color: getSeverityColor(stats.severity),
//               }}
//             >
//               {country}: {stats.count}
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="mt-1 text-[10px] text-muted-foreground text-center">
//         Live attack visualization • Click regions for details
//       </div>
//     </MetricCard>
//   );
// }

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GeoAttack } from "@/types/security"; // Pastikan GeoAttack diimpor
import { MetricCard } from "@/components/shared/MetricCard";
import { Globe } from "lucide-react";
import { navigateToSearchWithCountry } from "@/utils/navigation";
import { cn } from "@/lib/utils";
import worldMapImage from "@/assets/world-map-dark.png";

interface GlobeMapProps {
    attacks: GeoAttack[]; // Menerima GeoAttack[] yang baru
}

// Convert lat/lng to SVG coordinates (simplified Mercator projection)
const coordsToSVG = (coords: [number, number]): [number, number] => {
    const [lng, lat] = coords;
    // Map longitude (-180 to 180) to SVG x (0 to 900)
    const x = ((lng + 180) / 360) * 900;
    // Map latitude (90 to -90) to SVG y (0 to 350) with Mercator-like distortion
    const y = ((90 - lat) / 180) * 350;
    return [x, y];
};

export function GlobeMap({ attacks }: GlobeMapProps) {
    const navigate = useNavigate();
    const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

    // Get unique countries with their total attack counts
    const countryStats = attacks.reduce((acc, attack) => {
        if (!acc[attack.sourceCountry]) {
            acc[attack.sourceCountry] = {
                count: 0,
                severity: attack.severity,
                coords: attack.sourceCoords,
            };
        }
        // Menjumlahkan attackCount (yang bernilai 1 per event)
        acc[attack.sourceCountry].count += attack.attackCount; 
        
        return acc;
    }, {} as Record<string, { count: number; severity: string; coords: [number, number] }>);

    const handleCountryClick = (country: string) => {
        navigate(navigateToSearchWithCountry(country));
    };

    // Generate animated pulse paths
    // Menggunakan seluruh data attacks (maksimal 5 dari backend)
    const pulseLines = attacks.map((attack, index) => { 
        const [x1, y1] = coordsToSVG(attack.sourceCoords);
        const [x2, y2] = coordsToSVG(attack.destinationCoords);
        
        // Create curved path using quadratic bezier
        const midX = (x1 + x2) / 2;
        const midY = Math.min(y1, y2) - 50; // Arc upward
        const path = `M ${x1},${y1} Q ${midX},${midY} ${x2},${y2}`;
        
        return {
            path,
            severity: attack.severity,
            index,
            sourceCoords: [x1, y1] as [number, number],
            destCoords: [x2, y2] as [number, number],
        };
    });

    const getSeverityColor = (severity: string) => {
        switch (severity.toLowerCase()) {
            case "critical": return "hsl(var(--severity-critical))";
            case "high": return "hsl(var(--severity-high))";
            case "medium": return "hsl(var(--severity-medium))";
            case "low": return "hsl(var(--severity-low))";
            case "informational": return "hsl(var(--severity-critical))";
            case "notice": return "hsl(var(--severity-high))";
            default: return "hsl(var(--muted-foreground))";
        }
    };

    return (
        <MetricCard title="Global Attack Map" icon={Globe} className="h-full">
            <div className="relative h-full bg-background rounded-lg border border-border overflow-hidden min-h-0">
                {/* Background World Map Image */}
                <div className="absolute inset-0">
                    <img 
                        src={worldMapImage} 
                        alt="World Map" 
                        className="w-full h-full object-cover opacity-60"
                        style={{ objectPosition: 'center' }}
                    />
                    {/* Dark overlay for better contrast */}
                    <div className="absolute inset-0 bg-gradient-to-br from-background/40 via-background/30 to-primary/10" />
                </div>

                {/* Animated Pulse Lines */}
                <svg className="absolute inset-0 pointer-events-none" viewBox="0 0 900 350">
                    <defs>
                        <filter id="line-glow">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                            <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>

                    {pulseLines.map((line) => {
                        const color = getSeverityColor(line.severity);
                        return (
                            <g key={line.index}>
                                {/* Attack path line */}
                                <path
                                    d={line.path}
                                    fill="none"
                                    stroke={color}
                                    strokeWidth="1.5"
                                    opacity="0.4"
                                    filter="url(#line-glow)"
                                />
                                
                                {/* Animated pulse dots */}
                                {[0, 1, 2].map((pulseIndex) => (
                                    <circle
                                        key={`${line.index}-pulse-${pulseIndex}`}
                                        r="3"
                                        fill={color}
                                        filter="url(#line-glow)"
                                        opacity="0.9"
                                    >
                                        <animateMotion
                                            dur={`${3 + line.index * 0.3}s`}
                                            repeatCount="indefinite"
                                            path={line.path}
                                            begin={`${pulseIndex * 1}s`}
                                        />
                                        <animate
                                            attributeName="r"
                                            values="2;5;2"
                                            dur="2s"
                                            repeatCount="indefinite"
                                        />
                                    </circle>
                                ))}

                                {/* Source marker */}
                                <circle
                                    cx={line.sourceCoords[0]}
                                    cy={line.sourceCoords[1]}
                                    r="4"
                                    fill={color}
                                    opacity="0.8"
                                    filter="url(#line-glow)"
                                    className="animate-pulse"
                                />

                                {/* Destination marker */}
                                <circle
                                    cx={line.destCoords[0]}
                                    cy={line.destCoords[1]}
                                    r="4"
                                    fill={color}
                                    opacity="0.8"
                                    filter="url(#line-glow)"
                                    className="animate-pulse"
                                    style={{ animationDelay: "0.5s" }}
                                />
                            </g>
                        );
                    })}
                </svg>

                {/* Country stats overlay */}
                <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-1.5 pointer-events-none">
                    {Object.entries(countryStats).slice(0, 6).map(([country, stats]) => (
                        <div
                            key={country}
                            className={cn(
                                "px-2 py-0.5 rounded text-[10px] font-medium backdrop-blur-sm border",
                                "bg-background/80",
                                hoveredCountry === country && "ring-1 ring-primary"
                            )}
                            style={{
                                borderColor: getSeverityColor(stats.severity),
                                color: getSeverityColor(stats.severity),
                            }}
                        >
                            {country}: {stats.count}
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-1 text-[10px] text-muted-foreground text-center">
                Live attack visualization • Click regions for details
            </div>
        </MetricCard>
    );
}
