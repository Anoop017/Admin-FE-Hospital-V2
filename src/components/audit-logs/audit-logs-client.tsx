"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Shield,
  Users,
  Download,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuditLogStatsCards } from "@/components/audit-logs/audit-log-stats-cards";
import { AuditLogFilterBar } from "@/components/audit-logs/audit-log-filter-bar";
import { AuditLogTable } from "@/components/audit-logs/audit-log-table";
import { AuditLogDrawer } from "@/components/audit-logs/audit-log-drawer";
import {
  getAuditLogs,
  getAuditLogStats,
  getAuditLogFilters,
  exportAuditLogs,
} from "@/lib/api";
import type {
  AuditLog,
  AuditLogStats,
  AuditLogFilters,
  AuditLogQueryParams,
  AuditLogsMeta,
} from "@/types";

export function AuditLogsClient() {
  const [activeTab, setActiveTab] = useState<"admin" | "others">("admin");
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [meta, setMeta] = useState<AuditLogsMeta>({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [stats, setStats] = useState<AuditLogStats | null>(null);
  const [filtersData, setFiltersData] = useState<AuditLogFilters | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [statsLoading, setStatsLoading] = useState<boolean>(true);
  const [exporting, setExporting] = useState<boolean>(false);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // Active filter state
  const [appliedFilters, setAppliedFilters] = useState<Partial<AuditLogQueryParams>>({});

  // 1. Initial load for dynamic filter options
  useEffect(() => {
    async function loadFilters() {
      const filters = await getAuditLogFilters();
      if (filters) {
        setFiltersData(filters);
      }
    }
    loadFilters();
  }, []);

  // 2. Fetch stats based on activeTab and active date filters
  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const isAdminParam = activeTab === "admin";
      const statsRes = await getAuditLogStats({
        isAdmin: isAdminParam,
        startDate: appliedFilters.startDate,
        endDate: appliedFilters.endDate,
      });
      setStats(statsRes);
    } catch (error) {
      console.error("Failed to load audit log stats:", error);
    } finally {
      setStatsLoading(false);
    }
  }, [activeTab, appliedFilters.startDate, appliedFilters.endDate]);

  // 3. Fetch audit logs table list
  const fetchLogs = useCallback(
    async (pageNumber = 1) => {
      try {
        setLoading(true);
        const isAdminParam = activeTab === "admin";
        const queryParams: AuditLogQueryParams = {
          isAdmin: isAdminParam,
          page: pageNumber,
          limit: 20,
          sortBy: "createdAt",
          sortOrder: "DESC",
          ...appliedFilters,
        };

        const res = await getAuditLogs(queryParams);
        setLogs(res.data || []);
        setMeta(
          res.meta || {
            total: res.data?.length || 0,
            page: pageNumber,
            limit: 20,
            totalPages: 1,
            hasNextPage: false,
            hasPreviousPage: false,
          }
        );
      } catch (error) {
        console.error("Failed to load audit logs:", error);
      } finally {
        setLoading(false);
      }
    },
    [activeTab, appliedFilters]
  );

  // Trigger data reload on tab or filter change
  useEffect(() => {
    fetchLogs(1);
    fetchStats();
  }, [fetchLogs, fetchStats]);

  // Handle tab switch
  const handleTabChange = (tab: "admin" | "others") => {
    setActiveTab(tab);
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || (meta.totalPages && newPage > meta.totalPages)) return;
    fetchLogs(newPage);
  };

  // Handle apply filters
  const handleApplyFilters = (newFilters: Partial<AuditLogQueryParams>) => {
    setAppliedFilters(newFilters);
  };

  // Handle reset filters
  const handleResetFilters = () => {
    setAppliedFilters({});
  };

  // Handle export to Excel
  const handleExport = async () => {
    try {
      setExporting(true);
      const queryParams: AuditLogQueryParams = {
        isAdmin: activeTab === "admin",
        ...appliedFilters,
      };
      await exportAuditLogs(queryParams);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export audit logs. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  const handleSelectLog = (log: AuditLog) => {
    setSelectedLog(log);
    setIsDrawerOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Audit Logs
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track and monitor all system activities and user actions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              fetchLogs(meta.page);
              fetchStats();
            }}
            disabled={loading}
            className="h-9 gap-1.5 cursor-pointer text-muted-foreground hover:text-foreground"
            title="Refresh logs"
          >
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <Button
            onClick={handleExport}
            disabled={exporting}
            className="h-9 gap-2 cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-xs"
          >
            {exporting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Download className="size-4" />
            )}
            {exporting ? "Exporting..." : "Export Logs"}
          </Button>
        </div>
      </div>

      {/* Main Tabs (Admin Logs vs Patient & Staff Logs) */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => handleTabChange("admin")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all cursor-pointer ${
            activeTab === "admin"
              ? "bg-primary text-primary-foreground shadow-xs ring-1 ring-primary"
              : "border border-border bg-card text-muted-foreground hover:bg-secondary hover:text-foreground"
          }`}
        >
          <Shield className="size-4" />
          Admin Logs
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("others")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all cursor-pointer ${
            activeTab === "others"
              ? "bg-primary text-primary-foreground shadow-xs ring-1 ring-primary"
              : "border border-border bg-card text-muted-foreground hover:bg-secondary hover:text-foreground"
          }`}
        >
          <Users className="size-4" />
          Patient & Staff Logs
        </button>
      </div>

      {/* Top KPI Metric Cards */}
      <AuditLogStatsCards stats={stats} loading={statsLoading} />

      {/* Filter Bar */}
      <AuditLogFilterBar
        filtersData={filtersData}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
        isLoading={loading}
      />

      {/* Logs Table */}
      <AuditLogTable
        logs={logs}
        meta={meta}
        loading={loading}
        onPageChange={handlePageChange}
        onSelectLog={handleSelectLog}
      />

      {/* Slide-over Log Details Drawer */}
      <AuditLogDrawer
        log={selectedLog}
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}
