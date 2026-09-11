import { Edit, Trash2, HeartPulse, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Patient } from "@/types";
import { formatId, formatDate, getInitials, getAvatarColor } from "@/lib/formatters";
import { MobileTableHint } from "@/components/ui/mobile-table-hint";

interface PatientTableProps {
  items: Patient[];
  onViewSummary: (patient: Patient) => void;
  onEdit: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
}

export function PatientTable({ items, onViewSummary, onEdit, onDelete }: PatientTableProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="rounded-full bg-muted p-3 mb-3">
          <User className="size-6 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground">No patient records found</p>
        <p className="text-xs text-muted-foreground mt-1">Register a patient to begin clinical records management.</p>
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
            <th className="h-10 px-4 whitespace-nowrap">MRN / ID</th>
            <th className="h-10 px-4 whitespace-nowrap">Patient Name</th>
            <th className="h-10 px-4 whitespace-nowrap">Date of Birth</th>
            <th className="h-10 px-4 whitespace-nowrap">Gender</th>
            <th className="h-10 px-4 whitespace-nowrap">Blood Group</th>
            <th className="h-10 px-4 whitespace-nowrap">Address</th>
            <th className="h-10 px-4 whitespace-nowrap">Clinical Notes</th>
            <th className="h-10 px-4 text-right whitespace-nowrap min-w-[190px]">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {items.map((item) => {
            const firstName = item.user?.firstName || "";
            const lastName = item.user?.lastName || "";
            const name = firstName ? `${firstName} ${lastName}` : `Patient #${item.id}`;
            const emailOrPhone = item.user?.email || item.user?.mobile;

            return (
              <tr key={item.id} className="transition-colors hover:bg-muted/30">
                <td className="p-4 align-middle">
                  <Badge variant="outline" className="font-mono font-medium text-xs bg-muted/50">
                    {formatId("patient", item.id)}
                  </Badge>
                </td>
                <td className="p-4 align-middle">
                  <div className="flex items-center gap-2.5">
                    <Avatar className="size-8 shrink-0">
                      <AvatarFallback className={`text-xs font-semibold ${getAvatarColor(name)}`}>
                        {getInitials(firstName || "P", lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-foreground">{name}</div>
                      {emailOrPhone && <div className="text-xs text-muted-foreground">{emailOrPhone}</div>}
                    </div>
                  </div>
                </td>
                <td className="p-4 align-middle text-xs text-muted-foreground whitespace-nowrap">
                  {formatDate(item.dateOfBirth)}
                </td>
                <td className="p-4 align-middle capitalize text-xs">{item.gender?.toLowerCase() || "—"}</td>
                <td className="p-4 align-middle">
                  {item.bloodGroup ? (
                    <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/30 text-xs font-semibold">
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
  </div>
  );
}
