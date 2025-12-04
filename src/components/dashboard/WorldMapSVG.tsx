import { cn } from "@/lib/utils";

interface WorldMapSVGProps {
  onCountryClick?: (country: string) => void;
  hoveredCountry?: string | null;
  onCountryHover?: (country: string | null) => void;
  className?: string;
}

// More detailed world map with country paths (2D flat Mercator-like projection)
const countries = [
  // North America - USA, Canada, Mexico
  {
    name: "North America",
    path: "M140,65 L155,60 L180,58 L205,62 L225,70 L245,75 L260,82 L265,95 L262,110 L255,125 L245,138 L230,148 L215,155 L195,160 L175,162 L155,158 L140,150 L130,135 L125,118 L125,100 L128,85 L135,72 Z M170,50 L190,48 L210,50 L225,55 L230,62 L225,68 L210,70 L190,68 L170,62 Z",
    gradient: "url(#gradient-americas)",
    emphasis: false
  },
  // Central America
  {
    name: "Central America",
    path: "M185,163 L195,165 L205,170 L210,178 L208,185 L200,188 L190,186 L182,180 L180,172 Z",
    gradient: "url(#gradient-americas)",
    emphasis: false
  },
  // South America
  {
    name: "South America",
    path: "M205,188 L220,192 L235,200 L245,215 L248,235 L245,255 L238,275 L225,290 L210,298 L195,300 L180,295 L170,280 L165,260 L168,240 L175,220 L185,205 L195,195 Z",
    gradient: "url(#gradient-americas)",
    emphasis: false
  },
  // Greenland
  {
    name: "Greenland",
    path: "M290,25 L315,22 L335,28 L345,40 L342,55 L330,65 L310,68 L290,62 L280,50 L282,35 Z",
    gradient: "url(#gradient-arctic)",
    emphasis: false
  },
  // Europe
  {
    name: "Europe",
    path: "M455,70 L468,68 L485,70 L500,75 L512,82 L520,90 L522,100 L518,110 L508,118 L495,122 L480,123 L468,120 L458,113 L452,103 L450,92 L452,80 Z M475,65 L485,63 L495,65 L500,70 L495,73 L485,72 L475,68 Z",
    gradient: "url(#gradient-europe)",
    emphasis: false
  },
  // Africa
  {
    name: "Africa",
    path: "M470,128 L485,130 L502,135 L518,143 L530,155 L538,172 L540,190 L538,210 L530,230 L518,248 L502,262 L485,270 L468,272 L455,268 L445,258 L440,240 L440,220 L445,200 L452,180 L460,160 L465,145 L468,135 Z",
    gradient: "url(#gradient-africa)",
    emphasis: false
  },
  // Middle East
  {
    name: "Middle East",
    path: "M525,125 L545,128 L560,135 L568,145 L565,158 L555,165 L540,168 L528,163 L522,152 L520,140 Z",
    gradient: "url(#gradient-asia)",
    emphasis: false
  },
  // Russia & Northern Asia
  {
    name: "Russia",
    path: "M525,45 L550,42 L580,43 L615,48 L655,55 L695,60 L735,63 L775,65 L810,68 L835,72 L850,78 L855,90 L850,105 L835,118 L810,125 L780,128 L750,130 L715,128 L680,125 L650,122 L620,118 L590,112 L560,105 L535,95 L525,82 L522,68 L525,55 Z",
    gradient: "url(#gradient-asia)",
    emphasis: false
  },
  // Central Asia
  {
    name: "Central Asia",
    path: "M575,100 L595,98 L615,100 L630,105 L638,115 L635,128 L625,135 L610,138 L595,135 L583,128 L578,118 L575,108 Z",
    gradient: "url(#gradient-asia)",
    emphasis: false
  },
  // China
  {
    name: "China",
    path: "M640,95 L665,93 L690,98 L710,108 L720,120 L722,135 L718,150 L708,162 L692,168 L675,170 L658,168 L645,160 L638,148 L635,135 L638,120 L642,108 Z",
    gradient: "url(#gradient-asia)",
    emphasis: false
  },
  // India
  {
    name: "India",
    path: "M615,142 L630,145 L643,152 L650,165 L652,180 L648,195 L638,208 L625,215 L612,218 L600,215 L592,205 L590,190 L592,175 L598,160 L608,150 Z",
    gradient: "url(#gradient-asia)",
    emphasis: false
  },
  // Southeast Asia (Thailand, Vietnam, Malaysia)
  {
    name: "Southeast Asia",
    path: "M665,175 L678,178 L688,185 L693,195 L690,208 L682,218 L670,222 L658,220 L650,210 L648,198 L652,188 L660,182 Z",
    gradient: "url(#gradient-sea)",
    emphasis: false
  },
  // Indonesia - EMPHASIZED (home country)
  {
    name: "Indonesia",
    path: "M680,222 L695,223 L710,227 L722,233 L728,242 L725,252 L715,258 L700,260 L685,258 L672,252 L665,243 L665,233 L670,227 Z M735,235 L748,237 L758,242 L760,250 L755,257 L745,260 L735,257 L730,250 L732,242 Z M765,245 L778,246 L788,250 L790,257 L785,263 L775,265 L765,262 L760,255 L762,250 Z",
    gradient: "url(#gradient-indonesia)",
    emphasis: true
  },
  // Philippines
  {
    name: "Philippines",
    path: "M735,185 L745,187 L753,193 L755,203 L750,213 L742,218 L733,217 L728,210 L728,200 L732,192 Z",
    gradient: "url(#gradient-sea)",
    emphasis: false
  },
  // Japan
  {
    name: "Japan",
    path: "M760,105 L772,107 L780,113 L782,123 L778,133 L770,138 L760,138 L753,132 L752,122 L755,113 Z M765,95 L775,96 L782,100 L783,107 L778,112 L770,112 L763,107 L762,100 Z",
    gradient: "url(#gradient-asia)",
    emphasis: false
  },
  // Korea
  {
    name: "Korea",
    path: "M740,115 L748,117 L753,123 L752,132 L745,137 L738,136 L735,130 L736,122 Z",
    gradient: "url(#gradient-asia)",
    emphasis: false
  },
  // Australia
  {
    name: "Australia",
    path: "M720,260 L745,262 L770,268 L792,278 L808,292 L815,308 L815,325 L808,340 L792,350 L770,355 L745,355 L720,350 L700,340 L685,325 L678,308 L678,292 L685,278 L700,268 Z",
    gradient: "url(#gradient-oceania)",
    emphasis: false
  },
  // New Zealand
  {
    name: "New Zealand",
    path: "M835,325 L845,327 L852,335 L852,347 L845,355 L835,355 L828,348 L828,335 Z M838,310 L846,311 L851,317 L849,324 L842,326 L835,323 L833,317 Z",
    gradient: "url(#gradient-oceania)",
    emphasis: false
  },
];

export function WorldMapSVG({ onCountryClick, hoveredCountry, onCountryHover, className }: WorldMapSVGProps) {
  return (
    <svg
      viewBox="0 0 900 350"
      className={cn("w-full h-full", className)}
      style={{ background: "transparent" }}
    >
      <defs>
        {/* Gradient definitions for regions */}
        <linearGradient id="gradient-americas" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.25" />
          <stop offset="100%" stopColor="hsl(var(--chart-2))" stopOpacity="0.15" />
        </linearGradient>
        
        <linearGradient id="gradient-europe" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity="0.25" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.15" />
        </linearGradient>
        
        <linearGradient id="gradient-africa" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--chart-3))" stopOpacity="0.25" />
          <stop offset="100%" stopColor="hsl(var(--chart-4))" stopOpacity="0.15" />
        </linearGradient>
        
        <linearGradient id="gradient-asia" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--chart-5))" stopOpacity="0.25" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.15" />
        </linearGradient>
        
        <linearGradient id="gradient-oceania" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--chart-2))" stopOpacity="0.25" />
          <stop offset="100%" stopColor="hsl(var(--chart-4))" stopOpacity="0.15" />
        </linearGradient>

        <linearGradient id="gradient-arctic" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity="0.2" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
        </linearGradient>

        <linearGradient id="gradient-sea" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--chart-4))" stopOpacity="0.3" />
          <stop offset="100%" stopColor="hsl(var(--chart-5))" stopOpacity="0.2" />
        </linearGradient>

        {/* Special gradient for Indonesia (emphasized home country) */}
        <linearGradient id="gradient-indonesia" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
          <stop offset="50%" stopColor="hsl(var(--chart-2))" stopOpacity="0.5" />
          <stop offset="100%" stopColor="hsl(var(--chart-4))" stopOpacity="0.4" />
        </linearGradient>

        {/* Glow filter for continents */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        {/* Strong glow for pulse effects */}
        <filter id="pulse-glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Grid pattern background */}
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path
          d="M 40 0 L 0 0 0 40"
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="0.5"
          opacity="0.1"
        />
      </pattern>
      <rect width="100%" height="100%" fill="url(#grid)" />

      {/* Countries */}
      <g>
        {countries.map((country, index) => (
          <path
            key={index}
            d={country.path}
            fill={country.gradient}
            stroke={country.emphasis ? "hsl(var(--primary))" : "hsl(var(--border))"}
            strokeWidth={country.emphasis ? "2" : "1"}
            className={cn(
              "transition-all duration-300 cursor-pointer",
              country.emphasis 
                ? "hover:stroke-[3] hover:brightness-150 animate-pulse" 
                : "hover:stroke-[2] hover:brightness-125"
            )}
            filter={country.emphasis ? "url(#pulse-glow)" : "url(#glow)"}
            onMouseEnter={() => onCountryHover?.(country.name)}
            onMouseLeave={() => onCountryHover?.(null)}
            onClick={() => onCountryClick?.(country.name)}
            style={{
              opacity: hoveredCountry && hoveredCountry !== country.name ? 0.4 : 1,
              animationDuration: country.emphasis ? "3s" : undefined
            }}
          />
        ))}
      </g>

      {/* Decorative stars/dots for cybersecurity feel */}
      {[...Array(30)].map((_, i) => (
        <circle
          key={`star-${i}`}
          cx={Math.random() * 900}
          cy={Math.random() * 350}
          r="1"
          fill="hsl(var(--primary))"
          opacity={Math.random() * 0.3 + 0.1}
          className="animate-pulse"
          style={{
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${Math.random() * 2 + 2}s`
          }}
        />
      ))}
    </svg>
  );
}
