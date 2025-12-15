// import { useState, useEffect, useCallback } from "react";
// import {
//   SecurityEvent,
//   TimeframeType,
//   DashboardFilter,
//   SeverityLevel,
// } from "@/types/security";

// const EVENTS_FILTER_API_URL =
//   "http://127.0.0.1:8000/api/threats/events/filter";

// // Map timeframe frontend → backend
// const mapTimeframe = (timeframe: TimeframeType): string => {
//   const mapping: Record<string, string> = {
//     today: "last30days",
//     lastDay: "last24hours",
//     lastWeek: "last7days",
//     lastMonth: "last30days",
//   };
//   return mapping[timeframe] ?? "last30days";
// };

// // Generate stable & unique ID (fix duplicate key)
// const generateStableId = (event: any): string => {
//   if (event.event_id) return String(event.event_id);

//   return [
//     event.source_ip ?? "src",
//     event.destination_ip ?? "dst",
//     event.timestamp ?? "ts",
//     event.event_type ?? "evt",
//   ].join("-");
// };

// // Parse backend → SecurityEvent
// const parseBackendEvent = (event: any): SecurityEvent => ({
//   id: generateStableId(event),
//   timestamp: new Date(event.timestamp),
//   sourceIP: event.source_ip ?? "Unknown IP",
//   destinationIP: event.destination_ip ?? "Unknown IP",
//   sourceCountry: event.country ?? "Unknown",
//   destinationCountry: event.destination_country ?? "Unknown",
//   severity: (event.severity ?? "low").toLowerCase() as SeverityLevel,
//   eventType: event.event_type ?? "N/A",
//   mitreStage: event.mitre_stages ?? "Unmapped",
//   protocol: event.protocol ?? "N/A",
//   port: event.port ?? 0,
//   application: event.application ?? "N/A",
//   description: event.description ?? "No description available",
//   rawData: event,
// });

// // Prepare filters for API
// const prepareFiltersForAPI = (
//   filters: DashboardFilter[],
//   searchQuery: string
// ) => {
//   const apiFilters = filters.map((f) => ({
//     field: f.field,
//     operator: f.operator,
//     value: f.value,
//   }));

//   if (searchQuery) {
//     apiFilters.push({
//       field: "description",
//       operator: "contains",
//       value: searchQuery,
//     });
//   }

//   return apiFilters;
// };

// export function useFilteredEvents(
//   timeframe: TimeframeType,
//   searchQuery: string,
//   filters: DashboardFilter[]
// ) {
//   const [events, setEvents] = useState<SecurityEvent[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [totalCount, setTotalCount] = useState(0);

//   const fetchEvents = useCallback(async () => {
//     setLoading(true);

//     try {
//       const payload = {
//         timeframe: mapTimeframe(timeframe),
//         filters: prepareFiltersForAPI(filters, searchQuery),
//       };

//       const response = await fetch(EVENTS_FILTER_API_URL, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         console.error("API Error:", response.status);
//         setLoading(false);
//         return;
//       }

//       const data = await response.json();

//       const parsedEvents = Array.isArray(data.events)
//         ? data.events.map(parseBackendEvent)
//         : [];

//       setEvents(parsedEvents);
//       setTotalCount(data.count ?? parsedEvents.length);
//     } catch (error) {
//       console.error("Error fetching events:", error);
//     } finally {
//       setLoading(false);
//     }
//   }, [timeframe, searchQuery, filters]);

//   useEffect(() => {
//     fetchEvents();
//   }, [fetchEvents]);

//   return { events, loading, totalCount };
// }

import { useState, useEffect, useCallback } from "react";
import {
    SecurityEvent,
    TimeframeType,
    DashboardFilter,
    SeverityLevel,
} from "@/types/security";

const EVENTS_FILTER_API_URL = "http://103.150.227.205:8000/api/threats/events/filter";
// const EVENTS_FILTER_API_URL = "http://127.0.0.1:8000/api/threats/events/filter";

// Map timeframe frontend → backend
const mapTimeframe = (timeframe: TimeframeType): string => {
    const mapping: Record<string, string> = {
        today: "today",
        lastDay: "last24hours",
        lastWeek: "last7days",
        lastMonth: "last30days",
    };
    return mapping[timeframe] ?? "last30days";
};

// ... (fungsi generateStableId dan parseBackendEvent tetap sama)

const generateStableId = (event: any): string => {
    if (event.event_id) return String(event.event_id);

    return [
        event.source_ip ?? "src",
        event.destination_ip ?? "dst",
        event.timestamp ?? "ts",
        event.event_type ?? "evt",
    ].join("-");
};

const parseBackendEvent = (event: any): SecurityEvent => ({
    id: generateStableId(event),
    timestamp: new Date(event.timestamp),
    sourceIP: event.source_ip ?? "Unknown IP",
    destinationIP: event.destination_ip ?? "Unknown IP",
    sourceCountry: event.country ?? "Unknown",
    destinationCountry: event.destination_country ?? "Unknown",
    severity: (event.severity ?? "low").toLowerCase() as SeverityLevel,
    eventType: event.event_type ?? "N/A",
    mitreStage: event.mitre_stages ?? "Unmapped",
    protocol: event.protocol ?? "N/A",
    port: event.port ?? 0,
    application: event.application ?? "N/A",
    description: event.description ?? "No description available",
    rawData: event,
});

// Prepare filters for API
const prepareFiltersForAPI = (
    filters: DashboardFilter[],
    // 🛑 Hapus searchQuery dari sini
) => {
    const apiFilters = filters.map((f) => ({
        field: f.field,
        operator: f.operator,
        value: f.value,
    }));

    // 🛑 Blok ini DIHAPUS agar searchQuery dikirim secara terpisah
    // if (searchQuery) {
    //   apiFilters.push({
    //     field: "description",
    //     operator: "contains",
    //     value: searchQuery,
    //   });
    // }

    return apiFilters;
};

export function useFilteredEvents(
    timeframe: TimeframeType,
    searchQuery: string,
    filters: DashboardFilter[]
) {
    const [events, setEvents] = useState<SecurityEvent[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);

    const fetchEvents = useCallback(async () => {
        setLoading(true);

        try {
            const payload = {
                timeframe: mapTimeframe(timeframe),
                filters: prepareFiltersForAPI(filters),
                // 🆕 TAMBAHKAN search_query UNTUK PENCARIAN UNIVERSAL
                search_query: searchQuery, 
            };

            const response = await fetch(EVENTS_FILTER_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                console.error("API Error:", response.status);
                setLoading(false);
                return;
            }

            const data = await response.json();

            const parsedEvents = Array.isArray(data.events)
                ? data.events.map(parseBackendEvent)
                : [];

            setEvents(parsedEvents);
            setTotalCount(data.count ?? parsedEvents.length);
        } catch (error) {
            console.error("Error fetching events:", error);
        } finally {
            setLoading(false);
        }
    }, [timeframe, searchQuery, filters]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    return { events, loading, totalCount };
}