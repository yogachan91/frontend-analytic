export type SeverityLevel = "critical" | "high" | "medium" | "low";

export interface SecurityEvent {
  id: string;
  timestamp: Date;
  sourceIP: string;
  destinationIP: string;
  sourceCountry: string;
  destinationCountry: string;
  severity: SeverityLevel;
  eventType: string;
  mitreStage: MitreStageType;
  protocol: string;
  port: number;
  application: string;
  description: string;
  rawData: Record<string, any>;
}

export interface IPThreat {
  ip: string;
  severity: SeverityLevel;
  magnitude: number; // 0-100 score
  eventCount: number;
  lastSeen: Date;
}

export interface GeoAttack {
  sourceCountry: string;
  destinationCountry: string;
  attackCount: number;
  severity: SeverityLevel;
  sourceCoords: [number, number]; // [longitude, latitude]
  destinationCoords: [number, number];
}

export type MitreStageType = 
  | "initial_attempts"
  | "persistent_foothold"
  | "exploration"
  | "propagation"
  | "exfiltration";

export interface MitreStage {
  id: MitreStageType;
  name: string;
  description: string;
  count: number;
  percentage: number;
  techniques: string[];
  severity: SeverityLevel;
}

export interface LogIngestion {
  totalEvents: number;
  eventsPerSecond: number;
  trendData: number[]; // Last 60 seconds
  status: "healthy" | "warning" | "critical";
  lastUpdate: Date;
}

export interface ApplicationUsage {
  name: string;
  eventCount: number;
  percentage: number;
  icon?: string;
}

export interface ProtocolDistribution {
  protocol: string;
  count: number;
  percentage: number;
}

export interface TimelineDataPoint {
  timestamp: Date;
  attackCount: number;
  severity: SeverityLevel;
}

export type TimeframeType = "today" | "lastDay" | "lastWeek" | "lastMonth";

export interface DashboardFilter {
  field: string;
  operator: "is" | "is_not" | "contains" | "exists" | "greater_than" | "less_than";
  value: string;
}
