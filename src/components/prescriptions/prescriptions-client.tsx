"use client";
import { useState, useEffect, useCallback } from "react";
import { Plus, FileText, Search, RefreshCw, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getPrescriptions, fulfillPrescriptionPharmacy } from "@/lib/api";
import { PrescriptionTable } from "./prescription-table";
import { CreatePrescriptionDialog } from "./create-prescription-dialog";
import { EditPrescriptionDialog } from "./edit-prescription-dialog";
import { DeletePrescriptionDialog } from "./delete-prescription-dialog";
import type { Prescription } from "@/types";

export function PrescriptionsClient() {
  const [items, setItems] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<Prescription | null>(null);
  const [deleteItem, setDeleteItem] = useState<Prescription | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getPrescriptions();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      // Handle error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleFulfill = async (item: Prescription) => {
    const confirmFulfill = confirm(
      `Fulfill prescription for ${item.medication} (${item.dosage})? This will automatically deduct stock from pharmacy inventory.`
    );
    if (!confirmFulfill) return;

    try {
      await fulfillPrescriptionPharmacy(item.id);
      alert(`Prescription for ${item.medication} fulfilled successfully!`);
      fetchItems();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to fulfill prescription.");
    }
  };

  const filteredItems = items.filter((i) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const patientName = `${i.patient?.user?.firstName || ""} ${i.patient?.user?.lastName || ""}`.toLowerCase();
    const docName = `${i.doctor?.user?.firstName || ""} ${i.doctor?.user?.lastName || ""}`.toLowerCase();
    const med = i.medication?.toLowerCase() || "";
    return patientName.includes(q) || docName.includes(q) || med.includes(q) || String(i.id).includes(q);
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Prescription & Dispensing</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage doctor prescriptions, patient dosages, and execute pharmacy fulfillment.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={fetchItems} disabled={loading} title="Refresh data">
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button onClick={() => setCreateOpen(true)} className="gap-2">
            <Plus className="size-4" /> Add Prescription
          </Button>
        </div>
      </div>

      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search patient, doctor, medication..."
          className="pl-9 h-9 text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Card className="border border-border bg-card shadow-xs">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              <RefreshCw className="size-4 animate-spin mx-auto mb-2" /> Loading prescriptions...
            </div>
          ) : (
            <PrescriptionTable
              items={filteredItems}
              onEdit={setEditItem}
              onDelete={setDeleteItem}
              onFulfill={handleFulfill}
            />
          )}
        </CardContent>
      </Card>

      <CreatePrescriptionDialog open={createOpen} onOpenChange={setCreateOpen} onSuccess={fetchItems} />
      {editItem && (
        <EditPrescriptionDialog
          item={editItem}
          open={!!editItem}
          onOpenChange={(v: boolean) => !v && setEditItem(null)}
          onSuccess={fetchItems}
        />
      )}
      {deleteItem && (
        <DeletePrescriptionDialog
          item={deleteItem}
          open={!!deleteItem}
          onOpenChange={(v: boolean) => !v && setDeleteItem(null)}
          onSuccess={fetchItems}
        />
      )}
    </div>
  );
}
