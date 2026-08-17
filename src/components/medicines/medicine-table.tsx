import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Medicine } from "@/types";

export function MedicineTable({ items, onEdit, onDelete }: { items: Medicine[], onEdit: (i: Medicine) => void, onDelete: (i: Medicine) => void }) {
  if (items.length === 0) return <div className="p-6 text-center text-muted-foreground">No records found.</div>;
  return (
    <div className="w-full overflow-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b bg-secondary/50">
          <tr>
            <th className="h-10 px-4 font-medium">ID</th>
            <th className="h-10 px-4 font-medium">Name</th>
            <th className="h-10 px-4 font-medium">Manufacturer</th>
            <th className="h-10 px-4 font-medium">Category</th>
            <th className="h-10 px-4 font-medium">Price</th>
            <th className="h-10 px-4 font-medium">Stock Quantity</th>
            <th className="h-10 px-4 font-medium">Expiry Date</th>
            <th className="h-10 px-4 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id} className="border-b transition-colors hover:bg-muted/50">
              <td className="p-4 align-middle">{item.id?.substring(0,8)}...</td>
              <td className="p-4 align-middle">{item.name?.toString()}</td>
              <td className="p-4 align-middle">{item.manufacturer?.toString()}</td>
              <td className="p-4 align-middle">{item.category?.toString()}</td>
              <td className="p-4 align-middle">${Number(item.price || 0).toFixed(2)}</td>
              <td className="p-4 align-middle">{item.stockQuantity?.toString()}</td>
              <td className="p-4 align-middle">{item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : ''}</td>
              <td className="p-4 align-middle text-right">
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
