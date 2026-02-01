// import { useState } from "react";
// import { Plus, X } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { DashboardFilter } from "@/types/security";
// import { Badge } from "@/components/ui/badge";

// interface FilterPanelProps {
//   filters: DashboardFilter[];
//   onFiltersChange: (filters: DashboardFilter[]) => void;
// }

// const fields = [
//   { value: "source_ip", label: "Source IP" },
//   { value: "destination_ip", label: "Destination IP" },
//   { value: "country", label: "Source Country" },
//   { value: "destination_country", label: "Destination Country" },
//   { value: "severity", label: "Severity" },
//   { value: "event_type", label: "Event Type" },
//   { value: "mitre_stages", label: "MITRE Stage" },
//   { value: "protocol", label: "Protocol" },
//   { value: "port", label: "Port" },
//   { value: "application", label: "Application" },
// ];

// const operators = [
//   { value: "is", label: "is" },
//   { value: "is_not", label: "is not" },
//   { value: "contains", label: "contains" },
//   { value: "exists", label: "exists" },
//   { value: ">", label: ">" },
//   { value: "<", label: "<" },
// ];

// export function FilterPanel({ filters, onFiltersChange }: FilterPanelProps) {
//   const [isAddingFilter, setIsAddingFilter] = useState(false);
//   const [newFilter, setNewFilter] = useState<DashboardFilter>({
//     field: "source_ip",
//     operator: "is",
//     value: "",
//   });

//   const handleAddFilter = () => {
//     if (newFilter.value || newFilter.operator === "exists") {
//       onFiltersChange([...filters, newFilter]);
//       setNewFilter({ field: "source_ip", operator: "is", value: "" });
//       setIsAddingFilter(false);
//     }
//   };

//   const handleRemoveFilter = (index: number) => {
//     onFiltersChange(filters.filter((_, i) => i !== index));
//   };

//   return (
//     <div className="space-y-3">
//       {/* Active Filters */}
//       {filters.length > 0 && (
//         <div className="flex flex-wrap gap-2">
//           {filters.map((filter, index) => (
//             <Badge
//               key={index}
//               variant="secondary"
//               className="gap-2 pr-1 text-sm"
//             >
//               <span className="font-semibold">{filter.field}</span>
//               <span className="text-muted-foreground">{filter.operator}</span>
//               {filter.operator !== "exists" && (
//                 <span className="font-mono">{filter.value}</span>
//               )}
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="h-4 w-4 hover:bg-destructive/20"
//                 onClick={() => handleRemoveFilter(index)}
//               >
//                 <X className="h-3 w-3" />
//               </Button>
//             </Badge>
//           ))}
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={() => onFiltersChange([])}
//             className="h-7"
//           >
//             Clear all
//           </Button>
//         </div>
//       )}

//       {/* Add Filter Button */}
//       {!isAddingFilter && (
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => setIsAddingFilter(true)}
//           className="gap-2"
//         >
//           <Plus className="h-4 w-4" />
//           Add Filter
//         </Button>
//       )}

//       {/* Add Filter Form */}
//       {isAddingFilter && (
//         <div className="flex flex-wrap gap-2 items-end p-4 rounded-lg border border-border bg-card/50">
//           <div className="flex-1 min-w-[150px] space-y-1">
//             <label className="text-xs text-muted-foreground">Field</label>
//             <Select
//               value={newFilter.field}
//               onValueChange={(value) =>
//                 setNewFilter({ ...newFilter, field: value })
//               }
//             >
//               <SelectTrigger>
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 {fields.map((field) => (
//                   <SelectItem key={field.value} value={field.value}>
//                     {field.label}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="flex-1 min-w-[120px] space-y-1">
//             <label className="text-xs text-muted-foreground">Operator</label>
//             <Select
//               value={newFilter.operator}
//               onValueChange={(value: any) =>
//                 setNewFilter({ ...newFilter, operator: value })
//               }
//             >
//               <SelectTrigger>
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 {operators.map((op) => (
//                   <SelectItem key={op.value} value={op.value}>
//                     {op.label}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           {newFilter.operator !== "exists" && (
//             <div className="flex-1 min-w-[150px] space-y-1">
//               <label className="text-xs text-muted-foreground">Value</label>
//               <Input
//                 value={newFilter.value}
//                 onChange={(e) =>
//                   setNewFilter({ ...newFilter, value: e.target.value })
//                 }
//                 placeholder="Enter value"
//               />
//             </div>
//           )}

//           <div className="flex gap-2">
//             <Button onClick={handleAddFilter} size="sm">
//               Add
//             </Button>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => {
//                 setIsAddingFilter(false);
//                 setNewFilter({ field: "source_ip", operator: "is", value: "" });
//               }}
//             >
//               Cancel
//             </Button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DashboardFilter, LogicType } from "@/types/security";
import { Badge } from "@/components/ui/badge";

interface FilterPanelProps {
  filters: DashboardFilter[];
  operatorLogic: LogicType | null;
  onFiltersChange: (filters: DashboardFilter[]) => void;
  onLogicChange: (logic: LogicType) => void;
}

const fields = [
  { value: "source_ip", label: "Source IP" },
  { value: "destination_ip", label: "Destination IP" },
  { value: "country", label: "Source Country" },
  { value: "destination_country", label: "Destination Country" },
  { value: "severity", label: "Severity" },
  { value: "event_type", label: "Event Type" },
  { value: "mitre_stages", label: "MITRE Stage" },
  { value: "protocol", label: "Protocol" },
  { value: "port", label: "Port" },
  { value: "application", label: "Application" },
];

const operators = [
  { value: "is", label: "is" },
  { value: "is_not", label: "is not" },
  { value: "contains", label: "contains" },
  { value: "exists", label: "exists" },
  { value: "greater_than", label: ">" },
  { value: "less_than", label: "<" },
];

export function FilterPanel({
  filters,
  operatorLogic,
  onFiltersChange,
  onLogicChange,
}: FilterPanelProps) {
  const [isAddingFilter, setIsAddingFilter] = useState(false);
  const [showLogicSelector, setShowLogicSelector] = useState(false);

  // 🔒 MENANDAI APAKAH LOGIC SUDAH DIPILIH USER (TAHAP 2)
  const [logicLocked, setLogicLocked] = useState(false);

  const [newFilter, setNewFilter] = useState<DashboardFilter>({
    field: "source_ip",
    operator: "is",
    value: "",
  });

  const handleAddFilter = () => {
    if (newFilter.value || newFilter.operator === "exists") {
      onFiltersChange([...filters, newFilter]);
      setNewFilter({ field: "source_ip", operator: "is", value: "" });
      setIsAddingFilter(false);
    }
  };

  const handleRemoveFilter = (index: number) => {
    const updated = filters.filter((_, i) => i !== index);
    onFiltersChange(updated);

    // Jika filter dikurangi sampai < 2 → buka kunci logic
    if (updated.length < 2) {
      setLogicLocked(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* ================= ACTIVE FILTERS ================= */}
      {filters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.map((filter, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="gap-2 pr-1 text-sm"
            >
              <span className="font-semibold">{filter.field}</span>
              <span className="text-muted-foreground">{filter.operator}</span>
              {filter.operator !== "exists" && (
                <span className="font-mono">{filter.value}</span>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 hover:bg-destructive/20"
                onClick={() => handleRemoveFilter(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onFiltersChange([]);
              setLogicLocked(false);
            }}
            className="h-7"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* ================= ADD FILTER BUTTON ================= */}
      {!isAddingFilter && (
        <>
          {/* TAHAP 1 */}
          {filters.length === 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddingFilter(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Filter
            </Button>
          )}

          {/* TAHAP 2 (PILIH AND / OR – SEKALI) */}
          {filters.length === 1 && !logicLocked && (
            <div className="relative inline-block">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLogicSelector((p) => !p)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Filter
              </Button>

              {showLogicSelector && (
                <div className="absolute z-10 mt-2 w-40 rounded-md border bg-background shadow-md">
                  {(["AND", "OR"] as LogicType[]).map((logic) => (
                    <button
                      key={logic}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-muted"
                      onClick={() => {
                        onLogicChange(logic); // pilih logic
                        setLogicLocked(true); // 🔒 KUNCI
                        setShowLogicSelector(false);
                        setIsAddingFilter(true);
                      }}
                    >
                      Add Filter ({logic})
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAHAP 3+ (TERKUNCI) */}
          {(filters.length >= 2 || logicLocked) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddingFilter(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Filter ({operatorLogic ?? "AND"})
            </Button>
          )}
        </>
      )}

      {/* ================= ADD FILTER FORM ================= */}
      {isAddingFilter && (
        <div className="flex flex-wrap gap-2 items-end p-4 rounded-lg border border-border bg-card/50">
          <div className="flex-1 min-w-[150px] space-y-1">
            <label className="text-xs text-muted-foreground">Field</label>
            <Select
              value={newFilter.field}
              onValueChange={(value) =>
                setNewFilter({ ...newFilter, field: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fields.map((field) => (
                  <SelectItem key={field.value} value={field.value}>
                    {field.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[120px] space-y-1">
            <label className="text-xs text-muted-foreground">Operator</label>
            <Select
              value={newFilter.operator}
              onValueChange={(value: any) =>
                setNewFilter({ ...newFilter, operator: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {operators.map((op) => (
                  <SelectItem key={op.value} value={op.value}>
                    {op.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {newFilter.operator !== "exists" && (
            <div className="flex-1 min-w-[150px] space-y-1">
              <label className="text-xs text-muted-foreground">Value</label>
              <Input
                value={newFilter.value}
                onChange={(e) =>
                  setNewFilter({ ...newFilter, value: e.target.value })
                }
                placeholder="Enter value"
              />
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={handleAddFilter} size="sm">
              Add
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsAddingFilter(false);
                setNewFilter({
                  field: "source_ip",
                  operator: "is",
                  value: "",
                });
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}


