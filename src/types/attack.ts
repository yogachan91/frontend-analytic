export type AttackSeverity = "low" | "medium" | "high" | "critical";

export interface AttackData {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  severity: AttackSeverity;
  type: string;
  source: string;
  target: string;
}
