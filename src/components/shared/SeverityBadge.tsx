// import { SeverityLevel } from "@/types/security";
// import { Badge } from "@/components/ui/badge";
// import { cn } from "@/lib/utils";

// interface SeverityBadgeProps {
//   severity: SeverityLevel;
//   className?: string;
// }

// const severityConfig = {
//   critical: {
//     label: "Critical",
//     className: "bg-severity-critical text-white border-severity-critical",
//   },
//   high: {
//     label: "High",
//     className: "bg-severity-high text-white border-severity-high",
//   },
//   medium: {
//     label: "Medium",
//     className: "bg-severity-medium text-black border-severity-medium",
//   },
//   low: {
//     label: "Low",
//     className: "bg-severity-low text-white border-severity-low",
//   },
// };

// export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
//   const config = severityConfig[severity];
  
//   return (
//     <Badge className={cn(config.className, className)} variant="outline">
//       {config.label}
//     </Badge>
//   );
// }
import { SeverityLevel } from "@/types/security";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Tambahkan "unknown" atau "default" ke SeverityLevel jika ada di tipe Anda.
// Jika tidak, kita akan menganggap input yang tidak valid sebagai 'low' atau 'unknown'

interface SeverityBadgeProps {
  severity: SeverityLevel;
  className?: string;
}

const severityConfig = {
  critical: {
    label: "Critical",
    className: "bg-severity-critical text-white border-severity-critical",
  },
  high: {
    label: "High",
    className: "bg-severity-high text-white border-severity-high",
  },
  medium: {
    label: "Medium",
    className: "bg-severity-medium text-black border-severity-medium",
  },
  low: {
    label: "Low",
    className: "bg-severity-low text-white border-severity-low",
  },
  information: {
    label: "Information",
    className: "bg-severity-medium text-black border-severity-medium",
  },
  informational: {
    label: "Informational",
    className: "bg-severity-medium text-black border-severity-medium",
  },
  notice: {
    label: "Notice",
    className: "bg-severity-medium text-black border-severity-medium",
  },
  // ✅ TAMBAH: Konfigurasi default untuk menangani nilai undefined/null
  unknown: {
    label: "Unknown",
    className: "bg-gray-400 text-black border-gray-400",
  },
};

export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  // 1. Ambil severity yang masuk, paksa ke string lowercase untuk mencocokkan key config.
  const severityKey = (severity as string)?.toLowerCase() as keyof typeof severityConfig;

  // 2. Tentukan config. Jika key tidak ada, gunakan 'unknown' sebagai fallback.
  // Ini mencegah 'config' menjadi undefined.
  const config = severityConfig[severityKey] || severityConfig.unknown;
  
  return (
    <Badge className={cn(config.className, className)} variant="outline">
      {config.label}
    </Badge>
  );
}