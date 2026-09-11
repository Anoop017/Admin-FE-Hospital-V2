import { Edit, Trash2, BedDouble, CheckCircle2, AlertCircle, Wrench, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Bed } from "@/types";
import { formatId } from "@/lib/formatters";
import { MobileTableHint } from "@/components/ui/mobile-table-hint";

export function BedTable({
  items,
  onEdit,
  onDelete,
}: {
  items: Bed[];
  onEdit: (i: Bed) => void;
  onDelete: (i: Bed) => void;
}) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="rounded-full bg-muted p-3 mb-3">
          <BedDouble className="size-6 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground">No hospital beds found</p>
        <p className="text-xs text-muted-foreground mt-1">Configure hospital wards and beds to track capacity.</p>
      </div>
    );
  }

  const getStatusBadge = (status: string | undefined) => {
    switch (status?.toLowerCase()) {
      case "available":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 gap-1">
            <CheckCircle2 className="size-3" /> Available
          </Badge>
        );
      case "occupied":
        return (
          <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/30 gap-1">
            <User className="size-3" /> Occupied
          </Badge>
        );
      case "maintenance":
        return (
          <Badge className="bg-rose-500/10 text-rose-600 border-rose-500/30 gap-1">
            <Wrench className="size-3" /> Maintenance
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="capitalize">
            {status || "Available"}
          </Badge>
        );
    }
  };

  return (
    <div className="w-full">
      <MobileTableHint />
      <div className="w-full overflow-x-auto touch-pan-x">
        <table className="w-full text-left text-sm min-w-[650px]">
          <thead className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <tr>
              <th className="h-10 px-4 whitespace-nowrap">Bed ID</th>
              <th className="h-10 px-4 whitespace-nowrap">Assigned Ward</th>
              <th className="h-10 px-4 whitespace-nowrap">Bed Number</th>
              <th className="h-10 px-4 whitespace-nowrap">Current Status</th>
              <th className="h-10 px-4 text-right whitespace-nowrap min-w-[100px]">Actions</th>
            </tr>
          </thead>
        <tbody className="divide-y divide-border">
          {items.map((item) => (
            <tr key={item.id} className="transition-colors hover:bg-muted/30">
              <td className="p-4 align-middle">
                <Badge variant="outline" className="font-mono font-medium text-xs bg-muted/50">
                  {formatId("bed", item.id)}
                </Badge>
              </td>

              <td className="p-4 align-middle font-medium text-foreground whitespace-nowrap">
                {item.ward?.name || (item.wardId ? `Ward #${item.wardId}` : "General Ward")}
              </td>

              <td className="p-4 align-middle whitespace-nowrap">
                <div className="flex items-center gap-1.5 font-mono font-semibold text-foreground">
                  <BedDouble className="size-4 text-primary" />
                  <span>Bed {item.bedNumber}</span>
                </div>
              </td>

              <td className="p-4 align-middle whitespace-nowrap">
                {getStatusBadge(item.status)}
              </td>

              <td className="p-4 align-middle text-right whitespace-nowrap">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-muted-foreground hover:text-foreground"
                    onClick={() => onEdit(item)}
                    title="Edit Bed"
                  >
                    <Edit className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-muted-foreground hover:text-destructive"
                    onClick={() => onDelete(item)}
                    title="Delete Bed"
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
