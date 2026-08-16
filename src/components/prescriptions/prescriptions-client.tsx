"use client";
import { useState, useEffect, useCallback } from "react";
import { Plus, FileText, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getPrescriptions } from "@/lib/api";
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
      setItems(data || []);
    } catch {
      // Handle error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const filteredItems = items.filter((i) => {
    return true; // Simplified search
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Prescriptions</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage patient prescriptions.</p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gap-2">
          <Plus data-icon="inline-start" /> Add Prescription
        </Button>
      </div>

      <Card className="border border-border bg-card">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 text-center">Loading...</div>
          ) : (
            <PrescriptionTable items={filteredItems} onEdit={setEditItem} onDelete={setDeleteItem} />
          )}
        </CardContent>
      </Card>

      <CreatePrescriptionDialog open={createOpen} onOpenChange={setCreateOpen} onSuccess={fetchItems} />
      {editItem && <EditPrescriptionDialog item={editItem} open={!!editItem} onOpenChange={(v: boolean) => !v && setEditItem(null)} onSuccess={fetchItems} />}
      {deleteItem && <DeletePrescriptionDialog item={deleteItem} open={!!deleteItem} onOpenChange={(v: boolean) => !v && setDeleteItem(null)} onSuccess={fetchItems} />}
    </div>
  );
}
