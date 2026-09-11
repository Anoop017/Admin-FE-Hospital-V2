import { Edit, Trash2, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Department } from "@/types";
import { formatId } from "@/lib/formatters";

import { MobileTableHint } from "@/components/ui/mobile-table-hint";

export function DepartmentTable({
  items,
  onEdit,
  onDelete,
}: {
  items: Department[];
  onEdit: (i: Department) => void;
  onDelete: (i: Department) => void;
}) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="rounded-full bg-muted p-3 mb-3">
          <Building2 className="size-6 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground">No clinical departments found</p>
        <p className="text-xs text-muted-foreground mt-1">Create a department (Cardiology, Pediatrics, Oncology, etc.) to group doctors and wards.</p>
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
            <th className="h-10 px-4 whitespace-nowrap">Dept Code</th>
            <th className="h-10 px-4 whitespace-nowrap">Department Name</th>
            <th className="h-10 px-4 whitespace-nowrap">Scope & Description</th>
            <th className="h-10 px-4 text-right whitespace-nowrap min-w-[100px]">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {items.map((item) => (
            <tr key={item.id} className="transition-colors hover:bg-muted/30">
              <td className="p-4 align-middle">
                <Badge variant="outline" className="font-mono font-medium text-xs bg-muted/50">
                  {formatId("department", item.id)}
                </Badge>
              </td>
              <td className="p-4 align-middle">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                    <Building2 className="size-4" />
                  </div>
                  <span className="font-semibold text-foreground">{item.name}</span>
                </div>
              </td>
              <td className="p-4 align-middle max-w-[350px] text-xs text-muted-foreground">
                {item.description || "General hospital department services."}
              </td>
              <td className="p-4 align-middle text-right whitespace-nowrap">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-muted-foreground hover:text-foreground"
                    onClick={() => onEdit(item)}
                    title="Edit Department"
                  >
                    <Edit className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-muted-foreground hover:text-destructive"
                    onClick={() => onDelete(item)}
                    title="Delete Department"
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
