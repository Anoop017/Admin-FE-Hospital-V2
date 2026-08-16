import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Doctor } from "@/types";

export function DoctorTable({ items, onEdit, onDelete }: { items: Doctor[], onEdit: (i: Doctor) => void, onDelete: (i: Doctor) => void }) {
  if (items.length === 0) return <div className="p-6 text-center text-muted-foreground">No records found.</div>;
  return (
    <div className="w-full overflow-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b bg-secondary/50">
          <tr>
            <th className="h-10 px-4 font-medium">ID</th>
            <th className="h-10 px-4 font-medium capitalize">User (Doctor)</th><th className="h-10 px-4 font-medium capitalize">specialization</th><th className="h-10 px-4 font-medium capitalize">licenseNumber</th><th className="h-10 px-4 font-medium capitalize">experienceYears</th><th className="h-10 px-4 font-medium capitalize">consultationFee</th>
            <th className="h-10 px-4 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id} className="border-b transition-colors hover:bg-muted/50">
              <td className="p-4 align-middle">{item.id?.substring(0,8)}...</td>
              <td className="p-4 align-middle">{item.user ? `Dr. ${item.user.firstName} ${item.user.lastName}` : item.userId?.toString()}</td><td className="p-4 align-middle">{item.specialization?.toString()}</td><td className="p-4 align-middle">{item.licenseNumber?.toString()}</td><td className="p-4 align-middle">{item.experienceYears?.toString()}</td><td className="p-4 align-middle">{item.consultationFee?.toString()}</td>
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
