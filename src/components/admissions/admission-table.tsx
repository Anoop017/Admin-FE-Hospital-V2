import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Admission } from "@/types";

export function AdmissionTable({ items, onEdit, onDelete }: { items: Admission[], onEdit: (i: Admission) => void, onDelete: (i: Admission) => void }) {
  if (items.length === 0) return <div className="p-6 text-center text-muted-foreground">No records found.</div>;
  return (
    <div className="w-full overflow-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b bg-secondary/50">
          <tr>
            <th className="h-10 px-4 font-medium">ID</th>
            <th className="h-10 px-4 font-medium capitalize">Patient</th><th className="h-10 px-4 font-medium capitalize">Admitting Doctor</th><th className="h-10 px-4 font-medium capitalize">Bed</th><th className="h-10 px-4 font-medium capitalize">admissionDate</th><th className="h-10 px-4 font-medium capitalize">reason</th><th className="h-10 px-4 font-medium capitalize">status</th><th className="h-10 px-4 font-medium capitalize">dischargeDate</th>
            <th className="h-10 px-4 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id} className="border-b transition-colors hover:bg-muted/50">
              <td className="p-4 align-middle">{item.id?.substring(0,8)}...</td>
              <td className="p-4 align-middle">{item.patient?.user ? `${item.patient.user.firstName} ${item.patient.user.lastName}` : item.patientId?.toString()}</td><td className="p-4 align-middle">{item.admittingDoctor?.user ? `Dr. ${item.admittingDoctor.user.firstName} ${item.admittingDoctor.user.lastName}` : item.admittingDoctorId?.toString()}</td><td className="p-4 align-middle">{item.bed ? `Bed ${item.bed.bedNumber}` : item.bedId?.toString()}</td><td className="p-4 align-middle">{item.admissionDate?.toString()}</td><td className="p-4 align-middle">{item.reason?.toString()}</td><td className="p-4 align-middle">{item.status?.toString()}</td><td className="p-4 align-middle">{item.dischargeDate?.toString()}</td>
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
