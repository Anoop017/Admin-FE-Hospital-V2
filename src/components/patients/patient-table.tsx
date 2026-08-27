import { Edit, Trash2, HeartPulse, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Patient } from "@/types";

export function PatientTable({
  items,
  onViewSummary,
  onEdit,
  onDelete,
}: {
  items: Patient[];
  onViewSummary: (i: Patient) => void;
  onEdit: (i: Patient) => void;
  onDelete: (i: Patient) => void;
}) {
  if (items.length === 0)
    return <div className="p-8 text-center text-muted-foreground text-sm">No patient records found.</div>;

  return (
    <div className="w-full overflow-x-auto touch-pan-x">
      <table className="w-full text-left text-sm min-w-[800px]">
        <thead className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <tr>
            <th className="h-10 px-4 whitespace-nowrap">Patient #</th>
            <th className="h-10 px-4 whitespace-nowrap">Patient Name</th>
            <th className="h-10 px-4 whitespace-nowrap">DOB</th>
            <th className="h-10 px-4 whitespace-nowrap">Gender</th>
            <th className="h-10 px-4 whitespace-nowrap">Blood Group</th>
            <th className="h-10 px-4 whitespace-nowrap">Address</th>
            <th className="h-10 px-4 whitespace-nowrap">Medical Notes</th>
            <th className="h-10 px-4 text-right whitespace-nowrap min-w-[190px]">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {items.map((item) => {
            const name = item.user
              ? `${item.user.firstName} ${item.user.lastName}`
              : `Patient #${item.id}`;
            const emailOrPhone = item.user?.email || item.user?.mobile;

            return (
              <tr key={item.id} className="transition-colors hover:bg-muted/30">
                <td className="p-4 align-middle font-mono font-medium">
                  #{item.id}
                </td>
                <td className="p-4 align-middle">
                  <div className="font-semibold text-foreground">{name}</div>
                  {emailOrPhone && <div className="text-xs text-muted-foreground">{emailOrPhone}</div>}
                </td>
                <td className="p-4 align-middle text-xs text-muted-foreground">{item.dateOfBirth || "—"}</td>
                <td className="p-4 align-middle capitalize text-xs">{item.gender || "—"}</td>
                <td className="p-4 align-middle">
                  {item.bloodGroup ? (
                    <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/30 text-xs">
                      {item.bloodGroup}
                    </Badge>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="p-4 align-middle text-xs text-muted-foreground max-w-[150px] truncate">
                  {item.address || "—"}
                </td>
                <td className="p-4 align-middle text-xs text-muted-foreground max-w-[180px] truncate">
                  {item.medicalNotes || "—"}
                </td>
                <td className="p-4 align-middle text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs text-primary hover:bg-primary/10 gap-1 px-2"
                      onClick={() => onViewSummary(item)}
                      title="View 360° Clinical History"
                    >
                      <HeartPulse className="size-3.5" /> 360° History
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground hover:text-foreground"
                      onClick={() => onEdit(item)}
                      title="Edit Patient"
                    >
                      <Edit className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground hover:text-destructive"
                      onClick={() => onDelete(item)}
                      title="Delete Patient"
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
