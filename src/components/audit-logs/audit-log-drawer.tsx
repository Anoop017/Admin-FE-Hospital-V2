"use client";

import { useState, useEffect } from "react";
import {
  X,
  Copy,
  Check,
  Calendar,
  User,
  Shield,
  Activity,
  Layers,
  Globe,
  Clock,
  Laptop,
  CheckCircle2,
  AlertCircle,
  Clock3,
  Code2,
  FileText,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { AuditLog } from "@/types";

interface AuditLogDrawerProps {
  log: AuditLog | null;
  open: boolean;
  onClose: () => void;
}

export function AuditLogDrawer({ log, open, onClose }: AuditLogDrawerProps) {
  const [activeTab, setActiveTab] = useState<"details" | "metadata">("details");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open || !log) return null;

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => {
      setCopiedField((curr) => (curr === fieldName ? null : curr));
    }, 2000);
  };

  const getStatusBadge = (status: string) => {
    const normalized = (status || "").toUpperCase();
    if (normalized === "SUCCESS") {
      return (
        <Badge className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 gap-1 font-semibold text-[11px]">
          <CheckCircle2 className="size-3" />
          SUCCESS
        </Badge>
      );
    }
    if (normalized === "FAILURE" || normalized === "FAILED" || normalized === "ERROR") {
      return (
        <Badge className="border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 gap-1 font-semibold text-[11px]">
          <AlertCircle className="size-3" />
          FAILURE
        </Badge>
      );
    }
    return (
      <Badge className="border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 gap-1 font-semibold text-[11px]">
        <Clock3 className="size-3" />
        {status}
      </Badge>
    );
  };

  const getMethodBadgeClass = (method: string) => {
    const m = (method || "").toUpperCase();
    switch (m) {
      case "POST":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "GET":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      case "PUT":
        return "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20";
      case "PATCH":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
      case "DELETE":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const formattedTime = (() => {
    try {
      const d = new Date(log.createdAt);
      return d.toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
    } catch {
      return log.createdAt;
    }
  })();

  const userInitial = log.userName ? log.userName.charAt(0).toUpperCase() : "U";

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs transition-opacity duration-200"
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col bg-card shadow-2xl border-l border-border transition-transform duration-300 ease-out animate-in slide-in-from-right">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4.5 bg-card/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              Log Details
            </h2>
            {getStatusBadge(log.status)}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="size-8 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="size-4.5" />
          </Button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Key Details Grid */}
          <div className="rounded-xl border border-border/80 bg-secondary/30 p-4 space-y-3">
            {/* Event ID */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-muted-foreground">Event ID</span>
              <div className="flex items-center gap-1.5 font-mono text-[11px] text-foreground bg-background/80 px-2 py-0.5 rounded border border-border">
                <span className="truncate max-w-[200px]" title={log.eventId}>
                  {log.eventId}
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(log.eventId, "eventId")}
                  className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                  title="Copy Event ID"
                >
                  {copiedField === "eventId" ? (
                    <Check className="size-3 text-emerald-500" />
                  ) : (
                    <Copy className="size-3" />
                  )}
                </button>
              </div>
            </div>

            {/* Time */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-muted-foreground flex items-center gap-1.5">
                <Calendar className="size-3.5" />
                Time
              </span>
              <span className="font-medium text-foreground">{formattedTime}</span>
            </div>

            {/* User */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-muted-foreground flex items-center gap-1.5">
                <User className="size-3.5" />
                User
              </span>
              <div className="flex items-center gap-2">
                <Avatar className="size-5">
                  <AvatarFallback className="bg-primary/20 text-primary text-[10px] font-bold">
                    {userInitial}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium text-foreground">
                  {log.userName || "System"}
                </span>
                {log.userEmail && (
                  <span className="text-muted-foreground text-[11px]">
                    ({log.userEmail})
                  </span>
                )}
              </div>
            </div>

            {/* Role */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-muted-foreground flex items-center gap-1.5">
                <Shield className="size-3.5" />
                Role
              </span>
              <Badge variant="outline" className="font-medium text-[11px] uppercase">
                {log.userRole || "N/A"}
              </Badge>
            </div>

            {/* Action */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-muted-foreground flex items-center gap-1.5">
                <Activity className="size-3.5" />
                Action
              </span>
              <span className="font-semibold text-foreground font-mono text-[11px]">
                {log.action}
              </span>
            </div>

            {/* Module */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-muted-foreground flex items-center gap-1.5">
                <Layers className="size-3.5" />
                Module
              </span>
              <Badge
                variant="secondary"
                className="capitalize font-medium text-[11px] bg-primary/10 text-primary"
              >
                {log.module}
              </Badge>
            </div>

            {/* Entity */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-muted-foreground">Entity</span>
              <span className="font-medium text-foreground">
                {log.entityType || "N/A"}{" "}
                {log.entityId ? (
                  <span className="text-muted-foreground font-mono">
                    (ID: {log.entityId})
                  </span>
                ) : (
                  ""
                )}
              </span>
            </div>

            {/* Method & Endpoint */}
            <div className="flex items-start justify-between text-xs gap-2 pt-1 border-t border-border/50">
              <span className="font-medium text-muted-foreground flex items-center gap-1.5">
                <Globe className="size-3.5" />
                Endpoint
              </span>
              <div className="flex items-center gap-2 text-right">
                <Badge
                  variant="outline"
                  className={`text-[10px] font-bold ${getMethodBadgeClass(log.method)}`}
                >
                  {log.method}
                </Badge>
                <code className="text-[11px] font-mono text-foreground bg-background px-1.5 py-0.5 rounded border border-border/70 break-all">
                  {log.endpoint}
                </code>
              </div>
            </div>

            {/* Status Code & Duration */}
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border/50">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-muted-foreground">Status Code</span>
                <Badge
                  variant="outline"
                  className={`text-[11px] font-mono font-bold ${
                    (log.statusCode || 200) < 400
                      ? "text-emerald-600 border-emerald-500/30"
                      : "text-rose-600 border-rose-500/30"
                  }`}
                >
                  {log.statusCode || 200}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-muted-foreground flex items-center gap-1">
                  <Clock className="size-3" />
                  Duration
                </span>
                <span className="font-semibold text-foreground font-mono text-[11px]">
                  {log.duration ?? 0}ms
                </span>
              </div>
            </div>

            {/* IP Address */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-muted-foreground">IP Address</span>
              <code className="font-mono text-[11px] text-foreground">
                {log.ipAddress || "::1"}
              </code>
            </div>

            {/* User Agent */}
            <div className="flex flex-col gap-1 text-xs pt-1 border-t border-border/50">
              <span className="font-medium text-muted-foreground flex items-center gap-1.5">
                <Laptop className="size-3.5" />
                User Agent
              </span>
              <p className="text-[11px] text-muted-foreground font-mono bg-background/60 p-2 rounded border border-border/50 break-all">
                {log.userAgent || "Unknown"}
              </p>
            </div>
          </div>

          {/* Sub-Tabs: Details vs Metadata */}
          <div>
            <div className="flex border-b border-border">
              <button
                type="button"
                onClick={() => setActiveTab("details")}
                className={`flex items-center gap-1.5 pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                  activeTab === "details"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <FileText className="size-3.5" />
                Details
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("metadata")}
                className={`flex items-center gap-1.5 pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                  activeTab === "metadata"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Code2 className="size-3.5" />
                Metadata
              </button>
            </div>

            <div className="pt-4">
              {activeTab === "details" ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Description
                    </h4>
                    <div className="rounded-lg border border-border bg-secondary/20 p-3 text-sm text-foreground">
                      {log.description || "No description provided."}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Details
                    </h4>
                    <div className="rounded-lg border border-border bg-secondary/20 p-3 text-sm text-foreground leading-relaxed">
                      {log.details || log.description || "No details available."}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground">
                      Payload & Response Data
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(
                          JSON.stringify(log.metadata || {}, null, 2),
                          "metadataJson"
                        )
                      }
                      className="h-7 text-xs gap-1.5"
                    >
                      {copiedField === "metadataJson" ? (
                        <>
                          <Check className="size-3 text-emerald-500" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="size-3" />
                          Copy JSON
                        </>
                      )}
                    </Button>
                  </div>
                  <pre className="max-h-72 overflow-y-auto rounded-lg border border-border bg-muted/50 p-3.5 font-mono text-xs text-foreground leading-relaxed whitespace-pre-wrap break-all">
                    {JSON.stringify(log.metadata || {}, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
