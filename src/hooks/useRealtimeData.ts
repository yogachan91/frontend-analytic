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

// Ganti WS_URL menjadi REST_API_URL
const REST_API_URL = "http://103.150.227.205:8000/api/threats/events/summary";
const REFRESH_INTERVAL = 60000; // 60 seconds

// Map frontend timeframes to backend timeframes
const mapTimeframe = (timeframe: TimeframeType): string => {
    const mapping = {
        today: "last30days",
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
    // Membulatkan magnitude
    magnitude: Math.round(threat.score), 
    eventCount: threat.event_count,
    lastSeen: new Date(),
});

const parseGeoAttack = (rawAttack: any): GeoAttack => {
    // Memastikan koordinat adalah number dan bukan null
    const srcLng = rawAttack.source_longitude || 0;
    const srcLat = rawAttack.source_latitude || 0;
    const dstLng = rawAttack.destination_longitude || 0;
    const dstLat = rawAttack.destination_latitude || 0;

    return {
        // Mapping ke interface GeoAttack:
        sourceCountry: rawAttack.country || 'Unknown',
        destinationCountry: rawAttack.destination_country || 'Unknown',
        severity: rawAttack.severity.toLowerCase() as SeverityLevel,
        
        // attackCount adalah 1 per event yang diparsing dari backend
        attackCount: 1, 
        
        // Memetakan ke format koordinat [longitude, latitude]
        sourceCoords: [srcLng, srcLat],
        destinationCoords: [dstLng, dstLat],
    };
};

// Helper untuk mendapatkan ID yang aman dari nama stage MITRE
const mapMitreStageId = (stageName: string): string => {
    return stageName.toLowerCase().replace(/\s+/g, '_');
};

// Fungsi Parsing untuk MITRE Stages
const parseMitreStage = (rawStage: any): MitreStage => ({
    id: mapMitreStageId(rawStage.stages) as any, 
    name: rawStage.stages,
    count: rawStage.total_data,
    percentage: parseFloat(rawStage.persen),
    description: rawStage.description, 
    techniques: [], 
    severity: rawStage.severity, 
});

// Fungsi helper untuk menggabungkan data timeline dari semua event type
const aggregateTimelineData = (eventsList: any[]): TimelineDataPoint[] => {
    const aggregatedMap = new Map<string, number>();

    eventsList.forEach(eventType => {
        if (eventType.timeline && Array.isArray(eventType.timeline)) {
            eventType.timeline.forEach((point: any) => {
                const dateKey = point.timeline;
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
            severity: "medium", 
        });
    });

    return finalTimeline.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
};


const parseLogIngestion = (log: any): LogIngestion => ({
    ...log,
    // Perlu disesuaikan jika API tidak mengembalikan 'lastUpdate'
    lastUpdate: new Date(), 
});

// ✅ PERBAIKAN: Tambahkan 'index' sebagai argumen dan pastikan ID unik
const parseSecurityEvent = (event: any, index: number): SecurityEvent => ({
    // Gunakan ID event yang ada, atau buat ID unik menggunakan Date.now() dan index
    id: event.id || `event-${Date.now()}-${index}`, 
    ...event,
    timestamp: new Date(event.timestamp),
});

// --- Hook useRealtimeData yang Diperbarui ---

export function useRealtimeData(
    enabled: boolean = true, // enabled = isRealtime
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
            trendData: [],
            status: "healthy",
            lastUpdate: new Date(),
        },
        timeline: [],
    });

    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("disconnected");
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

    const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Fungsi untuk mengambil data menggunakan REST API
    const fetchData = useCallback(async () => {
        // ... (Logika status connecting)
        if (connectionStatus === "disconnected") {
             console.log("[CONNECTION STATUS] Koneksi diinisiasi/disambungkan kembali.");
             setConnectionStatus("connecting");
        }

        const currentBackendTimeframe = mapTimeframe(timeframe);
        const payload = {
            timeframe: currentBackendTimeframe,
            filters: [],
        };
        
        console.log(`[REQUEST 📬] Mengirimkan permintaan REST API untuk timeframe: ${timeframe} (${currentBackendTimeframe})`, payload);

        try {
            
            const response = await fetch(REST_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            // 1. Cek status HTTP
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
            }

            // 2. Ambil raw response JSON
            const rawResponse = await response.json();
            
            const safeResponse = rawResponse || {}; 
            
            console.log(`[RESPONSE RAW 📦] Data JSON Penuh diterima untuk timeframe: ${timeframe}`, safeResponse);

            // 3. Gunakan safeResponse untuk parsing data
            const parsedIPThreats = (safeResponse.summary || []).map(parseIPThreat);
            const parsedMitreStages = (safeResponse.mitre || []).map(parseMitreStage);
            
            // 🆕 Ambil data 'global_attack' dan parse menjadi GeoAttack
            const parsedGeoAttacks = (safeResponse.global_attack || []).map(parseGeoAttack);
            
            const eventsList = safeResponse.events?.[0]?.list || [];
            const aggregatedTimeline = aggregateTimelineData(eventsList);
            
            const trendDataPoints = aggregatedTimeline.map(point => point.attackCount);


            const parsedData: RealtimeData = {
                ipThreats: parsedIPThreats,
                
                // ✅ PERBAIKAN: Berikan index ke parseSecurityEvent
                events: (safeResponse.events?.[0]?.list || []).map((event: any, index: number) => parseSecurityEvent(event, index)), 
                
                // 🆕 Update state geoAttacks
                geoAttacks: parsedGeoAttacks, 
                
                mitreStages: parsedMitreStages, 
                
                logIngestion: safeResponse.events?.[0]
                    ? {
                        totalEvents: safeResponse.events[0].total,
                        eventsPerSecond: safeResponse.events[0].seconds,
                        trendData: trendDataPoints, 
                        status: "healthy", 
                        lastUpdate: new Date(), 
                    }
                    : data.logIngestion,
                    
                timeline: aggregatedTimeline, 
            };

            setData(parsedData);
            setLastUpdate(new Date());
            setConnectionStatus("connected"); // Status berubah ke 'Live' / 'Terhubung'
        } catch (error) {
            console.error(`[ERROR ❌] Gagal mengambil atau memproses data untuk timeframe ${timeframe}:`, error);
            setConnectionStatus("disconnected"); 
        }
    }, [enabled, timeframe, data.logIngestion, connectionStatus]); 

    // ... (Logika useEffect dan refreshData)
    // Efek TERPISAH untuk memastikan fetchData dipanggil ketika timeframe/enabled berubah
    useEffect(() => {
        // 1. Pastikan logika interval/polling sebelumnya dibersihkan
        if (refreshIntervalRef.current) {
            clearInterval(refreshIntervalRef.current);
            refreshIntervalRef.current = null;
        }

        console.log(`[HOOK TRIGGER ⏰] Timeframe/Realtime mode berubah. Memulai fetch data...`);
        
        // 2. PANGGIL FETCH DATA SEGERA
        fetchData();

        // 3. SET INTERVAL POLLING BARU HANYA jika enabled (Realtime mode)
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