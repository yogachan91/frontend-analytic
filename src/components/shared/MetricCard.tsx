import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function MetricCard({ title, icon: Icon, children, className, onClick }: MetricCardProps) {
  return (
    <Card 
      className={cn(
        "bg-card border-border transition-all hover:border-primary/50 flex flex-col h-full",
        onClick && "cursor-pointer hover:shadow-lg",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="p-2 pb-1 flex-shrink-0">
        <CardTitle className="flex items-center gap-2 text-sm">
          {Icon && <Icon className="h-4 w-4 text-primary" />}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 pt-0 flex-1 overflow-auto">{children}</CardContent>
    </Card>
  );
}
