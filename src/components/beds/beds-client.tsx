"use client";
import { useState, useEffect, useCallback } from "react";
import { Plus, BedDouble, RefreshCw, LayoutGrid, List, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getBeds, getBedAvailabilityMatrix } from "@/lib/api";
import { BedTable } from "./bed-table";
import { CreateBedDialog } from "./create-bed-dialog";
import { EditBedDialog } from "./edit-bed-dialog";
import { DeleteBedDialog } from "./delete-bed-dialog";
import type { Bed } from "@/types";

export function BedsClient() {
  const [items, setItems] = useState<Bed[]>([]);
  const [matrix, setMatrix] = useState<any[]>([]);
  const [activeView, setActiveView] = useState<"matrix" | "table">("matrix");
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<Bed | null>(null);
  const [deleteItem, setDeleteItem] = useState<Bed | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [bedsRes, matrixRes] = await Promise.all([
        getBeds().catch(() => []),
        getBedAvailabilityMatrix().catch(() => []),
      ]);
      setItems(Array.isArray(bedsRes) ? bedsRes : []);
      setMatrix(Array.isArray(matrixRes) ? matrixRes : []);
    } catch (err) {
      console.error("Failed to fetch bed data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Total stats from matrix or beds list
  const totalBedsCount = items.length;
  const availableBedsCount = items.filter((b) => b.status === "available").length;
  const occupiedBedsCount = totalBedsCount - availableBedsCount;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Ward & Bed Occupancy Matrix</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Live occupancy grid by ward, real-time availability, and bed management.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex bg-muted/60 p-1 rounded-lg border border-border">
            <button
              onClick={() => setActiveView("matrix")}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
                activeView === "matrix"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutGrid className="size-3.5" /> Ward Grid
            </button>
            <button
              onClick={() => setActiveView("table")}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
                activeView === "table"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <List className="size-3.5" /> All Beds
            </button>
          </div>

          <Button variant="outline" size="icon" onClick={fetchData} disabled={loading} title="Refresh data">
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button onClick={() => setCreateOpen(true)} className="gap-2">
            <Plus className="size-4" /> Add Bed
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border border-border bg-card shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Total Beds</p>
              <p className="text-2xl font-bold text-foreground mt-1">{totalBedsCount}</p>
            </div>
            <div className="rounded-full bg-primary/10 p-3 text-primary">
              <BedDouble className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Available Beds</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{availableBedsCount}</p>
            </div>
            <div className="rounded-full bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Occupied Beds</p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{occupiedBedsCount}</p>
            </div>
            <div className="rounded-full bg-amber-500/10 p-3 text-amber-600 dark:text-amber-400">
              <XCircle className="size-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main View Area */}
      {activeView === "matrix" ? (
        <div className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center p-12 text-sm text-muted-foreground">
              <RefreshCw className="size-4 animate-spin mr-2" /> Loading live ward availability matrix...
            </div>
          ) : matrix.length === 0 ? (
            <Card className="border border-border p-8 text-center text-muted-foreground">
              <BedDouble className="size-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium text-foreground">No ward occupancy data available</p>
              <p className="text-xs mt-1">Add wards and beds to start monitoring live availability.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {matrix.map((ward: any) => {
                const total = ward.totalBeds ?? ward.beds?.length ?? 0;
                const available = ward.availableBeds ?? ward.beds?.filter((b: any) => b.status === "available").length ?? 0;
                const occupied = ward.occupiedBeds ?? (total - available);
                const occupancyRate = total > 0 ? Math.round((occupied / total) * 100) : 0;

                return (
                  <Card key={ward.wardId} className="border border-border bg-card shadow-xs flex flex-col">
                    <CardHeader className="pb-3 border-b border-border/60">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base font-bold text-foreground">{ward.wardName}</CardTitle>
                          <Badge variant="outline" className="mt-1 text-[11px] uppercase tracking-wider">
                            {ward.wardType || "General"} Ward
                          </Badge>
                        </div>
                        <Badge
                          variant="secondary"
                          className={
                            occupancyRate >= 90
                              ? "bg-red-500/15 text-red-600 dark:text-red-400"
                              : occupancyRate >= 50
                              ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                              : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                          }
                        >
                          {occupancyRate}% Occupied
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center text-xs text-muted-foreground pt-2">
                        <span><strong>{available}</strong> Available</span>
                        <span><strong>{occupied}</strong> Occupied</span>
                        <span><strong>{total}</strong> Total</span>
                      </div>
                    </CardHeader>

                    <CardContent className="p-4 flex-1">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">
                        Beds Layout
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {ward.beds?.map((bed: any) => {
                          const isAvailable = bed.status === "available";
                          return (
                            <div
                              key={bed.id}
                              className={`p-2.5 rounded-lg border text-center transition-all ${
                                isAvailable
                                  ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400"
                                  : "border-amber-500/30 bg-amber-500/5 text-amber-700 dark:text-amber-400"
                              }`}
                            >
                              <div className="font-mono text-xs font-bold">{bed.bedNumber}</div>
                              <div className="text-[10px] uppercase tracking-wider font-medium mt-0.5 opacity-90">
                                {bed.status}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <Card className="border border-border bg-card shadow-xs">
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground text-sm">
                <RefreshCw className="size-4 animate-spin mx-auto mb-2" /> Loading beds list...
              </div>
            ) : (
              <BedTable items={items} onEdit={setEditItem} onDelete={setDeleteItem} />
            )}
          </CardContent>
        </Card>
      )}

      {/* Dialogs */}
      <CreateBedDialog open={createOpen} onOpenChange={setCreateOpen} onSuccess={fetchData} />
      {editItem && (
        <EditBedDialog
          item={editItem}
          open={!!editItem}
          onOpenChange={(v: boolean) => !v && setEditItem(null)}
          onSuccess={fetchData}
        />
      )}
      {deleteItem && (
        <DeleteBedDialog
          item={deleteItem}
          open={!!deleteItem}
          onOpenChange={(v: boolean) => !v && setDeleteItem(null)}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
}
