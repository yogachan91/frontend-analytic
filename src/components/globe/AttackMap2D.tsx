// 'use client';

// import React from 'react';
// import {
//   ComposableMap,
//   Geographies,
//   Geography,
//   Line,
//   Marker,
//   ZoomableGroup // Tambahkan ini
// } from 'react-simple-maps';

// const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// export type MapAttack = {
//   startLat: number;
//   startLng: number;
//   endLat: number;
//   endLng: number;
//   severity: 'low' | 'medium' | 'high' | 'critical' | 'Information' | 'Notice';
// };

// interface AttackMap2DProps {
//   data: MapAttack[];
// }

// const severityColor: Record<string, string> = {
//   low: '#22c55e',
//   medium: '#eab308',
//   high: '#f97316',
//   critical: '#ef4444',
//   Information: '#e6ea08',
//   Notice: '#a855f7',
// };

// export default function AttackMap2D({ data }: AttackMap2DProps) {
//   return (
//     <div className="w-full h-full bg-slate-950 flex items-center justify-center cursor-move">
//       <ComposableMap
//         projectionConfig={{ scale: 140 }}
//         className="w-full h-full"
//       >
//         {/* ZoomableGroup memungkinkan interaksi mouse */}
//         <ZoomableGroup 
//           zoom={1} 
//           minZoom={1} 
//           maxZoom={8} 
//           translateExtent={[
//             [0, 0],
//             [800, 600]
//           ]}
//         >
//           <Geographies geography={geoUrl}>
//             {({ geographies }) =>
//               geographies.map((geo) => (
//                 <Geography
//                   key={geo.rsmKey}
//                   geography={geo}
//                   fill="#1e293b"
//                   stroke="#334155"
//                   strokeWidth={0.5}
//                   style={{
//                     default: { outline: "none" },
//                     hover: { fill: "#334155", outline: "none" },
//                     pressed: { fill: "#0ea5e9", outline: "none" },
//                   }}
//                 />
//               ))
//             }
//           </Geographies>

//           {/* Garis Serangan */}
//           {data.map((attack, i) => (
//             <Line
//               key={`attack-${i}`}
//               from={[attack.startLng, attack.startLat]}
//               to={[attack.endLng, attack.endLat]}
//               stroke={severityColor[attack.severity] || "#94a3b8"}
//               strokeWidth={1.5}
//               strokeLinecap="round"
//               className="animate-pulse"
//               style={{
//                 strokeDasharray: "4, 4",
//               }}
//             />
//           ))}

//           {/* Titik Koordinat */}
//           {data.flatMap((d, i) => [
//             <Marker key={`start-${i}`} coordinates={[d.startLng, d.startLat]}>
//               <circle r={1.2} fill="#fff" />
//             </Marker>,
//             <Marker key={`end-${i}`} coordinates={[d.endLng, d.endLat]}>
//               <circle r={1.8} fill={severityColor[d.severity]} />
//             </Marker>
//           ])}
//         </ZoomableGroup>
//       </ComposableMap>

//       {/* Instruksi Kecil (Optional) */}
//       <div className="absolute top-2 right-2 text-[8px] text-slate-500 pointer-events-none">
//         Scroll to zoom • Drag to pan
//       </div>
//     </div>
//   );
// }

'use client';

import React from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Line,
  Marker,
  ZoomableGroup
} from 'react-simple-maps';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export type MapAttack = {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  severity: 'low' | 'medium' | 'high' | 'critical' | 'Information' | 'Notice';
};

interface AttackMap2DProps {
  data: MapAttack[];
}

// Update mapping warna agar sesuai dengan keinginan Anda
const severityColor: Record<string, string> = {
  low: '#22c55e',          // Hijau
  medium: '#eab308',       // Kuning
  high: '#f97316',         // Orange
  critical: '#ef4444',     // Merah
  information: '#facc15',  // Kuning Terang (Yellow-400)
  Notice: '#a855f7',       // Ungu
};

export default function AttackMap2D({ data }: AttackMap2DProps) {
  return (
    <div className="w-full h-full bg-slate-950 flex items-center justify-center cursor-move">
      <ComposableMap
        projectionConfig={{ scale: 140 }}
        className="w-full h-full"
      >
        <ZoomableGroup 
          zoom={1} 
          minZoom={1} 
          maxZoom={8} 
          translateExtent={[[0, 0], [800, 600]]}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#1e293b"
                  stroke="#334155"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: { fill: "#334155", outline: "none" },
                    pressed: { fill: "#0ea5e9", outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>

          {data.map((attack, i) => {
            const color = severityColor[attack.severity] || "#94a3b8";
            
            return (
              <g key={`attack-group-${i}`}>
                {/* 1. Garis Background (Static/Dim) agar jalur terlihat sedikit */}
                <Line
                  from={[attack.startLng, attack.startLat]}
                  to={[attack.endLng, attack.endLat]}
                  stroke={color}
                  strokeWidth={1}
                  strokeOpacity={0.2}
                />

                {/* 2. Garis Animasi (Moving Line) */}
                <Line
                  from={[attack.startLng, attack.startLat]}
                  to={[attack.endLng, attack.endLat]}
                  stroke={color}
                  strokeWidth={2}
                  strokeLinecap="round"
                  style={{
                    strokeDasharray: "10, 10", // Membuat garis putus-putus
                    filter: `drop-shadow(0 0 2px ${color})` // Efek glowing
                  }}
                >
                  {/* Animasi pergerakan dash offset */}
                  <animate
                    attributeName="stroke-dashoffset"
                    from="100"
                    to="0"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </Line>
              </g>
            );
          })}

          {/* Titik Koordinat */}
          {data.map((d, i) => (
            <React.Fragment key={`markers-${i}`}>
              <Marker coordinates={[d.startLng, d.startLat]}>
                <circle r={1} fill="#fff" />
              </Marker>
              <Marker coordinates={[d.endLng, d.endLat]}>
                {/* Titik tujuan dengan efek denyut (pulse) */}
                <circle r={2} fill={severityColor[d.severity]}>
                  <animate
                    attributeName="r"
                    from="1.5"
                    to="3"
                    dur="1.5s"
                    begin="0s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    from="1"
                    to="0"
                    dur="1.5s"
                    begin="0s"
                    repeatCount="indefinite"
                  />
                </circle>
                <circle r={1.8} fill={severityColor[d.severity]} />
              </Marker>
            </React.Fragment>
          ))}
        </ZoomableGroup>
      </ComposableMap>

      <div className="absolute top-2 right-2 text-[8px] text-slate-500 pointer-events-none">
        Scroll to zoom • Drag to pan
      </div>
    </div>
  );
}