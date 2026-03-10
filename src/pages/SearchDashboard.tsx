// import { useState, useEffect } from "react";
// import { useSearchParams } from "react-router-dom";
// import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
// import { SearchBar } from "@/components/search/SearchBar";
// import { FilterPanel } from "@/components/search/FilterPanel";
// import { EventsTable } from "@/components/search/EventsTable";
// import { useTimeframe } from "@/hooks/useTimeframe";
// import { useRealtimeData } from "@/hooks/useRealtimeData";
// import { parseFiltersFromURL } from "@/utils/navigation";
// import { DashboardFilter, SecurityEvent } from "@/types/security";

// const SearchDashboard = () => {
//   const { timeframe, isRealtime, setTimeframe } = useTimeframe();
//   const { events } = useRealtimeData(isRealtime);
//   const [searchParams] = useSearchParams();
  
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filters, setFilters] = useState<DashboardFilter[]>([]);
//   const [filteredEvents, setFilteredEvents] = useState<SecurityEvent[]>(events);

//   // Parse filters from URL on mount
//   useEffect(() => {
//     const urlFilters = parseFiltersFromURL(searchParams);
//     if (urlFilters.length > 0) {
//       setFilters(urlFilters);
//     }
//   }, [searchParams]);

//   // Apply filters and search
//   useEffect(() => {
//     let result = [...events];

//     // Apply search query
//     if (searchQuery) {
//       const query = searchQuery.toLowerCase();
//       result = result.filter(event =>
//         event.sourceIP.toLowerCase().includes(query) ||
//         event.destinationIP.toLowerCase().includes(query) ||
//         event.sourceCountry.toLowerCase().includes(query) ||
//         event.eventType.toLowerCase().includes(query) ||
//         event.description.toLowerCase().includes(query)
//       );
//     }

//     // Apply filters
//     filters.forEach(filter => {
//       result = result.filter(event => {
//         const value = (event as any)[filter.field];
//         const filterValue = filter.value.toLowerCase();

//         switch (filter.operator) {
//           case "is":
//             return String(value).toLowerCase() === filterValue;
//           case "is_not":
//             return String(value).toLowerCase() !== filterValue;
//           case "contains":
//             return String(value).toLowerCase().includes(filterValue);
//           case "exists":
//             return value !== null && value !== undefined;
//           case "greater_than":
//             return Number(value) > Number(filter.value);
//           case "less_than":
//             return Number(value) < Number(filter.value);
//           default:
//             return true;
//         }
//       });
//     });

//     setFilteredEvents(result);
//   }, [events, searchQuery, filters]);

//   return (
//     <DashboardLayout
//       timeframe={timeframe}
//       onTimeframeChange={setTimeframe}
//       isRealtime={isRealtime}
//     >
//       <div className="space-y-6">
//         <h2 className="text-2xl font-bold text-foreground">Search Events</h2>

//         {/* Search and Filters */}
//         <div className="space-y-4">
//           <SearchBar value={searchQuery} onChange={setSearchQuery} />
//           <FilterPanel filters={filters} onFiltersChange={setFilters} />
//         </div>

//         {/* Results */}
//         <div className="space-y-2">
//           <div className="text-sm text-muted-foreground">
//             Found {filteredEvents.length} events
//           </div>
//           <EventsTable events={filteredEvents} />
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default SearchDashboard;

// import { useState, useEffect } from "react";
// import { useSearchParams } from "react-router-dom";
// import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
// import { SearchBar } from "@/components/search/SearchBar";
// import { FilterPanel } from "@/components/search/FilterPanel";
// import { EventsTable } from "@/components/search/EventsTable";
// import { useTimeframe } from "@/hooks/useTimeframe";
// // import { useRealtimeData } from "@/hooks/useRealtimeData"; // Hapus hook ini
// import { useFilteredEvents } from "@/hooks/useFilteredEvents"; // <-- Panggil hook baru
// import { parseFiltersFromURL } from "@/utils/navigation";
// import { DashboardFilter } from "@/types/security";

// const SearchDashboard = () => {
//   // useTimeframe() menyediakan timeframe dan setTimeframe, tetapi isRealtime tidak dipakai di sini.
//   const { timeframe, setTimeframe } = useTimeframe(); 
//   const [searchParams] = useSearchParams();
//   
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filters, setFilters] = useState<DashboardFilter[]>([]);
//   
//   // 🛑 GANTI: Mengganti logika filter sisi klien dengan API hook
//   // Kita menggunakan useFilteredEvents untuk mengambil data yang sudah difilter dari backend
//   const { events: filteredEvents, loading, totalCount } = useFilteredEvents(
//     timeframe, 
//     searchQuery, 
//     filters
//   );

//   // Parse filters from URL on mount
//   useEffect(() => {
//     const urlFilters = parseFiltersFromURL(searchParams);
//     if (urlFilters.length > 0) {
//       setFilters(urlFilters);
//     }
//   }, [searchParams]);

//   // 🛑 HAPUS: Hapus useEffect ini karena filtering kini dilakukan oleh backend melalui useFilteredEvents
//   // useEffect(() => {
//   //   let result = [...events];
//   //   // ... (semua logika filtering dihapus)
//   //   setFilteredEvents(result);
//   // }, [events, searchQuery, filters]);


//   return (
//     <DashboardLayout
//       timeframe={timeframe}
//       onTimeframeChange={setTimeframe}
//       // isRealtime diset ke false di Search Dashboard karena ini mode Historical/Search
//       isRealtime={false} 
//       // Tambahkan status loading jika Anda ingin menampilkannya
//       connectionStatus={loading ? "connecting" : "connected"}
//     >
//       <div className="space-y-6">
//         <h2 className="text-2xl font-bold text-foreground">Search Events</h2>

//         {/* Search and Filters */}
//         <div className="space-y-4">
//           <SearchBar value={searchQuery} onChange={setSearchQuery} />
//           <FilterPanel filters={filters} onFiltersChange={setFilters} />
//         </div>

//         {/* Results */}
//         <div className="space-y-2">
//           <div className="text-sm text-muted-foreground">
//             Found {totalCount} events {loading && "(Loading...)"}
//           </div>
//           <EventsTable events={filteredEvents} />
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default SearchDashboard;

// import { useState, useEffect } from "react";
// import { useSearchParams } from "react-router-dom";
// import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
// import { SearchBar } from "@/components/search/SearchBar";
// import { FilterPanel } from "@/components/search/FilterPanel";
// import { EventsTable } from "@/components/search/EventsTable";

// import { useTimeframe } from "@/hooks/useTimeframe";
// import { useFilteredEvents } from "@/hooks/useFilteredEvents";
// import { parseFiltersFromURL } from "@/utils/navigation";
// import { DashboardFilter } from "@/types/security";

// const SearchDashboard = () => {
//   const { timeframe, setTimeframe } = useTimeframe();
//   const [searchParams] = useSearchParams();

//   const [searchQuery, setSearchQuery] = useState("");
//   const [filters, setFilters] = useState<DashboardFilter[]>([]);

//   // Ambil data dari backend dengan hook baru
//   const { events: filteredEvents, loading, totalCount } = useFilteredEvents(
//     timeframe,
//     searchQuery,
//     filters
//   );

//   // Parse filters dari URL hanya saat halaman pertama kali dibuka
//   useEffect(() => {
//     const urlFilters = parseFiltersFromURL(searchParams);
//     if (urlFilters.length > 0) {
//       setFilters(urlFilters);
//     }
//   }, [searchParams]);

//   return (
//     <DashboardLayout
//       timeframe={timeframe}
//       onTimeframeChange={setTimeframe}
//       isRealtime={false} // Search mode = historical mode
//       connectionStatus={loading ? "connecting" : "connected"}
//     >
//       <div className="space-y-6">
//         <h2 className="text-2xl font-bold text-foreground">Search Events</h2>

//         {/* Search + Filters */}
//         <div className="space-y-4">
//           <SearchBar 
//             value={searchQuery}
//             onChange={setSearchQuery}
//             placeholder="Search by IP, event type, description..."
//           />

//           <FilterPanel 
//             filters={filters}
//             onFiltersChange={setFilters}
//           />
//         </div>

//         {/* Table Section */}
//         <EventsTable 
//           events={filteredEvents}
//           loading={loading}
//           totalCount={totalCount}
//         />
//       </div>
//     </DashboardLayout>
//   );
// };

// export default SearchDashboard;

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { SearchBar } from "@/components/search/SearchBar";
import { FilterPanel } from "@/components/search/FilterPanel";
import { EventsTable } from "@/components/search/EventsTable";

import { useTimeframe } from "@/hooks/useTimeframe";
import { useFilteredEvents } from "@/hooks/useFilteredEvents";
import { parseFiltersFromURL } from "@/utils/navigation";
import { DashboardFilter, LogicType } from "@/types/security";
import { Loader2 } from "lucide-react";

const SearchDashboard = () => {
  const { timeframe, setTimeframe } = useTimeframe();
  const [searchParams] = useSearchParams();

  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<DashboardFilter[]>([]);

  // 🔥 STATE BARU: AND / OR (DEFAULT AND)
  const [operatorLogic, setOperatorLogic] = useState<LogicType>("AND");

  // LOGIKA DEBOUNCE:
  // Menunggu user berhenti mengetik selama 500ms sebelum memperbarui searchQuery
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchQuery(inputValue);
    }, 3000);

    return () => clearTimeout(delayDebounceFn);
  }, [inputValue]);
  
  // Ambil data dari backend dengan hook baru
  const {
    events: filteredEvents,
    loading,
    totalCount,
  } = useFilteredEvents(
    timeframe,
    searchQuery,
    filters,
    operatorLogic // 🔥 KIRIM KE BACKEND
  );

  // Parse filters dari URL hanya saat halaman pertama kali dibuka
  useEffect(() => {
    const urlLogic = searchParams.get("logic") as LogicType;
    if (urlLogic) {
      setOperatorLogic(urlLogic);
    }
    
    const urlFilters = parseFiltersFromURL(searchParams);
    if (urlFilters.length > 0) {
      setFilters(urlFilters);
    }
  }, [searchParams]);

  return (
    <DashboardLayout
      timeframe={timeframe}
      onTimeframeChange={setTimeframe}
      isRealtime={false}
      connectionStatus={loading ? "connecting" : "connected"}
    >
      {loading && (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-sm font-medium">Filtering Events...</p>
        </div>
      </div>
      )}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Search Events</h2>

        {/* Search + Filters */}
        <div className="space-y-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by IP, event type, description..."
          />

          <FilterPanel
            filters={filters}
            operatorLogic={operatorLogic}     // ✅ FIX
            onFiltersChange={setFilters}
            onLogicChange={setOperatorLogic} // ✅ FIX
          />
        </div>

        {/* Table Section */}
        <EventsTable
          events={filteredEvents}
          loading={loading}
          totalCount={totalCount}
        />
      </div>
    </DashboardLayout>
  );
};

export default SearchDashboard;

