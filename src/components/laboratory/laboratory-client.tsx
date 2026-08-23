"use client";
import { useState, useEffect, useCallback } from "react";
import { Plus, Activity, Search, RefreshCw, CheckCircle2, Clock, XCircle, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getLaboratory, getLaboratoryStats } from "@/lib/api";
import { LaboratorTable } from "./laborator-table";
import { CreateLaboratorDialog } from "./create-laborator-dialog";
import { EditLaboratorDialog } from "./edit-laborator-dialog";
import { DeleteLaboratorDialog } from "./delete-laborator-dialog";
import type { Laborator } from "@/types";

export function LaboratoryClient() {
  const [items, setItems] = useState<Laborator[]>([]);
  const [stats, setStats] = useState<{ total: number; pending: number; completed: number; cancelled: number } | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<Laborator | null>(null);
  const [deleteItem, setDeleteItem] = useState<Laborator | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const s = await getLaboratoryStats();
      if (s) setStats(s);
    } catch (err) {
      console.error("Failed to load lab stats:", err);
    }
  }, []);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getLaboratory();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      // Handle error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchItems();
  }, [fetchStats, fetchItems]);

  const handleRefresh = () => {
    fetchStats();
    fetchItems();
  };

  const totalCount = stats?.total ?? items.length;
  const pendingCount = stats?.pending ?? items.filter((i) => i.status === "pending").length;
  const completedCount = stats?.completed ?? items.filter((i) => i.status === "completed").length;
  const cancelledCount = stats?.cancelled ?? items.filter((i) => i.status === "cancelled").length;

  const filteredItems = items.filter((i) => {
    if (statusFilter !== "all" && i.status?.toLowerCase() !== statusFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const patientName = `${i.patient?.user?.firstName || ""} ${i.patient?.user?.lastName || ""}`.toLowerCase();
    const docName = `${i.doctor?.user?.firstName || ""} ${i.doctor?.user?.lastName || ""}`.toLowerCase();
    const testName = i.testName?.toLowerCase() || "";
    const testType = i.testType?.toLowerCase() || "";
    return patientName.includes(q) || docName.includes(q) || testName.includes(q) || testType.includes(q);
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Diagnostic Laboratory</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Order pathology and imaging tests, record clinical findings, and publish digital reports.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleRefresh} disabled={loading} title="Refresh data">
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button onClick={() => setCreateOpen(true)} className="gap-2">
            <Plus className="size-4" /> Order Lab Test
          </Button>
        </div>
      </div>

      {/* Lab Stats KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border border-border bg-card shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Total Tests</p>
              <p className="text-2xl font-bold text-foreground mt-1">{totalCount}</p>
            </div>
            <div className="rounded-full bg-primary/10 p-3 text-primary">
              <Activity className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-amber-600 dark:text-amber-400">Pending</p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{pendingCount}</p>
            </div>
            <div className="rounded-full bg-amber-500/10 p-3 text-amber-600 dark:text-amber-400">
              <Clock className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Completed</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{completedCount}</p>
            </div>
            <div className="rounded-full bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Cancelled</p>
              <p className="text-2xl font-bold text-muted-foreground mt-1">{cancelledCount}</p>
            </div>
            <div className="rounded-full bg-muted p-3 text-muted-foreground">
              <XCircle className="size-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border self-start">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              statusFilter === "all"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All ({totalCount})
          </button>
          <button
            onClick={() => setStatusFilter("pending")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              statusFilter === "pending"
                ? "bg-background text-amber-600 dark:text-amber-400 shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setStatusFilter("completed")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              statusFilter === "completed"
                ? "bg-background text-emerald-600 dark:text-emerald-400 shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search test name, patient, doctor..."
            className="pl-9 h-9 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card className="border border-border bg-card shadow-xs">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              <RefreshCw className="size-4 animate-spin mx-auto mb-2" /> Loading laboratory tests...
            </div>
          ) : (
            <LaboratorTable items={filteredItems} onEdit={setEditItem} onDelete={setDeleteItem} />
          )}
        </CardContent>
      </Card>

      <CreateLaboratorDialog open={createOpen} onOpenChange={setCreateOpen} onSuccess={handleRefresh} />
      {editItem && (
        <EditLaboratorDialog
          item={editItem}
          open={!!editItem}
          onOpenChange={(v: boolean) => !v && setEditItem(null)}
          onSuccess={handleRefresh}
        />
      )}
      {deleteItem && (
        <DeleteLaboratorDialog
          item={deleteItem}
          open={!!deleteItem}
          onOpenChange={(v: boolean) => !v && setDeleteItem(null)}
          onSuccess={handleRefresh}
        />
      )}
    </div>
  );
}
