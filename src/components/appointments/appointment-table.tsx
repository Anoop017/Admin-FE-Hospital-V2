import { Edit, Trash2, Calendar, Clock, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Appointment } from "@/types";
import { formatId, formatDate, formatTime, getInitials, getAvatarColor } from "@/lib/formatters";
import { MobileTableHint } from "@/components/ui/mobile-table-hint";

export function AppointmentTable({
  items,
  onEdit,
  onDelete,
}: {
  items: Appointment[];
  onEdit: (item: Appointment) => void;
  onDelete: (item: Appointment) => void;
}) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="rounded-full bg-muted p-3 mb-3">
          <Calendar className="size-6 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground">No appointments found</p>
        <p className="text-xs text-muted-foreground mt-1">Schedule a new clinical appointment to get started.</p>
      </div>
    );
  }

  const getStatusBadge = (status: string | undefined) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return (
          <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 gap-1 capitalize">
            <CheckCircle2 className="size-3" /> Completed
          </Badge>
        );
      case "scheduled":
        return (
          <Badge className="bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 gap-1 capitalize">
            <Clock className="size-3" /> Scheduled
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="destructive" className="gap-1 capitalize">
            <XCircle className="size-3" /> Cancelled
          </Badge>
        );
      case "no_show":
        return (
          <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 gap-1 capitalize">
            <AlertCircle className="size-3" /> No Show
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="capitalize">
            {status || "Scheduled"}
          </Badge>
        );
    }
  };

  return (
    <div className="w-full">
      <MobileTableHint />
      <div className="w-full overflow-x-auto touch-pan-x">
      <table className="w-full text-left text-sm min-w-[800px]">
        <thead className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <tr>
            <th className="h-10 px-4 whitespace-nowrap">Appt ID</th>
            <th className="h-10 px-4 whitespace-nowrap">Patient</th>
            <th className="h-10 px-4 whitespace-nowrap">Doctor</th>
            <th className="h-10 px-4 whitespace-nowrap">Scheduled Date</th>
            <th className="h-10 px-4 whitespace-nowrap">Reason</th>
            <th className="h-10 px-4 whitespace-nowrap">Status</th>
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
                    {formatId("appointment", item.id)}
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
                  <div className="font-medium text-foreground">{docName}</div>
                  {docSpecialty && (
                    <div className="text-xs text-muted-foreground">{docSpecialty}</div>
                  )}
                </td>

                <td className="p-4 align-middle whitespace-nowrap">
                  <div className="text-foreground font-medium">{formatDate(item.appointmentDate)}</div>
                  <div className="text-xs text-muted-foreground">{formatTime(item.appointmentDate)}</div>
                </td>

                <td className="p-4 align-middle max-w-[200px]">
                  <div className="text-foreground text-xs font-medium truncate">{item.reason || "General Consultation"}</div>
                  {item.notes && <div className="text-xs text-muted-foreground truncate">{item.notes}</div>}
                </td>

                <td className="p-4 align-middle whitespace-nowrap">
                  {getStatusBadge(item.status)}
                </td>

                <td className="p-4 align-middle text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground hover:text-foreground"
                      onClick={() => onEdit(item)}
                      title="Edit Appointment"
                    >
                      <Edit className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground hover:text-destructive"
                      onClick={() => onDelete(item)}
                      title="Delete Appointment"
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
