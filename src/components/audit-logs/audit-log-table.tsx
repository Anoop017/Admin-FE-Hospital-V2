"use client";

import {
  Eye,
  ChevronLeft,
  ChevronRight,
  Shield,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Clock3,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { AuditLog, AuditLogsMeta } from "@/types";

interface AuditLogTableProps {
  logs: AuditLog[];
  meta: AuditLogsMeta;
  loading: boolean;
  onPageChange: (page: number) => void;
  onSelectLog: (log: AuditLog) => void;
}

const moduleColorMap: Record<string, string> = {
  laboratory: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  lab: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  patients: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  patient: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  medicines: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  medications: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  pharmacy: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  prescriptions: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  auth: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  authentication: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  roles: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  users: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
  appointments: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
  admissions: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
  wards: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
  beds: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
  billing: "bg-lime-500/10 text-lime-600 dark:text-lime-400 border-lime-500/20",
};

const roleBadgeColorMap: Record<string, string> = {
  super_admin: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  admin: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
  doctor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  nurse: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
  pharmacist: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  receptionist: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  staff: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
  patient: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
};

const avatarColorMap: Record<string, string> = {
  super_admin: "bg-emerald-600 text-white",
  admin: "bg-emerald-600 text-white",
  doctor: "bg-blue-600 text-white",
  nurse: "bg-teal-600 text-white",
  staff: "bg-amber-600 text-white",
  patient: "bg-purple-600 text-white",
};

export function AuditLogTable({
  logs,
  meta,
  loading,
  onPageChange,
  onSelectLog,
}: AuditLogTableProps) {
  const formatDateTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const datePart = d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      const timePart = d.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      return { datePart, timePart };
    } catch {
      return { datePart: dateStr, timePart: "" };
    }
  };

  const getMethodBadge = (method: string) => {
    const m = (method || "").toUpperCase();
    let color = "text-muted-foreground font-semibold";
    if (m === "POST") color = "text-emerald-600 dark:text-emerald-400 font-bold";
    else if (m === "PUT" || m === "PATCH") color = "text-blue-600 dark:text-blue-400 font-bold";
    else if (m === "DELETE") color = "text-rose-600 dark:text-rose-400 font-bold";
    else if (m === "GET") color = "text-slate-600 dark:text-slate-400 font-bold";

    return (
      <span className={`text-[11px] font-mono tracking-tight ${color}`}>
        {m}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const s = (status || "").toUpperCase();
    if (s === "SUCCESS") {
      return (
        <span className="inline-flex items-center rounded-md border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
          SUCCESS
        </span>
      );
    }
    if (s === "FAILURE" || s === "FAILED" || s === "ERROR") {
      return (
        <span className="inline-flex items-center rounded-md border border-rose-500/25 bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-600 dark:text-rose-400">
          FAILED
        </span>
      );
    }
    return (
      <span className="inline-flex items-center rounded-md border border-amber-500/25 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
        {s}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
        <div className="p-6 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-4 py-2 border-b border-border/40 last:border-0">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-8 w-44 rounded-full" />
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-6 w-20 rounded-md" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-6 w-16 rounded-md" />
              <Skeleton className="h-4 w-12" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="rounded-xl border border-border/80 bg-card p-12 text-center shadow-xs">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-secondary/80 text-muted-foreground">
          <Shield className="size-7" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-foreground">No audit logs found</h3>
        <p className="mt-1 text-sm text-muted-foreground max-w-sm mx-auto">
          No logs match your current filter criteria or tab selection. Try adjusting the search or filters.
        </p>
      </div>
    );
  }

  const startRecord = (meta.page - 1) * meta.limit + 1;
  const endRecord = Math.min(meta.page * meta.limit, meta.total);

  // Pagination page pills helper
  const renderPaginationButtons = () => {
    const totalPages = meta.totalPages || 1;
    const currentPage = meta.page || 1;
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage, "...", totalPages);
      }
    }

    return pages.map((p, idx) => {
      if (p === "...") {
        return (
          <span key={`dots-${idx}`} className="px-2 text-xs text-muted-foreground font-medium">
            ...
          </span>
        );
      }
      const pageNum = p as number;
      const isActive = pageNum === currentPage;
      return (
        <button
          key={pageNum}
          type="button"
          onClick={() => onPageChange(pageNum)}
          className={`flex size-8 items-center justify-center rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            isActive
              ? "bg-primary text-primary-foreground shadow-xs"
              : "border border-border bg-card text-foreground hover:bg-secondary"
          }`}
        >
          {pageNum}
        </button>
      );
    });
  };

  return (
    <div className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden transition-colors">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border/80 bg-muted/30 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-3.5 whitespace-nowrap">Time</th>
              <th className="px-5 py-3.5 whitespace-nowrap">User</th>
              <th className="px-5 py-3.5 whitespace-nowrap">Action</th>
              <th className="px-4 py-3.5 whitespace-nowrap">Module</th>
              <th className="px-4 py-3.5 whitespace-nowrap">Entity</th>
              <th className="px-4 py-3.5 whitespace-nowrap">Status</th>
              <th className="px-4 py-3.5 whitespace-nowrap">Method</th>
              <th className="px-4 py-3.5 whitespace-nowrap">Duration</th>
              <th className="px-4 py-3.5 whitespace-nowrap">IP Address</th>
              <th className="px-3 py-3.5 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {logs.map((log) => {
              const { datePart, timePart } = formatDateTime(log.createdAt);
              const modKey = (log.module || "").toLowerCase();
              const moduleStyle =
                moduleColorMap[modKey] ||
                "bg-secondary text-secondary-foreground border-border";
              
              const roleKey = (log.userRole || "").toLowerCase();
              const roleBadgeStyle =
                roleBadgeColorMap[roleKey] ||
                "bg-secondary text-secondary-foreground border-border";
              
              const avatarBg =
                avatarColorMap[roleKey] || "bg-primary text-primary-foreground";

              const userInitial = log.userName
                ? log.userName.charAt(0).toUpperCase()
                : "U";

              return (
                <tr
                  key={log._id || log.eventId}
                  onClick={() => onSelectLog(log)}
                  className="group hover:bg-secondary/40 transition-colors cursor-pointer"
                >
                  {/* Time */}
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <div className="flex flex-col text-xs font-mono">
                      <span className="font-semibold text-foreground">
                        {datePart}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {timePart}
                      </span>
                    </div>
                  </td>

                  {/* User */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8 shrink-0">
                        <AvatarFallback className={`text-xs font-bold ${avatarBg}`}>
                          {userInitial}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-foreground text-xs leading-tight truncate">
                          {log.userName || "System User"}
                        </span>
                        <span className="text-[11px] text-muted-foreground truncate max-w-[150px]">
                          {log.userEmail || "—"}
                        </span>
                        {log.userRole && (
                          <span
                            className={`mt-0.5 inline-block w-fit px-1.5 py-0.2 rounded text-[10px] font-medium border ${roleBadgeStyle}`}
                          >
                            {log.userRole}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Action */}
                  <td className="px-5 py-3.5 max-w-[220px]">
                    <div className="flex flex-col">
                      <span className="font-mono text-xs font-bold text-foreground truncate" title={log.action}>
                        {log.action}
                      </span>
                      <span className="text-[11px] text-muted-foreground truncate" title={log.description || log.details}>
                        {log.description || log.details || "—"}
                      </span>
                    </div>
                  </td>

                  {/* Module */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span
                      className={`inline-block rounded-md border px-2.5 py-1 text-xs font-semibold capitalize ${moduleStyle}`}
                    >
                      {log.module}
                    </span>
                  </td>

                  {/* Entity */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="flex flex-col text-xs">
                      <span className="font-medium text-foreground">
                        {log.entityType || "—"}
                      </span>
                      {log.entityId && (
                        <span className="text-[11px] font-mono text-muted-foreground">
                          ID: {log.entityId}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    {getStatusBadge(log.status)}
                  </td>

                  {/* Method */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    {getMethodBadge(log.method)}
                  </td>

                  {/* Duration */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="font-mono text-xs text-muted-foreground">
                      {log.duration ?? 0}ms
                    </span>
                  </td>

                  {/* IP Address */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="font-mono text-xs text-muted-foreground">
                      {log.ipAddress || "::1"}
                    </span>
                  </td>

                  {/* View Details Action */}
                  <td className="px-4 py-3.5 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectLog(log);
                      }}
                      className="inline-flex items-center justify-center p-1.5 rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                      title="View Details"
                    >
                      <Eye className="size-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/80 px-6 py-4 bg-muted/10">
        <p className="text-xs text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{startRecord}</span> to{" "}
          <span className="font-semibold text-foreground">{endRecord}</span> of{" "}
          <span className="font-semibold text-foreground">{meta.total.toLocaleString()}</span> results
        </p>

        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(meta.page - 1)}
            disabled={!meta.hasPreviousPage && meta.page <= 1}
            className="size-8 rounded-lg cursor-pointer"
            title="Previous Page"
          >
            <ChevronLeft className="size-4" />
          </Button>

          {renderPaginationButtons()}

          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(meta.page + 1)}
            disabled={!meta.hasNextPage && meta.page >= meta.totalPages}
            className="size-8 rounded-lg cursor-pointer"
            title="Next Page"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
