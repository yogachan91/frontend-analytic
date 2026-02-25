'use client';

import { useNavigate } from 'react-router-dom';
import { Globe as GlobeIcon } from 'lucide-react';
import { MetricCard } from '@/components/shared/MetricCard';
import AttackGlobe, { GlobeAttack } from '@/components/globe/AttackGlobe';
import { navigateToSearchWithCountry } from '@/utils/navigation';
import { GeoAttack } from '@/types/security';

// 🔥 Dummy data
import attackData from '@/data/attackData.json';

/* ================= SOURCE COLOR MAP ================= */
const SOURCE_COLORS: Record<string, string> = {
  USA: 'bg-yellow-500',
  Japan: 'bg-yellow-400',
  China: 'bg-yellow-500',
  Russia: 'bg-yellow-500',
  Iran: 'bg-yellow-500',
  Unknown: 'bg-yellow-400',
};

interface GlobeMapProps {
  attacks?: GeoAttack[];
}

export function GlobeMap({ attacks }: GlobeMapProps) {
  /* ✅ HOOK DI TEMPAT YANG BENAR */
  const navigate = useNavigate();

  const handleCountryClick = (country: string) => {
    navigate(navigateToSearchWithCountry(country));
  };

  /* ================= DATA ================= */
  const globeData: GlobeAttack[] =
    attacks && attacks.length > 0
      ? attacks.map(a => ({
          startLat: a.sourceCoords[1],
          startLng: a.sourceCoords[0],
          endLat: a.destinationCoords[1],
          endLng: a.destinationCoords[0],
          severity: a.severity,
          source: a.sourceCountry ?? 'Unknown',
          attackCount: a.attackCount
        }))
      : (attackData as GlobeAttack[]);

  /* ================= COUNT PER SOURCE ================= */
  const sourceCount = (attacks || []).reduce<Record<string, number>>((acc, item) => {
    const key = item.sourceCountry ?? 'Unknown';
    // Gunakan attackCount dari JSON, bukan + 1
    acc[key] = (acc[key] || 0) + item.attackCount; 
    return acc;
  }, {});

  return (
    <MetricCard title="Global Attack Map" icon={GlobeIcon} className="h-full">
      <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
        <AttackGlobe data={globeData} />

        {/* ================= LEGEND ================= */}
        <div className="absolute bottom-[70px] left-2 z-10 bg-background/80 backdrop-blur px-3 py-2 rounded text-[10px] space-y-2">

          {/* Severity */}
          <div>
            <div className="font-semibold mb-1">Severity</div>
            <Legend label="High" color="bg-orange-500" />
            <Legend label="Critical" color="bg-red-500" />
            <Legend label="Information" color="bg-yellow-500" />
          </div>
        </div>
        {/* Source + Count (CLICKABLE) */}
        <div className="absolute bottom-2 left-2 z-10 bg-background/80 backdrop-blur px-3 py-2 rounded text-[10px] space-y-2">
          <div>
            <div className="font-semibold mb-1 mt-2">Source Country</div>
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                {Object.entries(sourceCount).map(([source, count]) => (
                  <Legend
                    key={source}
                    label={`${source} : ${count}`}
                    color={SOURCE_COLORS[source] ?? 'bg-yellow-400'}
                    onClick={() => handleCountryClick(source)}
                  />
                ))}
              </div>
          </div>
        </div>  
      </div>

      <div className="mt-1 text-[10px] text-muted-foreground text-center">
        Real-time 3D attack visualization
      </div>
    </MetricCard>
  );
}

/* ================= LEGEND ITEM ================= */
function Legend({
  color,
  label,
  onClick,
}: {
  color: string;
  label: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-2 ${
        onClick ? 'cursor-pointer hover:opacity-80' : ''
      }`}
    >
      <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
      <span className="select-none">{label}</span>
    </div>
  );
}



