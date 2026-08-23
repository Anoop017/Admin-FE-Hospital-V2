import { Edit, Trash2, Pill, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Prescription } from "@/types";

export function PrescriptionTable({
  items,
  onEdit,
  onDelete,
  onFulfill,
}: {
  items: Prescription[];
  onEdit: (i: Prescription) => void;
  onDelete: (i: Prescription) => void;
  onFulfill?: (i: Prescription) => void;
}) {
  if (items.length === 0)
    return <div className="p-8 text-center text-muted-foreground text-sm">No prescription records found.</div>;

  return (
    <div className="w-full overflow-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <tr>
            <th className="h-10 px-4">Prescription #</th>
            <th className="h-10 px-4">Patient</th>
            <th className="h-10 px-4">Doctor</th>
            <th className="h-10 px-4">Medication</th>
            <th className="h-10 px-4">Dosage</th>
            <th className="h-10 px-4">Frequency</th>
            <th className="h-10 px-4">Duration</th>
            <th className="h-10 px-4">Issued Date</th>
            <th className="h-10 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {items.map((item) => {
            const patientName = item.patient?.user
              ? `${item.patient.user.firstName} ${item.patient.user.lastName}`
              : `Patient #${item.patientId?.substring(0, 8)}`;
            const docName = item.doctor?.user
              ? `Dr. ${item.doctor.user.firstName} ${item.doctor.user.lastName}`
              : `Doctor #${item.doctorId?.substring(0, 8)}`;

            return (
              <tr key={item.id} className="transition-colors hover:bg-muted/30">
                <td className="p-4 align-middle font-mono font-medium">
                  #{item.id?.substring(0, 8)}
                </td>
                <td className="p-4 align-middle font-medium text-foreground">{patientName}</td>
                <td className="p-4 align-middle text-muted-foreground">{docName}</td>
                <td className="p-4 align-middle font-semibold text-foreground">{item.medication}</td>
                <td className="p-4 align-middle text-xs">{item.dosage}</td>
                <td className="p-4 align-middle text-xs">{item.frequency}</td>
                <td className="p-4 align-middle text-xs">{item.duration}</td>
                <td className="p-4 align-middle text-xs text-muted-foreground">
                  {item.issuedDate ? new Date(item.issuedDate).toLocaleDateString() : "—"}
                </td>
                <td className="p-4 align-middle text-right">
                  <div className="flex items-center justify-end gap-1">
                    {onFulfill && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 gap-1 px-2"
                        onClick={() => onFulfill(item)}
                        title="Fulfill & Dispense Prescription"
                      >
                        <Pill className="size-3.5" /> Dispense
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground hover:text-foreground"
                      onClick={() => onEdit(item)}
                      title="Edit Prescription"
                    >
                      <Edit className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground hover:text-destructive"
                      onClick={() => onDelete(item)}
                      title="Delete Prescription"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
