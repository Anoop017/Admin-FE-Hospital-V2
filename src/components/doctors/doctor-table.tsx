import { Edit, Trash2, Stethoscope, Award, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Doctor } from "@/types";
import { formatId, formatCurrency, getInitials, getAvatarColor } from "@/lib/formatters";

import { MobileTableHint } from "@/components/ui/mobile-table-hint";

export function DoctorTable({
  items,
  onEdit,
  onDelete,
}: {
  items: Doctor[];
  onEdit: (i: Doctor) => void;
  onDelete: (i: Doctor) => void;
}) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="rounded-full bg-muted p-3 mb-3">
          <Stethoscope className="size-6 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground">No medical specialists found</p>
        <p className="text-xs text-muted-foreground mt-1">Register a doctor to establish clinical specialties and consultation fees.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <MobileTableHint />
      <div className="w-full overflow-x-auto touch-pan-x">
      <table className="w-full text-left text-sm min-w-[750px]">
        <thead className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <tr>
            <th className="h-10 px-4 whitespace-nowrap">Doctor ID</th>
            <th className="h-10 px-4 whitespace-nowrap">Physician</th>
            <th className="h-10 px-4 whitespace-nowrap">Specialization</th>
            <th className="h-10 px-4 whitespace-nowrap">Medical License</th>
            <th className="h-10 px-4 whitespace-nowrap">Experience</th>
            <th className="h-10 px-4 whitespace-nowrap">Consultation Fee</th>
            <th className="h-10 px-4 text-right whitespace-nowrap min-w-[100px]">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {items.map((item) => {
            const firstName = item.user?.firstName || "";
            const lastName = item.user?.lastName || "";
            const docName = firstName ? `Dr. ${firstName} ${lastName}` : `Doctor #${item.id}`;
            const email = item.user?.email;

            return (
              <tr key={item.id} className="transition-colors hover:bg-muted/30">
                <td className="p-4 align-middle">
                  <Badge variant="outline" className="font-mono font-medium text-xs bg-muted/50">
                    {formatId("doctor", item.id)}
                  </Badge>
                </td>

                <td className="p-4 align-middle">
                  <div className="flex items-center gap-2.5">
                    <Avatar className="size-8 shrink-0">
                      <AvatarFallback className={`text-xs font-semibold ${getAvatarColor(docName)}`}>
                        {getInitials(firstName || "D", lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-foreground">{docName}</div>
                      {email && <div className="text-xs text-muted-foreground">{email}</div>}
                    </div>
                  </div>
                </td>

                <td className="p-4 align-middle whitespace-nowrap font-medium text-foreground">
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                    {item.specialization || "General Medicine"}
                  </Badge>
                </td>

                <td className="p-4 align-middle whitespace-nowrap font-mono text-xs text-muted-foreground">
                  {item.licenseNumber || "MD-PENDING"}
                </td>

                <td className="p-4 align-middle whitespace-nowrap text-xs text-foreground font-medium">
                  {item.experienceYears ? `${item.experienceYears} Years` : "—"}
                </td>

                <td className="p-4 align-middle whitespace-nowrap font-semibold text-foreground">
                  {formatCurrency(item.consultationFee)}
                </td>

                <td className="p-4 align-middle text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground hover:text-foreground"
                      onClick={() => onEdit(item)}
                      title="Edit Doctor"
                    >
                      <Edit className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground hover:text-destructive"
                      onClick={() => onDelete(item)}
                      title="Delete Doctor"
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
