"use client";
import { useState, useEffect, useCallback } from "react";
import { Plus, Activity, Search, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAdmissions, dischargeAdmission } from "@/lib/api";
import { AdmissionTable } from "./admission-table";
import { CreateAdmissionDialog } from "./create-admission-dialog";
import { EditAdmissionDialog } from "./edit-admission-dialog";
import { DeleteAdmissionDialog } from "./delete-admission-dialog";
import type { Admission } from "@/types";

export function AdmissionsClient() {
  const [items, setItems] = useState<Admission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<Admission | null>(null);
  const [deleteItem, setDeleteItem] = useState<Admission | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAdmissions();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch admissions", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleDischarge = async (item: Admission) => {
    const confirmDischarge = confirm(
      `Discharge patient ${item.patient?.user?.firstName || ""} from admission #${item.id.substring(0, 8)}? This will automatically mark the assigned bed as available.`
    );
    if (!confirmDischarge) return;

    try {
      await dischargeAdmission(item.id);
      fetchItems();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to discharge patient.");
    }
  };

  const filteredItems = items.filter((i) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const patientName = `${i.patient?.user?.firstName || ""} ${i.patient?.user?.lastName || ""}`.toLowerCase();
    const docName = `${i.admittingDoctor?.user?.firstName || ""} ${i.admittingDoctor?.user?.lastName || ""}`.toLowerCase();
    return patientName.includes(q) || docName.includes(q) || i.reason?.toLowerCase().includes(q) || i.id.includes(q);
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Inpatient Admissions</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage hospital admissions, bed assignments, and patient discharges.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={fetchItems} disabled={loading} title="Refresh data">
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button onClick={() => setCreateOpen(true)} className="gap-2">
            <Plus className="size-4" /> Add Admission
          </Button>
        </div>
      </div>

      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search patient, doctor, reason..."
          className="pl-9 h-9 text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Card className="border border-border bg-card shadow-xs">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              <RefreshCw className="size-4 animate-spin mx-auto mb-2" /> Loading admissions...
            </div>
          ) : (
            <AdmissionTable
              items={filteredItems}
              onEdit={setEditItem}
              onDelete={setDeleteItem}
              onDischarge={handleDischarge}
            />
          )}
        </CardContent>
      </Card>

      <CreateAdmissionDialog open={createOpen} onOpenChange={setCreateOpen} onSuccess={fetchItems} />
      {editItem && (
        <EditAdmissionDialog
          item={editItem}
          open={!!editItem}
          onOpenChange={(v: boolean) => !v && setEditItem(null)}
          onSuccess={fetchItems}
        />
      )}
      {deleteItem && (
        <DeleteAdmissionDialog
          item={deleteItem}
          open={!!deleteItem}
          onOpenChange={(v: boolean) => !v && setDeleteItem(null)}
          onSuccess={fetchItems}
        />
      )}
    </div>
  );
}
