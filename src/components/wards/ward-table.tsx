import { Edit, Trash2, Building2, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Ward } from "@/types";
import { formatId } from "@/lib/formatters";

import { MobileTableHint } from "@/components/ui/mobile-table-hint";

export function WardTable({
  items,
  onEdit,
  onDelete,
}: {
  items: Ward[];
  onEdit: (i: Ward) => void;
  onDelete: (i: Ward) => void;
}) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="rounded-full bg-muted p-3 mb-3">
          <Layers className="size-6 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground">No hospital wards found</p>
        <p className="text-xs text-muted-foreground mt-1">Configure hospital wards (e.g. ICU, General, Pediatric, Maternity).</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <MobileTableHint />
      <div className="w-full overflow-x-auto touch-pan-x">
      <table className="w-full text-left text-sm min-w-[650px]">
        <thead className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <tr>
            <th className="h-10 px-4 whitespace-nowrap">Ward Code</th>
            <th className="h-10 px-4 whitespace-nowrap">Ward Name</th>
            <th className="h-10 px-4 whitespace-nowrap">Classification</th>
            <th className="h-10 px-4 whitespace-nowrap">Bed Capacity</th>
            <th className="h-10 px-4 whitespace-nowrap">Floor Location</th>
            <th className="h-10 px-4 text-right whitespace-nowrap min-w-[100px]">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {items.map((item) => (
            <tr key={item.id} className="transition-colors hover:bg-muted/30">
              <td className="p-4 align-middle">
                <Badge variant="outline" className="font-mono font-medium text-xs bg-muted/50">
                  {formatId("ward", item.id)}
                </Badge>
              </td>

              <td className="p-4 align-middle font-medium text-foreground whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-primary/10 text-primary">
                    <Building2 className="size-3.5" />
                  </div>
                  <span>{item.name}</span>
                </div>
              </td>

              <td className="p-4 align-middle whitespace-nowrap capitalize">
                <Badge variant="outline" className="text-xs font-normal">
                  {item.type || "General"}
                </Badge>
              </td>

              <td className="p-4 align-middle whitespace-nowrap text-xs font-medium text-foreground">
                <span className="font-mono font-semibold">{item.capacity || 0}</span> Beds
              </td>

              <td className="p-4 align-middle whitespace-nowrap text-xs text-muted-foreground">
                {item.floor ? `Floor ${item.floor}` : "Ground Floor"}
              </td>

              <td className="p-4 align-middle text-right whitespace-nowrap">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-muted-foreground hover:text-foreground"
                    onClick={() => onEdit(item)}
                    title="Edit Ward"
                  >
                    <Edit className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-muted-foreground hover:text-destructive"
                    onClick={() => onDelete(item)}
                    title="Delete Ward"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  );
}
