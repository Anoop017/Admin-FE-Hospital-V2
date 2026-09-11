import { Edit, Trash2, FileText, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { MedicalRecord } from "@/types";
import { formatId, formatDate, getInitials, getAvatarColor } from "@/lib/formatters";
import { MobileTableHint } from "@/components/ui/mobile-table-hint";

export function MedicalRecordTable({
  items,
  onEdit,
  onDelete,
}: {
  items: MedicalRecord[];
  onEdit: (i: MedicalRecord) => void;
  onDelete: (i: MedicalRecord) => void;
}) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="rounded-full bg-muted p-3 mb-3">
          <FileText className="size-6 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground">No clinical medical records found</p>
        <p className="text-xs text-muted-foreground mt-1">Record a patient encounter, diagnosis, and treatment plan.</p>
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
            <th className="h-10 px-4 whitespace-nowrap">Record ID</th>
            <th className="h-10 px-4 whitespace-nowrap">Patient</th>
            <th className="h-10 px-4 whitespace-nowrap">Attending Doctor</th>
            <th className="h-10 px-4 whitespace-nowrap">Clinical Diagnosis</th>
            <th className="h-10 px-4 whitespace-nowrap">Reported Symptoms</th>
            <th className="h-10 px-4 whitespace-nowrap">Treatment Plan</th>
            <th className="h-10 px-4 whitespace-nowrap">Record Date</th>
            <th className="h-10 px-4 text-right whitespace-nowrap min-w-[100px]">Actions</th>
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
            const docSpecialty = item.doctor?.specialization;

            return (
              <tr key={item.id} className="transition-colors hover:bg-muted/30">
                <td className="p-4 align-middle">
                  <Badge variant="outline" className="font-mono font-medium text-xs bg-muted/50">
                    {formatId("record", item.id)}
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

                <td className="p-4 align-middle">
                  <div className="font-medium text-foreground text-xs">{docName}</div>
                  {docSpecialty && <div className="text-xs text-muted-foreground">{docSpecialty}</div>}
                </td>

                <td className="p-4 align-middle max-w-[200px]">
                  <span className="font-semibold text-foreground text-xs block truncate">{item.diagnosis}</span>
                </td>

                <td className="p-4 align-middle max-w-[180px] text-xs text-muted-foreground truncate">
                  {item.symptoms || "—"}
                </td>

                <td className="p-4 align-middle max-w-[180px] text-xs text-muted-foreground truncate">
                  {item.treatment || "—"}
                </td>

                <td className="p-4 align-middle whitespace-nowrap text-xs text-muted-foreground">
                  {formatDate(item.recordDate)}
                </td>

                <td className="p-4 align-middle text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground hover:text-foreground"
                      onClick={() => onEdit(item)}
                      title="Edit Medical Record"
                    >
                      <Edit className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground hover:text-destructive"
                      onClick={() => onDelete(item)}
                      title="Delete Medical Record"
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
