import { Edit, Trash2, FileText, ExternalLink, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Laborator } from "@/types";
import { downloadLabReportPdf } from "@/lib/reports";

export function LaboratorTable({
  items,
  onEdit,
  onDelete,
}: {
  items: Laborator[];
  onEdit: (i: Laborator) => void;
  onDelete: (i: Laborator) => void;
}) {
  if (items.length === 0)
    return <div className="p-8 text-center text-muted-foreground text-sm">No laboratory tests found.</div>;

  return (
    <div className="w-full overflow-x-auto touch-pan-x">
      <table className="w-full text-left text-sm min-w-[800px]">
        <thead className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <tr>
            <th className="h-10 px-4 whitespace-nowrap">Test #</th>
            <th className="h-10 px-4 whitespace-nowrap">Patient</th>
            <th className="h-10 px-4 whitespace-nowrap">Ordering Doctor</th>
            <th className="h-10 px-4 whitespace-nowrap">Test Name</th>
            <th className="h-10 px-4 whitespace-nowrap">Category</th>
            <th className="h-10 px-4 whitespace-nowrap">Findings / Result</th>
            <th className="h-10 px-4 whitespace-nowrap">Test Date</th>
            <th className="h-10 px-4 whitespace-nowrap">Status</th>
            <th className="h-10 px-4 text-right whitespace-nowrap min-w-[100px]">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {items.map((item) => {
            const patientName = item.patient?.user
              ? `${item.patient.user.firstName} ${item.patient.user.lastName}`
              : `Patient #${item.patientId}`;
            const docName = item.doctor?.user
              ? `Dr. ${item.doctor.user.firstName} ${item.doctor.user.lastName}`
              : `Doctor #${item.doctorId}`;

            return (
              <tr key={item.id} className="transition-colors hover:bg-muted/30">
                <td className="p-4 align-middle font-mono font-medium">
                  #{item.id}
                </td>
                <td className="p-4 align-middle font-medium text-foreground">{patientName}</td>
                <td className="p-4 align-middle text-muted-foreground text-xs">{docName}</td>
                <td className="p-4 align-middle font-semibold text-foreground">{item.testName}</td>
                <td className="p-4 align-middle text-xs text-muted-foreground">{item.testType}</td>
                <td className="p-4 align-middle text-xs">
                  <div className="flex items-center gap-2 max-w-[200px]">
                    <span className="truncate">{item.result || <span className="text-muted-foreground italic">Awaiting findings</span>}</span>
                    {item.reportUrl && (
                      <a
                        href={item.reportUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline flex items-center shrink-0"
                        title="Open Lab Report PDF"
                      >
                        <ExternalLink className="size-3" />
                      </a>
                    )}
                  </div>
                </td>
                <td className="p-4 align-middle text-xs text-muted-foreground">
                  {item.testDate ? new Date(item.testDate).toLocaleDateString() : "—"}
                </td>
                <td className="p-4 align-middle">
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
                <td className="p-4 align-middle text-right">
                  <div className="flex items-center justify-end gap-1">
                    {/* Download Lab Report PDF from Go Service */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                      onClick={() => downloadLabReportPdf(item.id)}
                      title="Download Official Lab Report PDF"
                    >
                      <FileDown className="size-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground hover:text-foreground"
                      onClick={() => onEdit(item)}
                      title="Update Findings & Result"
                    >
                      <Edit className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground hover:text-destructive"
                      onClick={() => onDelete(item)}
                      title="Delete Test"
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
