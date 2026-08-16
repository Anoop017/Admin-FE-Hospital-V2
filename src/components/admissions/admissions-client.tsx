"use client";
import { useState, useEffect, useCallback } from "react";
import { Plus, Activity, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getAdmissions } from "@/lib/api";
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
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Admission Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage patient admissions.</p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gap-2">
          <Plus data-icon="inline-start" /> Add Admission
        </Button>
      </div>

      <Card className="border border-border bg-card">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 text-center">Loading...</div>
          ) : (
            <AdmissionTable items={filteredItems} onEdit={setEditItem} onDelete={setDeleteItem} />
          )}
        </CardContent>
      </Card>

      <CreateAdmissionDialog open={createOpen} onOpenChange={setCreateOpen} onSuccess={fetchItems} />
      {editItem && <EditAdmissionDialog item={editItem} open={!!editItem} onOpenChange={(v: boolean) => !v && setEditItem(null)} onSuccess={fetchItems} />}
      {deleteItem && <DeleteAdmissionDialog item={deleteItem} open={!!deleteItem} onOpenChange={(v: boolean) => !v && setDeleteItem(null)} onSuccess={fetchItems} />}
    </div>
  );
}
