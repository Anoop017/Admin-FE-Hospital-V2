import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Appointment } from "@/types";

export function AppointmentTable({ items, onEdit, onDelete }: { items: Appointment[], onEdit: (i: Appointment) => void, onDelete: (i: Appointment) => void }) {
  if (items.length === 0) return <div className="p-6 text-center text-muted-foreground">No records found.</div>;
  return (
    <div className="w-full overflow-x-auto touch-pan-x">
      <table className="w-full text-left text-sm min-w-[750px]">
        <thead className="border-b bg-secondary/50">
          <tr>
            <th className="h-10 px-4 font-medium whitespace-nowrap">ID</th>
            <th className="h-10 px-4 font-medium capitalize whitespace-nowrap">Patient</th>
            <th className="h-10 px-4 font-medium capitalize whitespace-nowrap">Doctor</th>
            <th className="h-10 px-4 font-medium whitespace-nowrap">Date</th>
            <th className="h-10 px-4 font-medium whitespace-nowrap">Time</th>
            <th className="h-10 px-4 font-medium whitespace-nowrap">Reason</th>
            <th className="h-10 px-4 font-medium whitespace-nowrap">Notes</th>
            <th className="h-10 px-4 font-medium whitespace-nowrap">Status</th>
            <th className="h-10 px-4 text-right font-medium whitespace-nowrap min-w-[100px]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id} className="border-b transition-colors hover:bg-muted/50">
              <td className="p-4 align-middle font-mono font-medium whitespace-nowrap">#{item.id}</td>
              <td className="p-4 align-middle font-medium text-foreground whitespace-nowrap">{item.patient?.user ? `${item.patient.user.firstName} ${item.patient.user.lastName}` : item.patientId?.toString()}</td>
              <td className="p-4 align-middle whitespace-nowrap">{item.doctor?.user ? `Dr. ${item.doctor.user.firstName} ${item.doctor.user.lastName}` : item.doctorId?.toString()}</td>
              <td className="p-4 align-middle whitespace-nowrap">{item.appointmentDate ? new Date(item.appointmentDate).toLocaleDateString() : ''}</td>
              <td className="p-4 align-middle whitespace-nowrap">{item.appointmentDate ? new Date(item.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</td>
              <td className="p-4 align-middle max-w-[160px] truncate">{item.reason?.toString()}</td>
              <td className="p-4 align-middle max-w-[160px] truncate">{item.notes?.toString() || "—"}</td>
              <td className="p-4 align-middle capitalize whitespace-nowrap">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.status === 'scheduled' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400' : item.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}>
                  {item.status?.toString()}
                </span>
              </td>
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
