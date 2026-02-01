// src/hooks/useRealtimeData.ts
import { useState, useEffect, useCallback, useRef } from "react";
import { IPThreat, TimeframeType } from "@/types/security";

type ConnectionStatus = "connecting" | "connected" | "disconnected";

const WS_URL = "ws://103.150.227.205:8000/api/threats/events/summary/ws";
const REFRESH_INTERVAL = 15000; // 15s

// jika TimeframeType berbeda, sesuaikan mapping ini
const mapTimeframe = (timeframe: TimeframeType) => {
  const mapping: Record<string, string> = {
    today: "today",
    lastDay: "last24hours",
    lastWeek: "last7days",
    lastMonth: "last30days",
    last30days: "last30days",
  };
  return mapping[timeframe] ?? timeframe;
};

// bentuk summary item dari server (sesuai contoh postman)
interface SummaryItemRaw {
  ip: string;
  event_count?: number;
  modul_count?: number;
  sub_type_count?: number;
  score?: number;
  severity?: string;
}

export function useRealtimeData(enabled = true, timeframe: TimeframeType = "today") {
  const [ipThreats, setIpThreats] = useState<IPThreat[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("disconnected");
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const refreshIntervalRef = useRef<number | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const reconnectAttempts = useRef(0);
  const timeframeRef = useRef<string>(mapTimeframe(timeframe));

  // Keep timeframeRef updated so setInterval/sendRequest uses latest value
  useEffect(() => {
    timeframeRef.current = mapTimeframe(timeframe);
  }, [timeframe]);

  const sendRequest = useCallback(() => {
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      const payload = {
        timeframe: timeframeRef.current,
        filters: [],
      };
      try {
        ws.send(JSON.stringify(payload));
        // optional: console.log
        // console.log("WS sent request:", payload);
      } catch (err) {
        console.error("Failed to send WS request:", err);
      }
    }
  }, []);

  const parseSummaryToIPThreats = (arr: SummaryItemRaw[] = []): IPThreat[] => {
    return arr.map((it) => ({
      ip: it.ip,
      // sesuaikan nama field di `IPThreat` yang kamu pakai di project
      eventCount: it.event_count ?? 0,
      modulCount: it.modul_count ?? 0,
      subTypeCount: it.sub_type_count ?? 0,
      magnitude: typeof it.score === "number" ? Math.round(it.score) : (it.score ? Number(it.score) : 0),
      severity: (it.severity || "unknown").toLowerCase(),
      // tambahkan field lain sesuai tipe IPThreat di projectmu
      lastSeen: new Date(), // placeholder jika server tidak kirim lastSeen
      // ... jika tipe IPThreat punya lainnya, isi sesuai kebutuhan
    })) as IPThreat[];
  };

  const connectWebSocket = useCallback(() => {
    if (!enabled) return;
    // avoid multiple sockets
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      return;
    }

    setConnectionStatus("connecting");
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
      setConnectionStatus("connected");
      reconnectAttempts.current = 0;

      // send initial request
      sendRequest();

      // start periodic refresh (use window.setInterval to get numeric id)
      if (refreshIntervalRef.current) {
        window.clearInterval(refreshIntervalRef.current);
      }
      refreshIntervalRef.current = window.setInterval(sendRequest, REFRESH_INTERVAL);
    };

    ws.onmessage = (ev) => {
      try {
        const response = JSON.parse(ev.data);

        // CASE 1: server sends { summary: [ ... ] }  <-- sesuai Postman contoh
        if (Array.isArray(response.summary)) {
          const mapped = parseSummaryToIPThreats(response.summary);
          setIpThreats(mapped);
          setLastUpdate(new Date());
          return;
        }

        // CASE 2: server sends { summary: { top_ips: [...] } }
        if (response.summary && Array.isArray(response.summary.top_ips)) {
          const mapped = parseSummaryToIPThreats(response.summary.top_ips);
          setIpThreats(mapped);
          setLastUpdate(new Date());
          return;
        }

        // fallback: jika server mengirim `ip_threats` keyed object:
        if (response.ip_threats && Array.isArray(response.ip_threats.data)) {
          const mapped = parseSummaryToIPThreats(response.ip_threats.data);
          setIpThreats(mapped);
          setLastUpdate(new Date());
          return;
        }

        // jika struktur lain, log untuk debugging
        console.debug("WS received unrecognized structure:", response);
      } catch (err) {
        console.error("Error parsing WS message:", err);
      }
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
      setConnectionStatus("disconnected");
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
      setConnectionStatus("disconnected");

      // clear periodic refresh
      if (refreshIntervalRef.current) {
        window.clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }

      // reconnect with exponential backoff
      if (enabled) {
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
        reconnectAttempts.current++;
        reconnectTimeoutRef.current = window.setTimeout(() => {
          connectWebSocket();
        }, delay) as unknown as number;
      }
    };
  }, [enabled, sendRequest]);

  useEffect(() => {
    if (enabled) connectWebSocket();

    return () => {
      // cleanup on unmount / disabled
      if (wsRef.current) {
        try { wsRef.current.close(); } catch (e) {}
        wsRef.current = null;
      }
      if (refreshIntervalRef.current) {
        window.clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        window.clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };
    // note: do NOT include connectWebSocket in deps that change every render
  }, [enabled, connectWebSocket]);

  // expose refresh function to manually request update
  const refreshData = useCallback(() => {
    sendRequest();
  }, [sendRequest]);

  return {
    ipThreats,
    refreshData,
    connectionStatus,
    lastUpdate,
  };
}
