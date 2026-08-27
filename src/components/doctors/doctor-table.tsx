import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Doctor } from "@/types";

export function DoctorTable({ items, onEdit, onDelete }: { items: Doctor[], onEdit: (i: Doctor) => void, onDelete: (i: Doctor) => void }) {
  if (items.length === 0) return <div className="p-6 text-center text-muted-foreground">No records found.</div>;
  return (
    <div className="w-full overflow-x-auto touch-pan-x">
      <table className="w-full text-left text-sm min-w-[700px]">
        <thead className="border-b bg-secondary/50">
          <tr>
            <th className="h-10 px-4 font-medium whitespace-nowrap">ID</th>
            <th className="h-10 px-4 font-medium capitalize whitespace-nowrap">User (Doctor)</th>
            <th className="h-10 px-4 font-medium capitalize whitespace-nowrap">Specialization</th>
            <th className="h-10 px-4 font-medium capitalize whitespace-nowrap">License Number</th>
            <th className="h-10 px-4 font-medium capitalize whitespace-nowrap">Experience</th>
            <th className="h-10 px-4 font-medium capitalize whitespace-nowrap">Fee</th>
            <th className="h-10 px-4 text-right font-medium whitespace-nowrap min-w-[100px]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id} className="border-b transition-colors hover:bg-muted/50">
              <td className="p-4 align-middle font-mono font-medium whitespace-nowrap">#{item.id}</td>
              <td className="p-4 align-middle font-medium text-foreground whitespace-nowrap">{item.user ? `Dr. ${item.user.firstName} ${item.user.lastName}` : item.userId?.toString()}</td>
              <td className="p-4 align-middle whitespace-nowrap">{item.specialization?.toString()}</td>
              <td className="p-4 align-middle whitespace-nowrap font-mono text-xs">{item.licenseNumber?.toString()}</td>
              <td className="p-4 align-middle whitespace-nowrap">{item.experienceYears ? `${item.experienceYears} yrs` : "—"}</td>
              <td className="p-4 align-middle whitespace-nowrap font-semibold">${item.consultationFee?.toString()}</td>
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
