"use client";
import { useState, useEffect, useCallback } from "react";
import { Plus, Users, Search, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getPatients } from "@/lib/api";
import { PatientTable } from "./patient-table";
import { CreatePatientDialog } from "./create-patient-dialog";
import { EditPatientDialog } from "./edit-patient-dialog";
import { DeletePatientDialog } from "./delete-patient-dialog";
import { PatientSummaryDialog } from "./patient-summary-dialog";
import type { Patient } from "@/types";

export function PatientsClient() {
  const [items, setItems] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<Patient | null>(null);
  const [deleteItem, setDeleteItem] = useState<Patient | null>(null);
  const [summaryPatientId, setSummaryPatientId] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getPatients();
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

  const filteredItems = items.filter((i) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const name = `${i.user?.firstName || ""} ${i.user?.lastName || ""}`.toLowerCase();
    const email = i.user?.email?.toLowerCase() || "";
    const mobile = i.user?.mobile || "";
    const bloodGroup = i.bloodGroup?.toLowerCase() || "";
    const address = i.address?.toLowerCase() || "";
    return name.includes(q) || email.includes(q) || mobile.includes(q) || bloodGroup.includes(q) || address.includes(q) || i.id.includes(q);
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Patient Registry</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage hospital patient records, profiles, and access 360° clinical timelines.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={fetchItems} disabled={loading} title="Refresh data">
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button onClick={() => setCreateOpen(true)} className="gap-2">
            <Plus className="size-4" /> Add Patient
          </Button>
        </div>
      </div>

      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, phone..."
          className="pl-9 h-9 text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Card className="border border-border bg-card shadow-xs">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              <RefreshCw className="size-4 animate-spin mx-auto mb-2" /> Loading patients...
            </div>
          ) : (
            <PatientTable
              items={filteredItems}
              onViewSummary={(p) => setSummaryPatientId(p.id)}
              onEdit={setEditItem}
              onDelete={setDeleteItem}
            />
          )}
        </CardContent>
      </Card>

      <CreatePatientDialog open={createOpen} onOpenChange={setCreateOpen} onSuccess={fetchItems} />
      {editItem && (
        <EditPatientDialog
          item={editItem}
          open={!!editItem}
          onOpenChange={(v: boolean) => !v && setEditItem(null)}
          onSuccess={fetchItems}
        />
      )}
      {deleteItem && (
        <DeletePatientDialog
          item={deleteItem}
          open={!!deleteItem}
          onOpenChange={(v: boolean) => !v && setDeleteItem(null)}
          onSuccess={fetchItems}
        />
      )}

      {summaryPatientId && (
        <PatientSummaryDialog
          patientId={summaryPatientId}
          open={!!summaryPatientId}
          onOpenChange={(open) => !open && setSummaryPatientId(null)}
        />
      )}
    </div>
  );
}
