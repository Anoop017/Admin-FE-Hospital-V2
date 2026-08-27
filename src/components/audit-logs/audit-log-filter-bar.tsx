
"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Calendar,
  X,
  ChevronDown,
  ChevronUp,
  Bookmark
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { AuditLogFilters, AuditLogQueryParams } from "@/types";

interface AuditLogFilterBarProps {
  filtersData: AuditLogFilters | null;
  onApplyFilters: (filters: Partial<AuditLogQueryParams>) => void;
  onResetFilters: () => void;
  isLoading?: boolean;
}

export function AuditLogFilterBar({
  filtersData,
  onApplyFilters,
  onResetFilters,
  isLoading,
}: AuditLogFilterBarProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [quickDate, setQuickDate] = useState("Last 7 Days");
  
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [module, setModule] = useState("");
  const [action, setAction] = useState("");
  const [status, setStatus] = useState("");
  
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");
  const [entityType, setEntityType] = useState("");
  const [method, setMethod] = useState("");
  const [ipAddress, setIpAddress] = useState("");

  const handleApply = () => {
    onApplyFilters({
      search: search.trim() || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      module: module || undefined,
      action: action || undefined,
      status: status || undefined,
      userRole: userRole || undefined,
      entityType: entityType || undefined,
      method: method || undefined,
      // Pass these even if type checking might ignore them at the backend level, 
      // but they need to exist in AuditLogQueryParams for TS. (assuming we add them later or any to type)
      ...(userId ? { userId } : {}),
      ...(ipAddress ? { ipAddress } : {})
    } as any);
  };

  const handleReset = () => {
    setSearch("");
    setStartDate("");
    setEndDate("");
    setModule("");
    setAction("");
    setStatus("");
    setUserRole("");
    setUserId("");
    setEntityType("");
    setMethod("");
    setIpAddress("");
    setQuickDate("Custom Range");
    onResetFilters();
  };

  const setDateRange = (range: string) => {
    setQuickDate(range);
    const today = new Date();
    const formatDate = (d: Date) => d.toISOString().split("T")[0];
    
    if (range === "Today") {
      setStartDate(formatDate(today));
      setEndDate(formatDate(today));
    } else if (range === "Yesterday") {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      setStartDate(formatDate(yesterday));
      setEndDate(formatDate(yesterday));
    } else if (range === "Last 7 Days") {
      const last7 = new Date(today);
      last7.setDate(last7.getDate() - 7);
      setStartDate(formatDate(last7));
      setEndDate(formatDate(today));
    } else if (range === "Last 30 Days") {
      const last30 = new Date(today);
      last30.setDate(last30.getDate() - 30);
      setStartDate(formatDate(last30));
      setEndDate(formatDate(today));
    } else if (range === "This Month") {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      setStartDate(formatDate(startOfMonth));
      setEndDate(formatDate(today));
    }
  };

  return (
    <div className="rounded-xl border bg-card p-4 sm:p-5 shadow-xs transition-all duration-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold mr-2 text-foreground">Quick Date</span>
          {["Today", "Yesterday", "Last 7 Days", "Last 30 Days", "This Month", "Custom Range"].map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors flex items-center gap-1.5 ${
                quickDate === range 
                  ? "border-teal-500 text-teal-600 bg-teal-50/50" 
                  : "border-input bg-transparent text-muted-foreground hover:bg-secondary/50"
              }`}
            >
              {range === "Custom Range" && <Calendar className="size-3.5" />}
              {range}
            </button>
          ))}
        </div>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1.5 text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
        >
          {isExpanded ? "Hide Filters" : "Show Filters"}
          {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </button>
      </div>

      {isExpanded && (
        <div className="flex flex-col gap-5 pt-2">
          {/* Row 1: Search, Date Range, Module, Action, Status */}
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col gap-1.5 flex-[1.5] min-w-[200px]">
              <label className="text-xs font-medium text-foreground">Search</label>
              <div className="relative">
                <Input
                  placeholder="Search by user, action, module, entity..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-10 pl-3 pr-9 bg-transparent border-input text-sm"
                />
                <Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 flex-[2] min-w-[260px]">
              <label className="text-xs font-medium text-foreground">Date Range</label>
              <div className="flex h-10 w-full items-center rounded-md border border-input bg-transparent px-3 py-2">
                <Calendar className="mr-2 size-4 shrink-0 text-muted-foreground" />
                <div className="flex w-full items-center justify-between gap-1">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      setQuickDate("Custom Range");
                    }}
                    className="w-full bg-transparent text-xs text-foreground outline-hidden cursor-pointer"
                  />
                  <span className="text-muted-foreground text-xs font-semibold px-0.5">-</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      setQuickDate("Custom Range");
                    }}
                    className="w-full bg-transparent text-xs text-foreground outline-hidden cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 flex-1 min-w-[140px]">
              <label className="text-xs font-medium text-foreground">Module</label>
              <div className="relative">
                <select
                  value={module}
                  onChange={(e) => setModule(e.target.value)}
                  className="h-10 w-full appearance-none rounded-md border border-input bg-transparent pl-3 pr-9 text-sm text-foreground focus:outline-hidden focus:ring-1 focus:ring-ring cursor-pointer"
                >
                  <option value="">All Modules</option>
                  {filtersData?.modules?.map((m) => (
                    <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 flex-1 min-w-[140px]">
              <label className="text-xs font-medium text-foreground">Action</label>
              <div className="relative">
                <select
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                  className="h-10 w-full appearance-none rounded-md border border-input bg-transparent pl-3 pr-9 text-sm text-foreground focus:outline-hidden focus:ring-1 focus:ring-ring cursor-pointer"
                >
                  <option value="">All Actions</option>
                  {filtersData?.actions?.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 flex-1 min-w-[140px]">
              <label className="text-xs font-medium text-foreground">Status</label>
              <div className="relative">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="h-10 w-full appearance-none rounded-md border border-input bg-transparent pl-3 pr-9 text-sm text-foreground focus:outline-hidden focus:ring-1 focus:ring-ring cursor-pointer"
                >
                  <option value="">All Statuses</option>
                  <option value="SUCCESS">SUCCESS</option>
                  <option value="FAILURE">FAILURE</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
          </div>

          {/* Row 2: User Role, User, Entity Type, Method, IP Address */}
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col gap-1.5 flex-1 min-w-[140px]">
              <label className="text-xs font-medium text-foreground">User Role</label>
              <div className="relative">
                <select
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value)}
                  className="h-10 w-full appearance-none rounded-md border border-input bg-transparent pl-3 pr-9 text-sm text-foreground focus:outline-hidden focus:ring-1 focus:ring-ring cursor-pointer"
                >
                  <option value="">All Roles</option>
                  {filtersData?.roles?.map((r) => (
                    <option key={r} value={r}>{r.replace("_", " ").toUpperCase()}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 flex-1 min-w-[140px]">
              <label className="text-xs font-medium text-foreground">User</label>
              <div className="relative">
                <select
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="h-10 w-full appearance-none rounded-md border border-input bg-transparent pl-3 pr-9 text-sm text-foreground focus:outline-hidden focus:ring-1 focus:ring-ring cursor-pointer"
                >
                  <option value="">All Users</option>
                  {/* Dynamic users could go here if provided in filtersData */}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 flex-1 min-w-[140px]">
              <label className="text-xs font-medium text-foreground">Entity Type</label>
              <div className="relative">
                <select
                  value={entityType}
                  onChange={(e) => setEntityType(e.target.value)}
                  className="h-10 w-full appearance-none rounded-md border border-input bg-transparent pl-3 pr-9 text-sm text-foreground focus:outline-hidden focus:ring-1 focus:ring-ring cursor-pointer"
                >
                  <option value="">All Entity Types</option>
                  {filtersData?.entityTypes?.map((et) => (
                    <option key={et} value={et}>{et}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 flex-1 min-w-[140px]">
              <label className="text-xs font-medium text-foreground">Method</label>
              <div className="relative">
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="h-10 w-full appearance-none rounded-md border border-input bg-transparent pl-3 pr-9 text-sm text-foreground focus:outline-hidden focus:ring-1 focus:ring-ring cursor-pointer"
                >
                  <option value="">All Methods</option>
                  {filtersData?.methods?.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  )) || (
                    <>
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                      <option value="PUT">PUT</option>
                      <option value="PATCH">PATCH</option>
                      <option value="DELETE">DELETE</option>
                    </>
                  )}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 flex-1 min-w-[140px]">
              <label className="text-xs font-medium text-foreground">IP Address</label>
              <Input
                placeholder="Enter IP address"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
                className="h-10 bg-transparent border-input text-sm"
              />
            </div>
          </div>

          {/* Footer Row: Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="h-9 gap-1.5 px-4 text-foreground hover:bg-secondary border-input"
            >
              <X className="size-3.5" />
              Clear All
            </Button>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-2 px-4 flex-1 sm:flex-none border-input text-foreground hover:bg-secondary"
              >
                <Bookmark className="size-3.5" />
                Save Filter
              </Button>
              <Button
                size="sm"
                onClick={handleApply}
                disabled={isLoading}
                className="h-9 gap-2 px-5 flex-1 sm:flex-none bg-teal-600 hover:bg-teal-700 text-white font-medium"
              >
                <Filter className="size-3.5" />
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

