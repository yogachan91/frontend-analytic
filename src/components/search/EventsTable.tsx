// import { useState } from "react";
// import { SecurityEvent } from "@/types/security";
// import { SeverityBadge } from "@/components/shared/SeverityBadge";
// import { EventDetails } from "./EventDetails";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { ChevronDown, ChevronRight } from "lucide-react";
// import { Button } from "@/components/ui/button";

// interface EventsTableProps {
//   events: SecurityEvent[];
// }

// export function EventsTable({ events }: EventsTableProps) {
//   const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const eventsPerPage = 20;

//   const totalPages = Math.ceil(events.length / eventsPerPage);
//   const startIndex = (currentPage - 1) * eventsPerPage;
//   const paginatedEvents = events.slice(startIndex, startIndex + eventsPerPage);

//   const toggleExpand = (eventId: string) => {
//     setExpandedEventId(expandedEventId === eventId ? null : eventId);
//   };

//   return (
//     <div className="space-y-4">
//       <div className="rounded-lg border border-border overflow-hidden">
//         <Table>
//           <TableHeader>
//             <TableRow className="bg-card/50">
//               <TableHead className="w-10"></TableHead>
//               <TableHead>Timestamp</TableHead>
//               <TableHead>Source IP</TableHead>
//               <TableHead>Destination IP</TableHead>
//               <TableHead>Country</TableHead>
//               <TableHead>Event Type</TableHead>
//               <TableHead>Severity</TableHead>
//               <TableHead>MITRE Stage</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {paginatedEvents.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
//                   No events found
//                 </TableCell>
//               </TableRow>
//             ) : (
//               paginatedEvents.map((event) => (
//                 <>
//                   <TableRow
//                     key={event.id}
//                     className="cursor-pointer hover:bg-muted/50"
//                     onClick={() => toggleExpand(event.id)}
//                   >
//                     <TableCell>
//                       {expandedEventId === event.id ? (
//                         <ChevronDown className="h-4 w-4" />
//                       ) : (
//                         <ChevronRight className="h-4 w-4" />
//                       )}
//                     </TableCell>
//                     <TableCell className="font-mono text-sm">
//                       {event.timestamp.toLocaleString()}
//                     </TableCell>
//                     <TableCell className="font-mono text-sm">
//                       {event.sourceIP}
//                     </TableCell>
//                     <TableCell className="font-mono text-sm">
//                       {event.destinationIP}
//                     </TableCell>
//                     <TableCell>{event.sourceCountry}</TableCell>
//                     <TableCell className="font-semibold">{event.eventType}</TableCell>
//                     <TableCell>
//                       <SeverityBadge severity={event.severity} />
//                     </TableCell>
//                     <TableCell className="capitalize">{event.mitreStage.replace('_', ' ')}</TableCell>
//                   </TableRow>
//                   {expandedEventId === event.id && (
//                     <TableRow>
//                       <TableCell colSpan={8} className="bg-muted/20">
//                         <EventDetails event={event} />
//                       </TableCell>
//                     </TableRow>
//                   )}
//                 </>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="flex items-center justify-between">
//           <div className="text-sm text-muted-foreground">
//             Showing {startIndex + 1} to {Math.min(startIndex + eventsPerPage, events.length)} of{" "}
//             {events.length} events
//           </div>
//           <div className="flex gap-2">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => setCurrentPage(currentPage - 1)}
//               disabled={currentPage === 1}
//             >
//               Previous
//             </Button>
//             <div className="flex items-center gap-1">
//               {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                 let pageNum;
//                 if (totalPages <= 5) {
//                   pageNum = i + 1;
//                 } else if (currentPage <= 3) {
//                   pageNum = i + 1;
//                 } else if (currentPage >= totalPages - 2) {
//                   pageNum = totalPages - 4 + i;
//                 } else {
//                   pageNum = currentPage - 2 + i;
//                 }
                
//                 return (
//                   <Button
//                     key={pageNum}
//                     variant={currentPage === pageNum ? "default" : "outline"}
//                     size="sm"
//                     onClick={() => setCurrentPage(pageNum)}
//                   >
//                     {pageNum}
//                   </Button>
//                 );
//               })}
//             </div>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => setCurrentPage(currentPage + 1)}
//               disabled={currentPage === totalPages}
//             >
//               Next
//             </Button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
import { useState } from "react";
import React from "react"; 
import { SecurityEvent } from "@/types/security";
import { SeverityBadge } from "@/components/shared/SeverityBadge";
import { EventDetails } from "./EventDetails";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronRight } from "lucide-react";

interface EventsTableProps {
  events: SecurityEvent[];
  loading?: boolean;
  totalCount?: number;
}

function formatTimestamp(timestamp: string | Date) {
  const d = new Date(timestamp);

  const pad = (n: number) => n.toString().padStart(2, "0");

  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function EventsTable({ events }: EventsTableProps) {
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 20;

  const totalPages = Math.ceil(events.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const paginatedEvents = events.slice(startIndex, startIndex + eventsPerPage);

  const toggleExpand = (eventId: string) => {
    setExpandedEventId(expandedEventId === eventId ? null : eventId);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-card/50">
              <TableHead className="w-10">ID</TableHead>
              <TableHead></TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Source IP</TableHead>
              <TableHead>Destination IP</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Event Type</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>MITRE Stage</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedEvents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                  No events found
                </TableCell>
              </TableRow>
            ) : (
              paginatedEvents.map((event, index) => {
                const rowId = startIndex + index + 1; // ID urut global

                return (
                  <React.Fragment key={rowId}>
                    <TableRow
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => toggleExpand(String(rowId))}
                    >
                      <TableCell className="font-medium">{rowId}</TableCell>

                      <TableCell>
                        {expandedEventId === String(rowId) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </TableCell>

                      <TableCell>{formatTimestamp(event.timestamp)}</TableCell>
                      <TableCell>{event.sourceIP}</TableCell>
                      <TableCell>{event.destinationIP}</TableCell>
                      <TableCell>{event.sourceCountry}</TableCell>
                      <TableCell>{event.eventType}</TableCell>

                      <TableCell>
                        <SeverityBadge severity={event.severity} />
                      </TableCell>

                      <TableCell>{event.mitreStage}</TableCell>
                    </TableRow>

                    {expandedEventId === String(rowId) && (
                      <TableRow>
                        <TableCell colSpan={9}>
                          <EventDetails event={event} />
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4">
          <button
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Previous
          </button>

          <span>
            Page {currentPage} / {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
