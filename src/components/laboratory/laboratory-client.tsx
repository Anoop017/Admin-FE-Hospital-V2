"use client";
import { useState, useEffect, useCallback } from "react";
import { Plus, Activity, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getLaboratory } from "@/lib/api";
import { LaboratorTable } from "./laborator-table";
import { CreateLaboratorDialog } from "./create-laborator-dialog";
import { EditLaboratorDialog } from "./edit-laborator-dialog";
import { DeleteLaboratorDialog } from "./delete-laborator-dialog";
import type { Laborator } from "@/types";

export function LaboratoryClient() {
  const [items, setItems] = useState<Laborator[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<Laborator | null>(null);
  const [deleteItem, setDeleteItem] = useState<Laborator | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getLaboratory();
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
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Laboratory</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage lab tests.</p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gap-2">
          <Plus data-icon="inline-start" /> Add Laborator
        </Button>
      </div>

      <Card className="border border-border bg-card">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 text-center">Loading...</div>
          ) : (
            <LaboratorTable items={filteredItems} onEdit={setEditItem} onDelete={setDeleteItem} />
          )}
        </CardContent>
      </Card>

      <CreateLaboratorDialog open={createOpen} onOpenChange={setCreateOpen} onSuccess={fetchItems} />
      {editItem && <EditLaboratorDialog item={editItem} open={!!editItem} onOpenChange={(v: boolean) => !v && setEditItem(null)} onSuccess={fetchItems} />}
      {deleteItem && <DeleteLaboratorDialog item={deleteItem} open={!!deleteItem} onOpenChange={(v: boolean) => !v && setDeleteItem(null)} onSuccess={fetchItems} />}
    </div>
  );
}
