import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

type ConnectionStatus = "connecting" | "connected" | "disconnected";

interface RealtimeIndicatorProps {
  isActive: boolean;
  connectionStatus?: ConnectionStatus;
  lastUpdate?: Date | null;
  className?: string;
}

export function RealtimeIndicator({ 
  isActive, 
  connectionStatus = "disconnected",
  lastUpdate,
  className 
}: RealtimeIndicatorProps) {
  const getStatusDisplay = () => {
    if (!isActive) {
      return { color: "text-muted-foreground", bgColor: "bg-muted-foreground/50", label: "Paused", showPing: false };
    }
    
    switch (connectionStatus) {
      case "connected":
        return { color: "text-primary", bgColor: "bg-primary", label: "Live", showPing: true };
      case "connecting":
        return { color: "text-yellow-500", bgColor: "bg-yellow-500", label: "Connecting", showPing: false };
      case "disconnected":
        return { color: "text-destructive", bgColor: "bg-destructive", label: "Disconnected", showPing: false };
    }
  };

  const status = getStatusDisplay();

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative flex h-3 w-3">
        {status.showPing && (
          <>
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
          </>
        )}
        {!status.showPing && (
          <span className={cn("relative inline-flex rounded-full h-3 w-3", status.bgColor)} />
        )}
      </div>
      <Activity className={cn("h-4 w-4", status.color)} />
      <div className="flex flex-col">
        <span className={cn("text-sm font-medium", status.color)}>
          {status.label}
        </span>
        {lastUpdate && isActive && connectionStatus === "connected" && (
          <span className="text-xs text-muted-foreground">
            Updated {formatDistanceToNow(lastUpdate, { addSuffix: true })}
          </span>
        )}
      </div>
    </div>
  );
}
