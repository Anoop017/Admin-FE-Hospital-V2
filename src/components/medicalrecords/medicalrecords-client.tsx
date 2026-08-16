"use client";
import { useState, useEffect, useCallback } from "react";
import { Plus, FileText, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getMedicalRecords } from "@/lib/api";
import { MedicalRecordTable } from "./medicalrecord-table";
import { CreateMedicalRecordDialog } from "./create-medicalrecord-dialog";
import { EditMedicalRecordDialog } from "./edit-medicalrecord-dialog";
import { DeleteMedicalRecordDialog } from "./delete-medicalrecord-dialog";
import type { MedicalRecord } from "@/types";

export function MedicalRecordsClient() {
  const [items, setItems] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<MedicalRecord | null>(null);
  const [deleteItem, setDeleteItem] = useState<MedicalRecord | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMedicalRecords();
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
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Medical Records</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage patient medical records.</p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gap-2">
          <Plus data-icon="inline-start" /> Add MedicalRecord
        </Button>
      </div>

      <Card className="border border-border bg-card">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 text-center">Loading...</div>
          ) : (
            <MedicalRecordTable items={filteredItems} onEdit={setEditItem} onDelete={setDeleteItem} />
          )}
        </CardContent>
      </Card>

      <CreateMedicalRecordDialog open={createOpen} onOpenChange={setCreateOpen} onSuccess={fetchItems} />
      {editItem && <EditMedicalRecordDialog item={editItem} open={!!editItem} onOpenChange={(v: boolean) => !v && setEditItem(null)} onSuccess={fetchItems} />}
      {deleteItem && <DeleteMedicalRecordDialog item={deleteItem} open={!!deleteItem} onOpenChange={(v: boolean) => !v && setDeleteItem(null)} onSuccess={fetchItems} />}
    </div>
  );
}
