"use client";
import { useState, useEffect, useCallback } from "react";
import { Plus, BedDouble, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getWards } from "@/lib/api";
import { WardTable } from "./ward-table";
import { CreateWardDialog } from "./create-ward-dialog";
import { EditWardDialog } from "./edit-ward-dialog";
import { DeleteWardDialog } from "./delete-ward-dialog";
import type { Ward } from "@/types";

export function WardsClient() {
  const [items, setItems] = useState<Ward[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<Ward | null>(null);
  const [deleteItem, setDeleteItem] = useState<Ward | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getWards();
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
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Ward Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage hospital wards.</p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gap-2">
          <Plus data-icon="inline-start" /> Add Ward
        </Button>
      </div>

      <Card className="border border-border bg-card">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 text-center">Loading...</div>
          ) : (
            <WardTable items={filteredItems} onEdit={setEditItem} onDelete={setDeleteItem} />
          )}
        </CardContent>
      </Card>

      <CreateWardDialog open={createOpen} onOpenChange={setCreateOpen} onSuccess={fetchItems} />
      {editItem && <EditWardDialog item={editItem} open={!!editItem} onOpenChange={(v: boolean) => !v && setEditItem(null)} onSuccess={fetchItems} />}
      {deleteItem && <DeleteWardDialog item={deleteItem} open={!!deleteItem} onOpenChange={(v: boolean) => !v && setDeleteItem(null)} onSuccess={fetchItems} />}
    </div>
  );
}
