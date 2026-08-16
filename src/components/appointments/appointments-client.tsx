"use client";
import { useState, useEffect, useCallback } from "react";
import { Plus, CalendarCheck, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getAppointments } from "@/lib/api";
import { AppointmentTable } from "./appointment-table";
import { CreateAppointmentDialog } from "./create-appointment-dialog";
import { EditAppointmentDialog } from "./edit-appointment-dialog";
import { DeleteAppointmentDialog } from "./delete-appointment-dialog";
import type { Appointment } from "@/types";

export function AppointmentsClient() {
  const [items, setItems] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<Appointment | null>(null);
  const [deleteItem, setDeleteItem] = useState<Appointment | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAppointments();
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
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Appointment Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage patient appointments.</p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gap-2">
          <Plus data-icon="inline-start" /> Add Appointment
        </Button>
      </div>

      <Card className="border border-border bg-card">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 text-center">Loading...</div>
          ) : (
            <AppointmentTable items={filteredItems} onEdit={setEditItem} onDelete={setDeleteItem} />
          )}
        </CardContent>
      </Card>

      <CreateAppointmentDialog open={createOpen} onOpenChange={setCreateOpen} onSuccess={fetchItems} />
      {editItem && <EditAppointmentDialog item={editItem} open={!!editItem} onOpenChange={(v: boolean) => !v && setEditItem(null)} onSuccess={fetchItems} />}
      {deleteItem && <DeleteAppointmentDialog item={deleteItem} open={!!deleteItem} onOpenChange={(v: boolean) => !v && setDeleteItem(null)} onSuccess={fetchItems} />}
    </div>
  );
}
