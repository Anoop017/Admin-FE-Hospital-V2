import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Ward } from "@/types";

export function WardTable({ items, onEdit, onDelete }: { items: Ward[], onEdit: (i: Ward) => void, onDelete: (i: Ward) => void }) {
  if (items.length === 0) return <div className="p-6 text-center text-muted-foreground">No records found.</div>;
  return (
    <div className="w-full overflow-x-auto touch-pan-x">
      <table className="w-full text-left text-sm min-w-[650px]">
        <thead className="border-b bg-secondary/50">
          <tr>
            <th className="h-10 px-4 font-medium whitespace-nowrap">ID</th>
            <th className="h-10 px-4 font-medium capitalize whitespace-nowrap">Name</th>
            <th className="h-10 px-4 font-medium capitalize whitespace-nowrap">Type</th>
            <th className="h-10 px-4 font-medium capitalize whitespace-nowrap">Capacity</th>
            <th className="h-10 px-4 font-medium capitalize whitespace-nowrap">Floor</th>
            <th className="h-10 px-4 text-right font-medium whitespace-nowrap min-w-[100px]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id} className="border-b transition-colors hover:bg-muted/50">
              <td className="p-4 align-middle font-mono font-medium whitespace-nowrap">#{item.id}</td>
              <td className="p-4 align-middle font-medium text-foreground whitespace-nowrap">{item.name?.toString()}</td>
              <td className="p-4 align-middle whitespace-nowrap capitalize">{item.type?.toString()}</td>
              <td className="p-4 align-middle whitespace-nowrap">{item.capacity?.toString()} beds</td>
              <td className="p-4 align-middle whitespace-nowrap">{item.floor?.toString()}</td>
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
