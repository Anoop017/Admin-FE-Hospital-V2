"use client";
import { useState, useEffect, useCallback } from "react";
import { Plus, Box, Search, AlertTriangle, CheckCircle2, RefreshCw, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getMedicines, getMedicinesStats } from "@/lib/api";
import { MedicineTable } from "./medicine-table";
import { CreateMedicineDialog } from "./create-medicine-dialog";
import { EditMedicineDialog } from "./edit-medicine-dialog";
import { DeleteMedicineDialog } from "./delete-medicine-dialog";
import type { Medicine } from "@/types";

export function MedicinesClient() {
  const [items, setItems] = useState<Medicine[]>([]);
  const [stats, setStats] = useState<{ totalMedicines: number; lowStockCount: number; outOfStockCount: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<Medicine | null>(null);
  const [deleteItem, setDeleteItem] = useState<Medicine | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const s = await getMedicinesStats();
      if (s) setStats(s);
    } catch (err) {
      console.error("Failed to load medicine stats:", err);
    }
  }, []);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const params: Record<string, any> = {};
      if (lowStockOnly) params.lowStock = true;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const data = await getMedicines(params);
      setItems(Array.isArray(data) ? data : []);
    } catch {
      // Handle error
    } finally {
      setLoading(false);
    }
  }, [lowStockOnly, searchQuery]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleRefresh = () => {
    fetchStats();
    fetchItems();
  };

  const filteredItems = items.filter((i) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      i.name?.toLowerCase().includes(q) ||
      i.manufacturer?.toLowerCase().includes(q) ||
      i.category?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Pharmacy & Medicine Inventory</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage pharmaceutical catalog, monitor stock health, and fulfill patient prescriptions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleRefresh} disabled={loading} title="Refresh data">
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button onClick={() => setCreateOpen(true)} className="gap-2">
            <Plus className="size-4" /> Add Medicine
          </Button>
        </div>
      </div>

      {/* Inventory Health KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border border-border bg-card shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Total Medications</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {stats?.totalMedicines ?? items.length}
              </p>
            </div>
            <div className="rounded-full bg-primary/10 p-3 text-primary">
              <Box className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card
          onClick={() => setLowStockOnly(!lowStockOnly)}
          className={`border cursor-pointer transition-all ${
            lowStockOnly
              ? "border-amber-500 bg-amber-500/10 shadow-xs"
              : "border-border bg-card hover:border-amber-500/50"
          }`}
        >
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Low Stock Alerts
              </p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                {stats?.lowStockCount ?? items.filter((m) => Number(m.stockQuantity || 0) < 10).length}
              </p>
              <span className="text-[11px] text-amber-600/80">Click to {lowStockOnly ? "clear filter" : "view low stock"}</span>
            </div>
            <div className="rounded-full bg-amber-500/15 p-3 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-destructive">Out of Stock</p>
              <p className="text-2xl font-bold text-destructive mt-1">
                {stats?.outOfStockCount ?? items.filter((m) => Number(m.stockQuantity || 0) === 0).length}
              </p>
              <span className="text-[11px] text-destructive/80">Critical replenishment required</span>
            </div>
            <div className="rounded-full bg-destructive/10 p-3 text-destructive">
              <XCircle className="size-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button
            variant={lowStockOnly ? "default" : "outline"}
            size="sm"
            onClick={() => setLowStockOnly(!lowStockOnly)}
            className="text-xs gap-1.5"
          >
            <AlertTriangle className="size-3.5" />
            {lowStockOnly ? "Showing Low Stock Only" : "Filter Low Stock"}
          </Button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search medicine, category, brand..."
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
              <RefreshCw className="size-4 animate-spin mx-auto mb-2" /> Loading inventory...
            </div>
          ) : (
            <MedicineTable items={filteredItems} onEdit={setEditItem} onDelete={setDeleteItem} />
          )}
        </CardContent>
      </Card>

      <CreateMedicineDialog open={createOpen} onOpenChange={setCreateOpen} onSuccess={handleRefresh} />
      {editItem && (
        <EditMedicineDialog
          item={editItem}
          open={!!editItem}
          onOpenChange={(v: boolean) => !v && setEditItem(null)}
          onSuccess={handleRefresh}
        />
      )}
      {deleteItem && (
        <DeleteMedicineDialog
          item={deleteItem}
          open={!!deleteItem}
          onOpenChange={(v: boolean) => !v && setDeleteItem(null)}
          onSuccess={handleRefresh}
        />
      )}
    </div>
  );
}
