import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MedicalRecord } from "@/types";

export function MedicalRecordTable({ items, onEdit, onDelete }: { items: MedicalRecord[], onEdit: (i: MedicalRecord) => void, onDelete: (i: MedicalRecord) => void }) {
  if (items.length === 0) return <div className="p-6 text-center text-muted-foreground">No records found.</div>;
  return (
    <div className="w-full overflow-x-auto touch-pan-x">
      <table className="w-full text-left text-sm min-w-[750px]">
        <thead className="border-b bg-secondary/50">
          <tr>
            <th className="h-10 px-4 font-medium whitespace-nowrap">ID</th>
            <th className="h-10 px-4 font-medium whitespace-nowrap">Patient</th>
            <th className="h-10 px-4 font-medium whitespace-nowrap">Doctor</th>
            <th className="h-10 px-4 font-medium whitespace-nowrap">Diagnosis</th>
            <th className="h-10 px-4 font-medium whitespace-nowrap">Symptoms</th>
            <th className="h-10 px-4 font-medium whitespace-nowrap">Treatment</th>
            <th className="h-10 px-4 font-medium whitespace-nowrap">Record Date</th>
            <th className="h-10 px-4 text-right font-medium whitespace-nowrap min-w-[100px]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id} className="border-b transition-colors hover:bg-muted/50">
              <td className="p-4 align-middle font-mono font-medium whitespace-nowrap">#{item.id}</td>
              <td className="p-4 align-middle font-medium text-foreground whitespace-nowrap">{item.patient?.user ? `${item.patient.user.firstName} ${item.patient.user.lastName}` : item.patientId?.toString()}</td>
              <td className="p-4 align-middle whitespace-nowrap">{item.doctor?.user ? `Dr. ${item.doctor.user.firstName} ${item.doctor.user.lastName}` : item.doctorId?.toString()}</td>
              <td className="p-4 align-middle max-w-[180px] truncate">{item.diagnosis?.toString()}</td>
              <td className="p-4 align-middle max-w-[180px] truncate">{item.symptoms?.toString()}</td>
              <td className="p-4 align-middle max-w-[180px] truncate">{item.treatment?.toString()}</td>
              <td className="p-4 align-middle whitespace-nowrap text-muted-foreground">{item.recordDate ? new Date(item.recordDate).toLocaleDateString() : ''}</td>
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
