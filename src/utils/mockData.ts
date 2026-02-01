import {
  SecurityEvent,
  IPThreat,
  GeoAttack,
  MitreStage,
  LogIngestion,
  ApplicationUsage,
  ProtocolDistribution,
  TimelineDataPoint,
  SeverityLevel,
  MitreStageType,
} from "@/types/security";

// TODO: Replace these mock data generators with actual API calls to your backend
// Example: export const fetchSecurityEvents = async () => await fetch('/api/events').then(r => r.json())

const severities: SeverityLevel[] = ["critical", "high", "medium", "low"];
// Indonesia is the home location (where internal IPs are)
const HOME_COUNTRY = "ID";
const countries = ["US", "CN", "RU", "GB", "DE", "FR", "KR", "JP", "BR", "IN", "AU", "SG", "MY", "TH", "VN"];
const applications = ["SSH", "HTTP", "HTTPS", "FTP", "DNS", "SMTP", "RDP", "SMB", "TELNET", "MySQL"];
const protocols = ["TCP", "UDP", "ICMP", "HTTP", "HTTPS", "SSH"];

const countryCoords: Record<string, [number, number]> = {
  ID: [113.9213, -0.7893], // Indonesia (home/source)
  US: [-95.7129, 37.0902],
  CN: [104.1954, 35.8617],
  RU: [105.3188, 61.5240],
  GB: [-3.4360, 55.3781],
  DE: [10.4515, 51.1657],
  FR: [2.2137, 46.2276],
  KR: [127.7669, 35.9078],
  JP: [138.2529, 36.2048],
  BR: [-51.9253, -14.2350],
  IN: [78.9629, 20.5937],
  AU: [133.7751, -25.2744],
  SG: [103.8198, 1.3521],
  MY: [101.9758, 4.2105],
  TH: [100.9925, 15.8700],
  VN: [108.2772, 14.0583],
};

function randomSeverity(): SeverityLevel {
  const rand = Math.random();
  if (rand < 0.1) return "critical";
  if (rand < 0.3) return "high";
  if (rand < 0.6) return "medium";
  return "low";
}

function randomInternalIP(): string {
  return `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}

function randomMitreStage(): MitreStageType {
  const stages: MitreStageType[] = [
    "initial_attempts",
    "persistent_foothold",
    "exploration",
    "propagation",
    "exfiltration",
  ];
  return stages[Math.floor(Math.random() * stages.length)];
}

export function generateMockSecurityEvents(count: number = 50): SecurityEvent[] {
  const events: SecurityEvent[] = [];
  
  for (let i = 0; i < count; i++) {
    const sourceCountry = countries[Math.floor(Math.random() * countries.length)];
    const destinationCountry = countries[Math.floor(Math.random() * countries.length)];
    
    events.push({
      id: `event-${Date.now()}-${i}`,
      timestamp: new Date(Date.now() - Math.random() * 86400000), // Last 24 hours
      sourceIP: randomInternalIP(),
      destinationIP: randomInternalIP(),
      sourceCountry,
      destinationCountry,
      severity: randomSeverity(),
      eventType: `${applications[Math.floor(Math.random() * applications.length)]}_ATTACK`,
      mitreStage: randomMitreStage(),
      protocol: protocols[Math.floor(Math.random() * protocols.length)],
      port: Math.floor(Math.random() * 65535),
      application: applications[Math.floor(Math.random() * applications.length)],
      description: `Security event detected from ${sourceCountry}`,
      rawData: {
        payload_size: Math.floor(Math.random() * 10000),
        flags: ["SYN", "ACK"][Math.floor(Math.random() * 2)],
      },
    });
  }
  
  return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

export function generateMockIPThreats(): IPThreat[] {
  const threats: IPThreat[] = [];
  
  // Generate 7 IPs with Critical/High severity (guaranteed for Top 5 panel)
  for (let i = 0; i < 7; i++) {
    threats.push({
      ip: randomInternalIP(),
      severity: Math.random() < 0.4 ? "critical" : "high", // 40% critical, 60% high
      magnitude: Math.floor(Math.random() * 100),
      eventCount: Math.floor(Math.random() * 500) + 10,
      lastSeen: new Date(Date.now() - Math.random() * 3600000),
    });
  }
  
  // Generate 8 more IPs with random severity (for realism)
  for (let i = 0; i < 8; i++) {
    threats.push({
      ip: randomInternalIP(),
      severity: randomSeverity(), // All severities possible
      magnitude: Math.floor(Math.random() * 100),
      eventCount: Math.floor(Math.random() * 500) + 10,
      lastSeen: new Date(Date.now() - Math.random() * 3600000),
    });
  }
  
  // Sort by magnitude and return top 10
  return threats.sort((a, b) => b.magnitude - a.magnitude).slice(0, 10);
}

export function generateMockGeoAttacks(): GeoAttack[] {
  const attacks: GeoAttack[] = [];
  const usedDestinations = new Set<string>();
  
  // All attacks originate FROM Indonesia (home location)
  for (let i = 0; i < 15; i++) {
    const dest = countries[Math.floor(Math.random() * countries.length)];
    
    if (dest !== HOME_COUNTRY && !usedDestinations.has(dest)) {
      usedDestinations.add(dest);
      attacks.push({
        sourceCountry: HOME_COUNTRY,
        destinationCountry: dest,
        attackCount: Math.floor(Math.random() * 1000) + 50,
        severity: randomSeverity(),
        sourceCoords: countryCoords[HOME_COUNTRY],
        destinationCoords: countryCoords[dest] || [0, 0],
      });
    }
  }
  
  return attacks;
}

export function generateMockMitreStages(): MitreStage[] {
  const totalEvents = Math.floor(Math.random() * 1000) + 500;
  
  const stages: MitreStage[] = [
    {
      id: "initial_attempts",
      name: "Initial Attempts",
      description: "Reconnaissance, Initial Access",
      count: Math.floor(totalEvents * 0.25),
      percentage: 25,
      techniques: ["T1595", "T1190", "T1133"],
      severity: "low",
    },
    {
      id: "persistent_foothold",
      name: "Persistent Foothold",
      description: "Execution, Persistence, Privilege Escalation",
      count: Math.floor(totalEvents * 0.20),
      percentage: 20,
      techniques: ["T1059", "T1547", "T1068"],
      severity: "medium",
    },
    {
      id: "exploration",
      name: "Exploration",
      description: "Defense Evasion, Credential Access, Discovery",
      count: Math.floor(totalEvents * 0.30),
      percentage: 30,
      techniques: ["T1070", "T1003", "T1083"],
      severity: "medium",
    },
    {
      id: "propagation",
      name: "Propagation",
      description: "Lateral Movement",
      count: Math.floor(totalEvents * 0.15),
      percentage: 15,
      techniques: ["T1021", "T1091"],
      severity: "high",
    },
    {
      id: "exfiltration",
      name: "Exfiltration",
      description: "Collection, Exfiltration, Impact",
      count: Math.floor(totalEvents * 0.10),
      percentage: 10,
      techniques: ["T1560", "T1041", "T1486"],
      severity: "critical",
    },
  ];
  
  return stages;
}

export function generateMockLogIngestion(): LogIngestion {
  const trendData = Array.from({ length: 60 }, () => 
    Math.floor(Math.random() * 500) + 100
  );
  
  const totalEvents = Math.floor(Math.random() * 100000) + 50000;
  const eventsPerSecond = trendData[trendData.length - 1];
  
  let status: "healthy" | "warning" | "critical" = "healthy";
  if (eventsPerSecond > 500) status = "warning";
  if (eventsPerSecond > 800) status = "critical";
  
  return {
    totalEvents,
    eventsPerSecond,
    trendData,
    status,
    lastUpdate: new Date(),
  };
}

export function generateMockApplicationUsage(): ApplicationUsage[] {
  const total = Math.floor(Math.random() * 10000) + 5000;
  
  return applications.slice(0, 5).map((app) => {
    const count = Math.floor(Math.random() * 2000) + 500;
    return {
      name: app,
      eventCount: count,
      percentage: Math.round((count / total) * 100),
    };
  }).sort((a, b) => b.eventCount - a.eventCount);
}

export function generateMockProtocolDistribution(): ProtocolDistribution[] {
  const total = Math.floor(Math.random() * 10000) + 5000;
  
  return protocols.map((protocol) => {
    const count = Math.floor(Math.random() * 2000) + 500;
    return {
      protocol,
      count,
      percentage: Math.round((count / total) * 100),
    };
  }).sort((a, b) => b.count - a.count);
}

export function generateMockTimeline(hours: number = 24): TimelineDataPoint[] {
  const dataPoints: TimelineDataPoint[] = [];
  const now = new Date();
  
  // Create more realistic patterns with burst periods
  const burstHours = [
    Math.floor(Math.random() * 8) + 8,  // Morning burst (8-16)
    Math.floor(Math.random() * 8) + 16  // Evening burst (16-24)
  ];
  
  for (let i = hours; i >= 0; i--) {
    const hour = now.getHours() - i;
    const normalizedHour = ((hour % 24) + 24) % 24;
    
    // Base event count with time-of-day variations
    let baseCount = 100;
    
    // Business hours (8-18) typically have more activity
    if (normalizedHour >= 8 && normalizedHour <= 18) {
      baseCount = 200;
    }
    
    // Check if this is a burst hour
    const isBurstHour = burstHours.some(bh => Math.abs(normalizedHour - bh) <= 1);
    
    let attackCount: number;
    let severity: SeverityLevel;
    
    if (isBurstHour) {
      // Burst period - high event count
      attackCount = Math.floor(Math.random() * 400) + 300;
      severity = Math.random() < 0.6 ? "high" : "critical";
    } else {
      // Normal period - varied activity
      attackCount = Math.floor(Math.random() * 150) + baseCount;
      severity = randomSeverity();
    }
    
    dataPoints.push({
      timestamp: new Date(now.getTime() - i * 3600000),
      attackCount,
      severity,
    });
  }
  
  return dataPoints;
}
