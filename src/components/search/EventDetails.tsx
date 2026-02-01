import { SecurityEvent } from "@/types/security";
import { Badge } from "@/components/ui/badge";

interface EventDetailsProps {
  event: SecurityEvent;
}

export function EventDetails({ event }: EventDetailsProps) {
  return (
    <div className="p-4 space-y-4">
      {/* Event Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground">Event ID</div>
          <div className="font-mono text-sm">{event.id}</div>
        </div>

        <div className="space-y-1">
          <div className="text-xs text-muted-foreground">Protocol</div>
          <Badge variant="outline">{event.protocol}</Badge>
        </div>

        <div className="space-y-1">
          <div className="text-xs text-muted-foreground">Port</div>
          <div className="font-mono text-sm">{event.port}</div>
        </div>

        <div className="space-y-1">
          <div className="text-xs text-muted-foreground">Application</div>
          <Badge variant="secondary">{event.application}</Badge>
        </div>

        <div className="space-y-1">
          <div className="text-xs text-muted-foreground">Destination Country</div>
          <div className="text-sm">{event.destinationCountry}</div>
        </div>

        <div className="space-y-1">
          <div className="text-xs text-muted-foreground">MITRE Stage</div>
          <div className="text-sm capitalize">{event.mitreStage.replace('_', ' ')}</div>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-1">
        <div className="text-xs text-muted-foreground">Description</div>
        <div className="text-sm">{event.description}</div>
      </div>

      {/* Raw Event Data */}
      <div className="space-y-1">
        <div className="text-xs text-muted-foreground">Raw Event Data</div>
        <pre className="p-3 rounded bg-muted text-xs overflow-x-auto">
          {JSON.stringify(event.rawData, null, 2)}
        </pre>
      </div>
    </div>
  );
}
