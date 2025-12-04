import { useState, useCallback } from "react";
import { TimeframeType } from "@/types/security";

export function useTimeframe() {
  const [timeframe, setTimeframe] = useState<TimeframeType>("today");
  const [isRealtime, setIsRealtime] = useState(true);

  const handleTimeframeChange = useCallback((newTimeframe: TimeframeType) => {
    setTimeframe(newTimeframe);
    // Enable realtime only for "today" mode
    setIsRealtime(newTimeframe === "today");
  }, []);

  return {
    timeframe,
    isRealtime,
    setTimeframe: handleTimeframeChange,
  };
}
