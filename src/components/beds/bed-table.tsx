import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Bed } from "@/types";

export function BedTable({ items, onEdit, onDelete }: { items: Bed[], onEdit: (i: Bed) => void, onDelete: (i: Bed) => void }) {
  if (items.length === 0) return <div className="p-6 text-center text-muted-foreground">No records found.</div>;
  return (
    <div className="w-full overflow-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b bg-secondary/50">
          <tr>
            <th className="h-10 px-4 font-medium">ID</th>
            <th className="h-10 px-4 font-medium">Ward</th>
            <th className="h-10 px-4 font-medium">Bed Number</th>
            <th className="h-10 px-4 font-medium">Status</th>
            <th className="h-10 px-4 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id} className="border-b transition-colors hover:bg-muted/50">
              <td className="p-4 align-middle font-mono font-medium">#{item.id}</td>
              <td className="p-4 align-middle">{item.ward?.name || item.wardId?.toString()}</td>
              <td className="p-4 align-middle">{item.bedNumber?.toString()}</td>
              <td className="p-4 align-middle capitalize">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.status === 'available' ? 'bg-green-100 text-green-700' : item.status === 'occupied' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-700'}`}>
                  {item.status?.toString()}
                </span>
              </td>
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
