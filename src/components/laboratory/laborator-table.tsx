import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Laborator } from "@/types";

export function LaboratorTable({ items, onEdit, onDelete }: { items: Laborator[], onEdit: (i: Laborator) => void, onDelete: (i: Laborator) => void }) {
  if (items.length === 0) return <div className="p-6 text-center text-muted-foreground">No records found.</div>;
  return (
    <div className="w-full overflow-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b bg-secondary/50">
          <tr>
            <th className="h-10 px-4 font-medium">ID</th>
            <th className="h-10 px-4 font-medium">Patient</th>
            <th className="h-10 px-4 font-medium">Doctor</th>
            <th className="h-10 px-4 font-medium">Test Name</th>
            <th className="h-10 px-4 font-medium">Test Type</th>
            <th className="h-10 px-4 font-medium">Result</th>
            <th className="h-10 px-4 font-medium">Test Date</th>
            <th className="h-10 px-4 font-medium">Status</th>
            <th className="h-10 px-4 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id} className="border-b transition-colors hover:bg-muted/50">
              <td className="p-4 align-middle">{item.id?.substring(0,8)}...</td>
              <td className="p-4 align-middle">{item.patient?.user ? `${item.patient.user.firstName} ${item.patient.user.lastName}` : item.patientId?.toString()}</td>
              <td className="p-4 align-middle">{item.doctor?.user ? `Dr. ${item.doctor.user.firstName} ${item.doctor.user.lastName}` : item.doctorId?.toString()}</td>
              <td className="p-4 align-middle">{item.testName?.toString()}</td>
              <td className="p-4 align-middle">{item.testType?.toString()}</td>
              <td className="p-4 align-middle">{item.result?.toString()}</td>
              <td className="p-4 align-middle">{item.testDate ? new Date(item.testDate).toLocaleDateString() : ''}</td>
              <td className="p-4 align-middle">
                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${item.status === 'completed' ? 'bg-green-100 text-green-700' : item.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {item.status || 'pending'}
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
