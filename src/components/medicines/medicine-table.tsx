import { Edit, Trash2, Box, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Medicine } from "@/types";
import { formatId, formatCurrency, formatDate } from "@/lib/formatters";

import { MobileTableHint } from "@/components/ui/mobile-table-hint";

export function MedicineTable({
  items,
  onEdit,
  onDelete,
}: {
  items: Medicine[];
  onEdit: (i: Medicine) => void;
  onDelete: (i: Medicine) => void;
}) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="rounded-full bg-muted p-3 mb-3">
          <Box className="size-6 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground">No medicines found</p>
        <p className="text-xs text-muted-foreground mt-1">Add medications to the hospital pharmacy formulary.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <MobileTableHint />
      <div className="w-full overflow-x-auto touch-pan-x">
      <table className="w-full text-left text-sm min-w-[800px]">
        <thead className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <tr>
            <th className="h-10 px-4 whitespace-nowrap">Item Code</th>
            <th className="h-10 px-4 whitespace-nowrap">Medicine Name</th>
            <th className="h-10 px-4 whitespace-nowrap">Manufacturer</th>
            <th className="h-10 px-4 whitespace-nowrap">Therapeutic Category</th>
            <th className="h-10 px-4 whitespace-nowrap">Unit Price</th>
            <th className="h-10 px-4 whitespace-nowrap">Inventory Stock</th>
            <th className="h-10 px-4 whitespace-nowrap">Expiry Date</th>
            <th className="h-10 px-4 text-right whitespace-nowrap min-w-[100px]">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {items.map((item) => {
            const stock = Number(item.stockQuantity || 0);
            const isLowStock = stock <= 15;
            const isOutOfStock = stock === 0;

            const isExpired = item.expiryDate && new Date(item.expiryDate) < new Date();

            return (
              <tr key={item.id} className="transition-colors hover:bg-muted/30">
                <td className="p-4 align-middle">
                  <Badge variant="outline" className="font-mono font-medium text-xs bg-muted/50">
                    {formatId("medicine", item.id)}
                  </Badge>
                </td>

                <td className="p-4 align-middle font-semibold text-foreground whitespace-nowrap">
                  {item.name}
                </td>

                <td className="p-4 align-middle text-xs text-muted-foreground whitespace-nowrap">
                  {item.manufacturer || "Generic"}
                </td>

                <td className="p-4 align-middle whitespace-nowrap">
                  <Badge variant="outline" className="text-xs font-normal">
                    {item.category || "Pharmacy"}
                  </Badge>
                </td>

                <td className="p-4 align-middle whitespace-nowrap font-semibold text-foreground">
                  {formatCurrency(item.price)}
                </td>

                <td className="p-4 align-middle whitespace-nowrap">
                  <Badge
                    variant={isOutOfStock ? "destructive" : isLowStock ? "outline" : "secondary"}
                    className={
                      isOutOfStock
                        ? ""
                        : isLowStock
                        ? "bg-amber-500/10 text-amber-600 border-amber-500/30 gap-1"
                        : "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 font-mono"
                    }
                  >
                    {isLowStock && !isOutOfStock && <AlertTriangle className="size-3" />}
                    {stock} Units {isOutOfStock ? "(Depleted)" : isLowStock ? "(Low Stock)" : ""}
                  </Badge>
                </td>

                <td className="p-4 align-middle whitespace-nowrap text-xs">
                  <span className={isExpired ? "text-destructive font-semibold" : "text-muted-foreground"}>
                    {formatDate(item.expiryDate)}
                    {isExpired && " (Expired)"}
                  </span>
                </td>

                <td className="p-4 align-middle text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground hover:text-foreground"
                      onClick={() => onEdit(item)}
                      title="Edit Medicine"
                    >
                      <Edit className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground hover:text-destructive"
                      onClick={() => onDelete(item)}
                      title="Delete Medicine"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
  );
}
