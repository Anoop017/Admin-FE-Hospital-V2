import { Edit, Trash2, LogOut, CheckCircle2, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Admission } from "@/types";
import { downloadDischargeSummaryPdf } from "@/lib/reports";

export function AdmissionTable({
  items,
  onEdit,
  onDelete,
  onDischarge,
}: {
  items: Admission[];
  onEdit: (i: Admission) => void;
  onDelete: (i: Admission) => void;
  onDischarge: (i: Admission) => void;
}) {
  if (items.length === 0)
    return <div className="p-8 text-center text-muted-foreground text-sm">No admission records found.</div>;

  return (
    <div className="w-full overflow-x-auto touch-pan-x">
      <table className="w-full text-left text-sm min-w-[800px]">
        <thead className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <tr>
            <th className="h-10 px-4 whitespace-nowrap">Admission #</th>
            <th className="h-10 px-4 whitespace-nowrap">Patient</th>
            <th className="h-10 px-4 whitespace-nowrap">Doctor</th>
            <th className="h-10 px-4 whitespace-nowrap">Bed</th>
            <th className="h-10 px-4 whitespace-nowrap">Admit Date</th>
            <th className="h-10 px-4 whitespace-nowrap">Reason</th>
            <th className="h-10 px-4 whitespace-nowrap">Status</th>
            <th className="h-10 px-4 whitespace-nowrap">Discharge Date</th>
            <th className="h-10 px-4 text-right whitespace-nowrap min-w-[150px]">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {items.map((item) => {
            const isAdmitted = item.status?.toLowerCase() === "admitted";
            const patientName = item.patient?.user
              ? `${item.patient.user.firstName} ${item.patient.user.lastName}`
              : `Patient #${item.patientId}`;
            const docName = item.admittingDoctor?.user
              ? `Dr. ${item.admittingDoctor.user.firstName} ${item.admittingDoctor.user.lastName}`
              : `Doctor #${item.admittingDoctorId}`;

            return (
              <tr key={item.id} className="transition-colors hover:bg-muted/30">
                <td className="p-4 align-middle font-mono font-medium">
                  #{item.id}
                </td>
                <td className="p-4 align-middle font-medium text-foreground">{patientName}</td>
                <td className="p-4 align-middle text-muted-foreground">{docName}</td>
                <td className="p-4 align-middle">
                  <Badge variant="outline" className="font-mono">
                    {item.bed ? `Bed ${item.bed.bedNumber}` : item.bedId ? `Bed #${item.bedId}` : "—"}
                  </Badge>
                </td>
                <td className="p-4 align-middle text-xs text-muted-foreground">
                  {item.admissionDate ? new Date(item.admissionDate).toLocaleDateString() : "—"}
                </td>
                <td className="p-4 align-middle text-xs">{item.reason?.toString() || "—"}</td>
                <td className="p-4 align-middle capitalize">
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
                <td className="p-4 align-middle text-xs text-muted-foreground">
                  {item.dischargeDate ? new Date(item.dischargeDate).toLocaleDateString() : "—"}
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
                        onClick={() => onDischarge(item)}
                      >
                        <LogOut className="size-3.5" /> Discharge
                      </Button>
                    )}
                    {/* Discharge Summary PDF */}
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Download Discharge Summary PDF"
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
  );
}
