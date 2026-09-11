import { Edit, Trash2, Pill, CheckCircle2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Prescription } from "@/types";
import { formatId, formatDate, getInitials, getAvatarColor } from "@/lib/formatters";
import { MobileTableHint } from "@/components/ui/mobile-table-hint";

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
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="rounded-full bg-muted p-3 mb-3">
          <Pill className="size-6 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground">No prescription records found</p>
        <p className="text-xs text-muted-foreground mt-1">Issue an electronic Rx prescription to dispensing pharmacies.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <MobileTableHint />
      <div className="w-full overflow-x-auto touch-pan-x">
      <table className="w-full text-left text-sm min-w-[850px]">
        <thead className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <tr>
            <th className="h-10 px-4 whitespace-nowrap">Rx ID</th>
            <th className="h-10 px-4 whitespace-nowrap">Patient</th>
            <th className="h-10 px-4 whitespace-nowrap">Prescriber</th>
            <th className="h-10 px-4 whitespace-nowrap">Medication</th>
            <th className="h-10 px-4 whitespace-nowrap">Dosage</th>
            <th className="h-10 px-4 whitespace-nowrap">Frequency</th>
            <th className="h-10 px-4 whitespace-nowrap">Duration</th>
            <th className="h-10 px-4 whitespace-nowrap">Issued Date</th>
            <th className="h-10 px-4 text-right whitespace-nowrap min-w-[120px]">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {items.map((item) => {
            const patientFirst = item.patient?.user?.firstName || "";
            const patientLast = item.patient?.user?.lastName || "";
            const patientName = patientFirst ? `${patientFirst} ${patientLast}` : `Patient #${item.patientId || item.id}`;

            const docFirst = item.doctor?.user?.firstName || "";
            const docLast = item.doctor?.user?.lastName || "";
            const docName = docFirst ? `Dr. ${docFirst} ${docLast}` : `Doctor #${item.doctorId || "—"}`;

            return (
              <tr key={item.id} className="transition-colors hover:bg-muted/30">
                <td className="p-4 align-middle">
                  <Badge variant="outline" className="font-mono font-medium text-xs bg-muted/50">
                    {formatId("prescription", item.id)}
                  </Badge>
                </td>

                <td className="p-4 align-middle">
                  <div className="flex items-center gap-2.5">
                    <Avatar className="size-8 shrink-0">
                      <AvatarFallback className={`text-xs font-semibold ${getAvatarColor(patientName)}`}>
                        {getInitials(patientFirst || "P", patientLast)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-foreground">{patientName}</div>
                      <div className="text-xs font-mono text-muted-foreground">
                        {formatId("patient", item.patientId || item.patient?.id)}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="p-4 align-middle whitespace-nowrap">
                  <div className="font-medium text-foreground text-xs">{docName}</div>
                  {item.doctor?.specialization && (
                    <div className="text-xs text-muted-foreground">{item.doctor.specialization}</div>
                  )}
                </td>

                <td className="p-4 align-middle">
                  <div className="flex items-center gap-1.5 font-semibold text-foreground text-xs">
                    <Pill className="size-3.5 text-primary shrink-0" />
                    <span>{item.medication}</span>
                  </div>
                </td>

                <td className="p-4 align-middle text-xs font-medium text-foreground whitespace-nowrap">
                  {item.dosage}
                </td>

                <td className="p-4 align-middle text-xs text-muted-foreground whitespace-nowrap">
                  {item.frequency}
                </td>

                <td className="p-4 align-middle text-xs whitespace-nowrap font-medium text-foreground">
                  {item.duration}
                </td>

                <td className="p-4 align-middle text-xs text-muted-foreground whitespace-nowrap">
                  {formatDate(item.issuedDate)}
                </td>

                <td className="p-4 align-middle text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1">
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
  </div>
  );
}
