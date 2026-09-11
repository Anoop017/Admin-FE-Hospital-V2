import { Edit, Trash2, UserCog, Building2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Staf } from "@/types";
import { formatId, formatDate, getInitials, getAvatarColor } from "@/lib/formatters";

import { MobileTableHint } from "@/components/ui/mobile-table-hint";

export function StafTable({
  items,
  onEdit,
  onDelete,
}: {
  items: Staf[];
  onEdit: (i: Staf) => void;
  onDelete: (i: Staf) => void;
}) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="rounded-full bg-muted p-3 mb-3">
          <UserCog className="size-6 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground">No staff members found</p>
        <p className="text-xs text-muted-foreground mt-1">Add healthcare staff and personnel to manage hospital operations.</p>
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
            <th className="h-10 px-4 whitespace-nowrap">Staff ID</th>
            <th className="h-10 px-4 whitespace-nowrap">Staff Member</th>
            <th className="h-10 px-4 whitespace-nowrap">Department</th>
            <th className="h-10 px-4 whitespace-nowrap">Job Title / Role</th>
            <th className="h-10 px-4 whitespace-nowrap">Hire Date</th>
            <th className="h-10 px-4 text-right whitespace-nowrap min-w-[100px]">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {items.map((item) => {
            const firstName = item.user?.firstName || "";
            const lastName = item.user?.lastName || "";
            const staffName = firstName ? `${firstName} ${lastName}` : `Staff #${item.id}`;
            const email = item.user?.email || item.user?.mobile;

            return (
              <tr key={item.id} className="transition-colors hover:bg-muted/30">
                <td className="p-4 align-middle">
                  <Badge variant="outline" className="font-mono font-medium text-xs bg-muted/50">
                    {formatId("staff", item.id)}
                  </Badge>
                </td>

                <td className="p-4 align-middle">
                  <div className="flex items-center gap-2.5">
                    <Avatar className="size-8 shrink-0">
                      <AvatarFallback className={`text-xs font-semibold ${getAvatarColor(staffName)}`}>
                        {getInitials(firstName || "S", lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-foreground">{staffName}</div>
                      {email && <div className="text-xs text-muted-foreground">{email}</div>}
                    </div>
                  </div>
                </td>

                <td className="p-4 align-middle whitespace-nowrap">
                  <Badge variant="outline" className="gap-1 bg-muted/40 text-foreground font-normal">
                    <Building2 className="size-3 text-muted-foreground" />
                    {item.department ? item.department.name : "General Administration"}
                  </Badge>
                </td>

                <td className="p-4 align-middle whitespace-nowrap font-medium text-foreground">
                  {item.jobTitle || "Hospital Staff"}
                </td>

                <td className="p-4 align-middle whitespace-nowrap text-xs text-muted-foreground">
                  {formatDate(item.hireDate)}
                </td>

                <td className="p-4 align-middle text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground hover:text-foreground"
                      onClick={() => onEdit(item)}
                      title="Edit Staff Member"
                    >
                      <Edit className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground hover:text-destructive"
                      onClick={() => onDelete(item)}
                      title="Delete Staff Member"
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
