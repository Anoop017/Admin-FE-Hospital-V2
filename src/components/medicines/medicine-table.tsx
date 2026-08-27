import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Medicine } from "@/types";

export function MedicineTable({ items, onEdit, onDelete }: { items: Medicine[], onEdit: (i: Medicine) => void, onDelete: (i: Medicine) => void }) {
  if (items.length === 0) return <div className="p-6 text-center text-muted-foreground">No records found.</div>;
  return (
    <div className="w-full overflow-x-auto touch-pan-x">
      <table className="w-full text-left text-sm min-w-[750px]">
        <thead className="border-b bg-secondary/50">
          <tr>
            <th className="h-10 px-4 font-medium whitespace-nowrap">ID</th>
            <th className="h-10 px-4 font-medium whitespace-nowrap">Name</th>
            <th className="h-10 px-4 font-medium whitespace-nowrap">Manufacturer</th>
            <th className="h-10 px-4 font-medium whitespace-nowrap">Category</th>
            <th className="h-10 px-4 font-medium whitespace-nowrap">Price</th>
            <th className="h-10 px-4 font-medium whitespace-nowrap">Stock Quantity</th>
            <th className="h-10 px-4 font-medium whitespace-nowrap">Expiry Date</th>
            <th className="h-10 px-4 text-right font-medium whitespace-nowrap min-w-[100px]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id} className="border-b transition-colors hover:bg-muted/50">
              <td className="p-4 align-middle font-mono font-medium whitespace-nowrap">#{item.id}</td>
              <td className="p-4 align-middle font-medium text-foreground whitespace-nowrap">{item.name?.toString()}</td>
              <td className="p-4 align-middle whitespace-nowrap">{item.manufacturer?.toString()}</td>
              <td className="p-4 align-middle whitespace-nowrap">{item.category?.toString()}</td>
              <td className="p-4 align-middle whitespace-nowrap font-semibold">${Number(item.price || 0).toFixed(2)}</td>
              <td className="p-4 align-middle whitespace-nowrap">{item.stockQuantity?.toString()}</td>
              <td className="p-4 align-middle whitespace-nowrap text-muted-foreground">{item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : ''}</td>
              <td className="p-4 align-middle text-right whitespace-nowrap">
                <Button variant="ghost" size="icon" onClick={() => onEdit(item)}><Edit className="size-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(item)} className="text-destructive"><Trash2 className="size-4" /></Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
