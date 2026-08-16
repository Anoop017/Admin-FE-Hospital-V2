"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { User } from "@/types";

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

const roleBadgeStyles: Record<string, string> = {
  admin: "bg-[#6366F1]/10 text-[#6366F1] hover:bg-[#6366F1]/15",
  doctor: "bg-primary/10 text-primary hover:bg-primary/15",
  nurse: "bg-[#EC4899]/10 text-[#EC4899] hover:bg-[#EC4899]/15",
  staff: "bg-[#F59E0B]/10 text-[#F59E0B] hover:bg-[#F59E0B]/15",
};

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function getInitials(firstName: string, lastName: string) {
  return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
}

function getStatusInfo(user: User) {
  if (user.isLocked) {
    return { label: "Locked", dotClass: "status-dot status-dot--locked" };
  }
  if (user.isActive) {
    return { label: "Active", dotClass: "status-dot status-dot--active" };
  }
  return { label: "Inactive", dotClass: "status-dot status-dot--inactive" };
}

export function UserTable({ users, onEdit, onDelete }: UserTableProps) {
  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-secondary">
          <svg
            className="size-7 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
            />
          </svg>
        </div>
        <p className="mt-4 text-sm font-medium text-foreground">No users found</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Create your first user to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              #
            </th>
            <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Name
            </th>
            <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Email
            </th>
            <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Mobile
            </th>
            <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Roles
            </th>
            <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Status
            </th>
            <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Created
            </th>
            <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {users.map((user, idx) => {
            const status = getStatusInfo(user);
            return (
              <tr
                key={user.id}
                className="transition-colors hover:bg-secondary/50"
              >
                {/* Index */}
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {String(idx + 1).padStart(2, "0")}
                </td>

                {/* Name + Avatar */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-9">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                        {getInitials(user.firstName, user.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {user.firstName} {user.lastName}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Email */}
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {user.email}
                </td>

                {/* Mobile */}
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {user.mobile || "—"}
                </td>

                {/* Roles */}
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1.5">
                    {user.roles?.map((role) => (
                      <Badge
                        key={role.name}
                        variant="secondary"
                        className={
                          roleBadgeStyles[role.name] || "bg-secondary text-secondary-foreground"
                        }
                      >
                        {role.name}
                      </Badge>
                    ))}
                  </div>
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className={status.dotClass} />
                    <span className="text-sm text-foreground">
                      {status.label}
                    </span>
                  </div>
                </td>

                {/* Created */}
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {formatDate(user.createdAt)}
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => onEdit(user)}
                            className="text-muted-foreground hover:text-foreground"
                          />
                        }
                      >
                        <Pencil />
                      </TooltipTrigger>
                      <TooltipContent>Edit user</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => onDelete(user)}
                            className="text-muted-foreground hover:text-destructive"
                          />
                        }
                      >
                        <Trash2 />
                      </TooltipTrigger>
                      <TooltipContent>Delete user</TooltipContent>
                    </Tooltip>
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
