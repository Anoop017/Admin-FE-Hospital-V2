import { Edit, Trash2, FileText, ExternalLink, FileDown, FlaskConical, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Laborator } from "@/types";
import { downloadLabReportPdf } from "@/lib/reports";
import { formatId, formatDate, getInitials, getAvatarColor } from "@/lib/formatters";
import { MobileTableHint } from "@/components/ui/mobile-table-hint";

export function LaboratorTable({
  items,
  onEdit,
  onDelete,
}: {
  items: Laborator[];
  onEdit: (i: Laborator) => void;
  onDelete: (i: Laborator) => void;
}) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="rounded-full bg-muted p-3 mb-3">
          <FlaskConical className="size-6 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground">No laboratory records found</p>
        <p className="text-xs text-muted-foreground mt-1">Order diagnostic blood panels, pathology, or microbiology tests.</p>
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
              <th className="h-10 px-4 whitespace-nowrap">Lab Test ID</th>
              <th className="h-10 px-4 whitespace-nowrap">Patient</th>
              <th className="h-10 px-4 whitespace-nowrap">Ordering Doctor</th>
              <th className="h-10 px-4 whitespace-nowrap">Test / Panel</th>
              <th className="h-10 px-4 whitespace-nowrap">Category</th>
              <th className="h-10 px-4 whitespace-nowrap">Diagnostic Findings</th>
              <th className="h-10 px-4 whitespace-nowrap">Specimen Date</th>
              <th className="h-10 px-4 whitespace-nowrap">Status</th>
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
                    {formatId("lab", item.id)}
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

                <td className="p-4 align-middle text-muted-foreground text-xs whitespace-nowrap">
                  <span className="font-medium text-foreground">{docName}</span>
                </td>

                <td className="p-4 align-middle font-semibold text-foreground whitespace-nowrap">
                  {item.testName}
                </td>

                <td className="p-4 align-middle text-xs text-muted-foreground whitespace-nowrap">
                  <Badge variant="outline" className="text-[11px] font-normal">
                    {item.testType || "Diagnostic"}
                  </Badge>
                </td>

                <td className="p-4 align-middle text-xs">
                  <div className="flex items-center gap-2 max-w-[220px]">
                    <span className="truncate font-mono">
                      {item.result || <span className="text-muted-foreground italic font-sans">Awaiting lab analysis</span>}
                    </span>
                    {item.reportUrl && (
                      <a
                        href={item.reportUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline flex items-center shrink-0"
                        title="Open External Lab Report"
                      >
                        <ExternalLink className="size-3" />
                      </a>
                    )}
                  </div>
                </td>

                <td className="p-4 align-middle text-xs text-muted-foreground whitespace-nowrap">
                  {formatDate(item.testDate)}
                </td>

                <td className="p-4 align-middle whitespace-nowrap">
                  <Badge
                    variant={
                      item.status === "completed"
                        ? "default"
                        : item.status === "cancelled"
                        ? "destructive"
                        : "outline"
                    }
                    className={
                      item.status === "completed"
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 capitalize"
                        : item.status === "pending"
                        ? "bg-amber-500/10 text-amber-600 border-amber-500/30 capitalize"
                        : "capitalize"
                    }
                  >
                    {item.status || "pending"}
                  </Badge>
                </td>

                <td className="p-4 align-middle text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1">
                    {/* Download Lab Report PDF from Go Service */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                      onClick={() => downloadLabReportPdf(item.id)}
                      title="Download Official Lab Report PDF (Go Microservice)"
                    >
                      <FileDown className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground hover:text-foreground"
                      onClick={() => onEdit(item)}
                      title="Edit Lab Test"
                    >
                      <Edit className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground hover:text-destructive"
                      onClick={() => onDelete(item)}
                      title="Delete Lab Test"
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
