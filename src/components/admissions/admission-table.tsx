import { Edit, Trash2, LogOut, CheckCircle2, FileDown, BedDouble, Activity, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Admission } from "@/types";
import { downloadDischargeSummaryPdf } from "@/lib/reports";
import { formatId, formatDate, getInitials, getAvatarColor } from "@/lib/formatters";
import { MobileTableHint } from "@/components/ui/mobile-table-hint";

export function AdmissionTable({
  items,
  onEdit,
  onDelete,
  onDischarge,
}: {
  items: Admission[];
  onEdit: (item: Admission) => void;
  onDelete: (item: Admission) => void;
  onDischarge?: (item: Admission) => void;
}) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="rounded-full bg-muted p-3 mb-3">
          <BedDouble className="size-6 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground">No admission records found</p>
        <p className="text-xs text-muted-foreground mt-1">Admit a patient to track ward stay and bed telemetry.</p>
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
            <th className="h-10 px-4 whitespace-nowrap">Admission ID</th>
            <th className="h-10 px-4 whitespace-nowrap">Patient</th>
            <th className="h-10 px-4 whitespace-nowrap">Attending Doctor</th>
            <th className="h-10 px-4 whitespace-nowrap">Ward Bed</th>
            <th className="h-10 px-4 whitespace-nowrap">Admitted</th>
            <th className="h-10 px-4 whitespace-nowrap">Reason / Diagnosis</th>
            <th className="h-10 px-4 whitespace-nowrap">Status</th>
            <th className="h-10 px-4 whitespace-nowrap">Discharge Date</th>
            <th className="h-10 px-4 text-right whitespace-nowrap min-w-[150px]">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {items.map((item) => {
            const isAdmitted = item.status?.toLowerCase() === "admitted";
            const patientFirst = item.patient?.user?.firstName || "";
            const patientLast = item.patient?.user?.lastName || "";
            const patientName = patientFirst ? `${patientFirst} ${patientLast}` : `Patient #${item.patientId || item.id}`;

            const docFirst = item.admittingDoctor?.user?.firstName || "";
            const docLast = item.admittingDoctor?.user?.lastName || "";
            const docName = docFirst ? `Dr. ${docFirst} ${docLast}` : `Doctor #${item.admittingDoctorId || "—"}`;
            const docSpecialty = item.admittingDoctor?.specialization;

            return (
              <tr key={item.id} className="transition-colors hover:bg-muted/30">
                <td className="p-4 align-middle">
                  <Badge variant="outline" className="font-mono font-medium text-xs bg-muted/50">
                    {formatId("admission", item.id)}
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

                <td className="p-4 align-middle">
                  <Badge variant="outline" className="font-mono text-xs">
                    {item.bed ? `Bed ${item.bed.bedNumber}` : item.bedId ? `Bed #${item.bedId}` : "Unassigned"}
                  </Badge>
                </td>

                <td className="p-4 align-middle text-xs whitespace-nowrap text-muted-foreground">
                  {formatDate(item.admissionDate)}
                </td>

                <td className="p-4 align-middle text-xs max-w-[180px]">
                  <span className="truncate block font-medium text-foreground">{item.reason || "Observation"}</span>
                </td>

                <td className="p-4 align-middle capitalize whitespace-nowrap">
                  <Badge
                    variant={isAdmitted ? "default" : "secondary"}
                    className={
                      isAdmitted
                        ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30"
                        : "bg-muted text-muted-foreground"
                    }
                  >
                    {item.status || "admitted"}
                  </Badge>
                </td>

                <td className="p-4 align-middle text-xs whitespace-nowrap text-muted-foreground">
                  {item.dischargeDate ? formatDate(item.dischargeDate) : "—"}
                </td>

                <td className="p-4 align-middle text-right">
                  <div className="flex items-center justify-end gap-1">
                    {/* Quick Discharge Button (frees bed automatically) */}
                    {isAdmitted && (
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Discharge Patient (Auto-frees bed)"
                        className="h-8 text-xs text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:text-amber-400 gap-1 px-2"
                        onClick={() => onDischarge?.(item)}
                      >
                        <LogOut className="size-3.5" /> Discharge
                      </Button>
                    )}
                    {/* Discharge Summary PDF (Go microservice) */}
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Download Official Discharge Summary PDF (Go Service)"
                      className="size-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                      onClick={() => downloadDischargeSummaryPdf(item.id)}
                    >
                      <FileDown className="size-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground hover:text-foreground"
                      onClick={() => onEdit(item)}
                      title="Edit Admission"
                    >
                      <Edit className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground hover:text-destructive"
                      onClick={() => onDelete(item)}
                      title="Delete Admission"
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
