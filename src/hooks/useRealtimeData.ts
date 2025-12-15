// import { useState, useEffect, useCallback, useRef } from "react";
// import {
//   SecurityEvent,
//   IPThreat,
//   GeoAttack,
//   MitreStage,
//   LogIngestion,
//   TimelineDataPoint,
//   TimeframeType,
// } from "@/types/security";

// interface RealtimeData {
//   events: SecurityEvent[];
//   ipThreats: IPThreat[];
//   geoAttacks: GeoAttack[];
//   mitreStages: MitreStage[];
//   logIngestion: LogIngestion;
//   timeline: TimelineDataPoint[];
// }

// type ConnectionStatus = "connecting" | "connected" | "disconnected";

// const WS_URL = "http://103.150.227.205:8000/api/threats/events/summary";
// const REFRESH_INTERVAL = 15000; // 15 seconds

// // Map frontend timeframes to backend timeframes
// const mapTimeframe = (timeframe: TimeframeType): string => {
//   const mapping = {
//     today: "today",
//     lastDay: "last24hours",
//     lastWeek: "last7days",
//     lastMonth: "last30days",
//   };
//   return mapping[timeframe];
// };

// // Convert ISO string dates to Date objects
// const parseIPThreat = (threat: any): IPThreat => ({
//   ...threat,
//   lastSeen: new Date(threat.lastSeen),
// });

// const parseLogIngestion = (log: any): LogIngestion => ({
//   ...log,
//   lastUpdate: new Date(log.lastUpdate),
// });

// const parseTimelinePoint = (point: any): TimelineDataPoint => ({
//   ...point,
//   timestamp: new Date(point.timestamp),
// });

// const parseSecurityEvent = (event: any): SecurityEvent => ({
//   ...event,
//   timestamp: new Date(event.timestamp),
// });

// export function useRealtimeData(
//   enabled: boolean = true,
//   timeframe: TimeframeType = "today"
// ) {
//   const [data, setData] = useState<RealtimeData>({
//     events: [],
//     ipThreats: [],
//     geoAttacks: [],
//     mitreStages: [],
//     logIngestion: {
//       totalEvents: 0,
//       eventsPerSecond: 0,
//       trendData: [],
//       status: "healthy",
//       lastUpdate: new Date(),
//     },
//     timeline: [],
//   });

//   const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("disconnected");
//   const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

//   const wsRef = useRef<WebSocket | null>(null);
//   const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
//   const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
//   const reconnectAttempts = useRef(0);

//   const sendRequest = useCallback(() => {
//     if (wsRef.current?.readyState === WebSocket.OPEN) {
//       const payload = {
//         timeframe: mapTimeframe(timeframe),
//         filters: [],
//       };
//       console.log("Sending WebSocket request:", payload);
//       wsRef.current.send(JSON.stringify(payload));
//     }
//   }, [timeframe]);

//   const connectWebSocket = useCallback(() => {
//     if (!enabled) return;

//     setConnectionStatus("connecting");
//     console.log("Connecting to WebSocket:", WS_URL);

//     const ws = new WebSocket(WS_URL);
//     wsRef.current = ws;

//     ws.onopen = () => {
//       console.log("WebSocket connected");
//       setConnectionStatus("connected");
//       reconnectAttempts.current = 0;
      
//       // Send initial request
//       sendRequest();
      
//       // Set up periodic refresh
//       if (refreshIntervalRef.current) {
//         clearInterval(refreshIntervalRef.current);
//       }
//       refreshIntervalRef.current = setInterval(sendRequest, REFRESH_INTERVAL);
//     };

//     ws.onmessage = (event) => {
//       try {
//         const response = JSON.parse(event.data);
//         console.log("Received WebSocket data:", response);

//         // Parse and convert dates
//         const parsedData: RealtimeData = {
//           events: (response.events?.data || []).map(parseSecurityEvent),
//           ipThreats: (response.ip_threats?.data || []).map(parseIPThreat),
//           geoAttacks: response.geo_attacks?.data || [],
//           mitreStages: response.mitre_stages?.data || [],
//           logIngestion: response.log_ingestion?.data
//             ? parseLogIngestion(response.log_ingestion.data)
//             : data.logIngestion,
//           timeline: (response.timeline?.data || []).map(parseTimelinePoint),
//         };

//         setData(parsedData);
//         setLastUpdate(new Date());
//       } catch (error) {
//         console.error("Error parsing WebSocket message:", error);
//       }
//     };

//     ws.onerror = (error) => {
//       console.error("WebSocket error:", error);
//       setConnectionStatus("disconnected");
//     };

//     ws.onclose = () => {
//       console.log("WebSocket closed");
//       setConnectionStatus("disconnected");
      
//       // Clear refresh interval
//       if (refreshIntervalRef.current) {
//         clearInterval(refreshIntervalRef.current);
//         refreshIntervalRef.current = null;
//       }

//       // Auto-reconnect with exponential backoff
//       if (enabled) {
//         const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
//         reconnectAttempts.current++;
//         console.log(`Reconnecting in ${delay}ms (attempt ${reconnectAttempts.current})`);
        
//         reconnectTimeoutRef.current = setTimeout(connectWebSocket, delay);
//       }
//     };
//   }, [enabled, sendRequest, timeframe, data.logIngestion]);

//   useEffect(() => {
//     if (enabled) {
//       connectWebSocket();
//     } else {
//       // Disconnect when disabled
//       if (wsRef.current) {
//         wsRef.current.close();
//         wsRef.current = null;
//       }
//       if (refreshIntervalRef.current) {
//         clearInterval(refreshIntervalRef.current);
//         refreshIntervalRef.current = null;
//       }
//       if (reconnectTimeoutRef.current) {
//         clearTimeout(reconnectTimeoutRef.current);
//         reconnectTimeoutRef.current = null;
//       }
//       setConnectionStatus("disconnected");
//     }

//     return () => {
//       if (wsRef.current) {
//         wsRef.current.close();
//       }
//       if (refreshIntervalRef.current) {
//         clearInterval(refreshIntervalRef.current);
//       }
//       if (reconnectTimeoutRef.current) {
//         clearTimeout(reconnectTimeoutRef.current);
//       }
//     };
//   }, [enabled, connectWebSocket]);

//   // Resend request when timeframe changes
//   useEffect(() => {
//     if (enabled && connectionStatus === "connected") {
//       sendRequest();
//     }
//   }, [timeframe, enabled, connectionStatus, sendRequest]);

//   const refreshData = useCallback(() => {
//     sendRequest();
//   }, [sendRequest]);

//   return {
//     ...data,
//     refreshData,
//     connectionStatus,
//     lastUpdate,
//   };
// }

import { useState, useEffect, useCallback, useRef } from "react";
import {
    SecurityEvent,
    IPThreat,
    GeoAttack,
    MitreStage,
    LogIngestion,
    TimelineDataPoint,
    TimeframeType,
    SeverityLevel,
} from "@/types/security"; // Pastikan semua interface ini sudah diimpor

interface RealtimeData {
    events: SecurityEvent[];
    ipThreats: IPThreat[];
    geoAttacks: GeoAttack[]; // Menggunakan GeoAttack
    mitreStages: MitreStage[];
    logIngestion: LogIngestion;
    timeline: TimelineDataPoint[];
}

type ConnectionStatus = "connecting" | "connected" | "disconnected";

// URL API dan Interval
const REST_API_URL = "http://127.0.0.1:8000/api/threats/events/summary";
const REFRESH_INTERVAL = 900000; // 15 minutes (900000 ms), disarankan untuk diperpendek (misalnya 60000 ms / 60 detik)

// Map frontend timeframes to backend timeframes
const mapTimeframe = (timeframe: TimeframeType): string => {
    const mapping = {
        today: "today",
        lastDay: "last24hours",
        lastWeek: "last7days",
        lastMonth: "last30days",
    };
    return mapping[timeframe];
};

// --- Fungsi Parsing yang Disesuaikan untuk REST API ---

const parseIPThreat = (threat: any): IPThreat => ({
    ip: threat.ip,
    severity: threat.severity.toLowerCase() as SeverityLevel,
    magnitude: Math.round(threat.score),
    eventCount: threat.event_count,
    lastSeen: new Date(),
});

const parseGeoAttack = (rawAttack: any): GeoAttack => {
    const srcLng = rawAttack.source_longitude || 0;
    const srcLat = rawAttack.source_latitude || 0;
    const dstLng = rawAttack.destination_longitude || 0;
    const dstLat = rawAttack.destination_latitude || 0;

    return {
        sourceCountry: rawAttack.country || 'Unknown',
        destinationCountry: rawAttack.destination_country || 'Unknown',
        severity: rawAttack.severity.toLowerCase() as SeverityLevel,
        attackCount: 1, 
        sourceCoords: [srcLng, srcLat],
        destinationCoords: [dstLng, dstLat],
    };
};

const mapMitreStageId = (stageName: string): string => {
    return stageName.toLowerCase().replace(/\s+/g, '_');
};

const parseMitreStage = (rawStage: any): MitreStage => ({
    id: mapMitreStageId(rawStage.stages) as any, 
    name: rawStage.stages,
    count: rawStage.total_data,
    percentage: parseFloat(rawStage.persen),
    description: rawStage.description, 
    techniques: [], 
    severity: rawStage.severity, 
});

/**
 * Menggabungkan data timeline dari semua event type
 * Data ini digunakan untuk EventsTimelineChart.
 */
const aggregateTimelineData = (eventsList: any[]): TimelineDataPoint[] => {
    const aggregatedMap = new Map<string, number>();

    eventsList.forEach(eventType => {
        // Hanya proses jika eventType memiliki array timeline
        if (eventType.timeline && Array.isArray(eventType.timeline)) {
            eventType.timeline.forEach((point: any) => {
                const dateKey = point.timeline; // Misalnya: "2025-12-15"
                const currentCount = aggregatedMap.get(dateKey) || 0;
                aggregatedMap.set(dateKey, currentCount + point.count);
            });
        }
    });

    const finalTimeline: TimelineDataPoint[] = [];
    
    aggregatedMap.forEach((count, dateString) => {
        finalTimeline.push({
            timestamp: new Date(dateString),
            attackCount: count,
            severity: "medium", // Severity di chart timeline seringkali default
        });
    });

    // Urutkan berdasarkan waktu
    return finalTimeline.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
};

// Helper untuk mendapatkan total event berdasarkan event_type
const findEventTotal = (eventsList: any[], type: string): number => {
    const item = eventsList.find(e => e.event_type.toLowerCase() === type.toLowerCase());
    return item ? item.total : 0;
};


const parseSecurityEvent = (event: any, index: number): SecurityEvent => ({
    id: event.id || `event-${Date.now()}-${index}`, 
    ...event,
    timestamp: new Date(event.timestamp),
});

// --- Hook useRealtimeData yang Diperbarui ---

export function useRealtimeData(
    enabled: boolean = true, 
    timeframe: TimeframeType = "today"
) {
    const [data, setData] = useState<RealtimeData>({
        events: [],
        ipThreats: [],
        geoAttacks: [],
        mitreStages: [],
        logIngestion: {
            totalEvents: 0,
            eventsPerSecond: 0,
            trendData: [], // Digunakan untuk 3 Bar di LogIngestionPanel
            status: "healthy",
            lastUpdate: new Date(),
        },
        timeline: [], // Digunakan untuk EventsTimelineChart
    });

    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("disconnected");
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

    const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const fetchData = useCallback(async () => {
        if (connectionStatus === "disconnected") {
            console.log("[CONNECTION STATUS] Koneksi diinisiasi/disambungkan kembali.");
            setConnectionStatus("connecting");
        }

        const currentBackendTimeframe = mapTimeframe(timeframe);
        const payload = {
            timeframe: currentBackendTimeframe,
            filters: [],
        };
        
        console.log(`[REQUEST 📬] Mengirimkan permintaan REST API untuk timeframe: ${timeframe}`, payload);

        try {
            
            const response = await fetch(REST_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
            }

            const rawResponse = await response.json();
            const safeResponse = rawResponse || {}; 
            
            console.log(`[RESPONSE RAW 📦] Data JSON diterima.`, safeResponse);

            // 1. Parsing Data Ringkasan Utama
            const parsedIPThreats = (safeResponse.summary || []).map(parseIPThreat);
            const parsedMitreStages = (safeResponse.mitre || []).map(parseMitreStage);
            const parsedGeoAttacks = (safeResponse.global_attack || []).map(parseGeoAttack);
            
            // 2. Data untuk LOG INGESTION PANEL (3 Bar)
            // Menggunakan "events_ingest" jika tersedia
            const ingestionSource = safeResponse.events_ingest?.[0]; 
            const ingestionList = ingestionSource?.list || [];
            
            const suricataTotal = findEventTotal(ingestionList, "suricata");
            const sophosTotal = findEventTotal(ingestionList, "sophos");
            const panwTotal = findEventTotal(ingestionList, "panw");
            const trendDataPoints: number[] = [suricataTotal, sophosTotal, panwTotal]; 
            
            // 3. Data untuk EVENTS TIMELINE CHART (Line Chart) dan Daftar Events
            // Menggunakan "events" (yang berisi array timeline per event type)
            const timelineSource = safeResponse.events?.[0];
            const timelineList = timelineSource?.list || [];
            
            const aggregatedTimeline = aggregateTimelineData(timelineList); 

            // 4. Membangun State Akhir
            const parsedData: RealtimeData = {
                ipThreats: parsedIPThreats,
                geoAttacks: parsedGeoAttacks, 
                mitreStages: parsedMitreStages, 
                
                // Daftar events (bisa diambil dari timelineSource)
                events: (timelineSource?.list || []).map((event: any, index: number) => parseSecurityEvent(event, index)),
                
                // State Log Ingestion
                logIngestion: ingestionSource
                    ? {
                        totalEvents: ingestionSource.total,
                        eventsPerSecond: ingestionSource.seconds,
                        trendData: trendDataPoints, // Data 3 Bar
                        status: "healthy", 
                        lastUpdate: new Date(), 
                    }
                    : data.logIngestion,
                    
                // State Timeline Chart
                timeline: aggregatedTimeline, // Data Line Chart
            };

            setData(parsedData);
            setLastUpdate(new Date());
            setConnectionStatus("connected"); 
        } catch (error) {
            console.error(`[ERROR ❌] Gagal mengambil atau memproses data untuk timeframe ${timeframe}:`, error);
            setConnectionStatus("disconnected"); 
        }
    }, [timeframe, connectionStatus]); // Menghapus data.logIngestion dari dependency karena sudah diperbaiki

    // Efek untuk Polling dan Refresh
    useEffect(() => {
        if (refreshIntervalRef.current) {
            clearInterval(refreshIntervalRef.current);
            refreshIntervalRef.current = null;
        }

        console.log(`[HOOK TRIGGER ⏰] Timeframe/Realtime mode berubah. Memulai fetch data...`);
        
        // PANGGIL FETCH DATA SEGERA
        fetchData();

        // SET INTERVAL POLLING BARU HANYA jika enabled (Realtime mode)
        if (enabled) {
            console.log(`[POLLING ♻️] Memulai polling data setiap ${REFRESH_INTERVAL / 1000} detik.`);
            refreshIntervalRef.current = setInterval(fetchData, REFRESH_INTERVAL);
        }

        // Cleanup function:
        return () => {
            if (refreshIntervalRef.current) {
                clearInterval(refreshIntervalRef.current);
            }
        };
    }, [enabled, timeframe, fetchData]);

    // Fungsi refresh manual
    const refreshData = useCallback(() => {
        console.log(`[MANUAL REFRESH] Memuat ulang data untuk timeframe ${timeframe}.`);
        fetchData();
    }, [fetchData, timeframe]);

    return {
        ...data,
        refreshData,
        connectionStatus,
        lastUpdate,
    };
}