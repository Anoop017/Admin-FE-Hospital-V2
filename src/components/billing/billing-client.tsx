"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Plus, CreditCard, Search, DollarSign, CheckCircle2, Clock, AlertCircle, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { findAllBillsBilling } from "@/lib/api";
import { BillTable } from "./bill-table";
import { CreateBillDialog } from "./create-bill-dialog";
import { EditBillDialog } from "./edit-bill-dialog";
import { DeleteBillDialog } from "./delete-bill-dialog";
import { RecordPaymentDialog } from "./record-payment-dialog";
import { ViewBillDialog } from "./view-bill-dialog";
import type { Bill } from "@/types";

export function BillingClient() {
  const [items, setItems] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Modals
  const [createOpen, setCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<Bill | null>(null);
  const [deleteItem, setDeleteItem] = useState<Bill | null>(null);
  const [paymentItem, setPaymentItem] = useState<Bill | null>(null);
  const [viewItem, setViewItem] = useState<Bill | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const data = await findAllBillsBilling();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load bills:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Statistics
  const stats = useMemo(() => {
    let totalInvoiced = 0;
    let totalCollected = 0;
    let unpaidCount = 0;
    let partiallyPaidCount = 0;
    let paidCount = 0;

    items.forEach((bill) => {
      const total = parseFloat(String(bill.totalAmount || 0));
      const paid = parseFloat(String(bill.paidAmount || 0));
      totalInvoiced += total;
      totalCollected += paid;

      const status = bill.status?.toLowerCase();
      if (status === "paid") paidCount++;
      else if (status === "partially_paid") partiallyPaidCount++;
      else unpaidCount++;
    });

    const outstanding = Math.max(0, totalInvoiced - totalCollected);

    return {
      totalInvoiced,
      totalCollected,
      outstanding,
      totalCount: items.length,
      unpaidCount,
      partiallyPaidCount,
      paidCount,
    };
  }, [items]);

  // Filtered Items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Status filter
      if (statusFilter !== "all" && item.status?.toLowerCase() !== statusFilter) {
        return false;
      }

      // Search query filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();

      const idMatch = item.id?.toLowerCase().includes(q);
      const patientName = `${item.patient?.user?.firstName || ""} ${item.patient?.user?.lastName || ""}`.toLowerCase();
      const nameMatch = patientName.includes(q);
      const emailMatch = item.patient?.user?.email?.toLowerCase().includes(q);
      const mobileMatch = item.patient?.user?.mobile?.includes(q);
      const statusMatch = item.status?.toLowerCase().includes(q);
      const amountMatch = String(item.totalAmount || "").includes(q);

      return idMatch || nameMatch || emailMatch || mobileMatch || statusMatch || amountMatch;
    });
  }, [items, statusFilter, searchQuery]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Billing & Invoices</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage patient invoices, payments, and track outstanding receivables.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={fetchItems} disabled={loading} title="Refresh data">
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button onClick={() => setCreateOpen(true)} className="gap-2">
            <Plus className="size-4" /> Create Bill
          </Button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Invoiced */}
        <Card className="border border-border bg-card">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Total Invoiced</p>
              <p className="text-2xl font-bold text-foreground">${stats.totalInvoiced.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              <p className="text-xs text-muted-foreground">{stats.totalCount} total invoices</p>
            </div>
            <div className="rounded-full bg-primary/10 p-3 text-primary">
              <DollarSign className="size-5" />
            </div>
          </CardContent>
        </Card>

        {/* Total Collected */}
        <Card className="border border-border bg-card">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Collected</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                ${stats.totalCollected.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80">{stats.paidCount} fully paid</p>
            </div>
            <div className="rounded-full bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-5" />
            </div>
          </CardContent>
        </Card>

        {/* Outstanding Balance */}
        <Card className="border border-border bg-card">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Outstanding</p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                ${stats.outstanding.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-muted-foreground">{stats.unpaidCount + stats.partiallyPaidCount} pending invoices</p>
            </div>
            <div className="rounded-full bg-amber-500/10 p-3 text-amber-600 dark:text-amber-400">
              <Clock className="size-5" />
            </div>
          </CardContent>
        </Card>

        {/* Total Bills */}
        <Card className="border border-border bg-card">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Total Invoices</p>
              <p className="text-2xl font-bold text-foreground">{stats.totalCount}</p>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="text-destructive font-medium">{stats.unpaidCount} unpaid</span>
                <span>•</span>
                <span className="text-amber-500 font-medium">{stats.partiallyPaidCount} partial</span>
              </div>
            </div>
            <div className="rounded-full bg-muted p-3 text-muted-foreground">
              <CreditCard className="size-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border self-start">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              statusFilter === "all"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All ({stats.totalCount})
          </button>
          <button
            onClick={() => setStatusFilter("unpaid")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              statusFilter === "unpaid"
                ? "bg-background text-destructive shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Unpaid ({stats.unpaidCount})
          </button>
          <button
            onClick={() => setStatusFilter("partially_paid")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              statusFilter === "partially_paid"
                ? "bg-background text-amber-600 dark:text-amber-400 shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Partially Paid ({stats.partiallyPaidCount})
          </button>
          <button
            onClick={() => setStatusFilter("paid")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              statusFilter === "paid"
                ? "bg-background text-emerald-600 dark:text-emerald-400 shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Paid ({stats.paidCount})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search patient, invoice #..."
            className="pl-9 h-9 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Main Table Card */}
      <Card className="border border-border bg-card overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center p-12 text-sm text-muted-foreground">
              <RefreshCw className="size-4 animate-spin mr-2" />
              Loading invoices...
            </div>
          ) : (
            <BillTable
              items={filteredItems}
              onView={setViewItem}
              onEdit={setEditItem}
              onDelete={setDeleteItem}
              onPay={setPaymentItem}
            />
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <CreateBillDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={fetchItems}
      />

      {editItem && (
        <EditBillDialog
          item={editItem}
          open={!!editItem}
          onOpenChange={(v: boolean) => !v && setEditItem(null)}
          onSuccess={fetchItems}
        />
      )}

      {deleteItem && (
        <DeleteBillDialog
          item={deleteItem}
          open={!!deleteItem}
          onOpenChange={(v: boolean) => !v && setDeleteItem(null)}
          onSuccess={fetchItems}
        />
      )}

      {paymentItem && (
        <RecordPaymentDialog
          bill={paymentItem}
          open={!!paymentItem}
          onOpenChange={(v: boolean) => !v && setPaymentItem(null)}
          onSuccess={fetchItems}
        />
      )}

      {viewItem && (
        <ViewBillDialog
          bill={viewItem}
          open={!!viewItem}
          onOpenChange={(v: boolean) => !v && setViewItem(null)}
          onRecordPayment={(bill) => {
            setViewItem(null);
            setPaymentItem(bill);
          }}
        />
      )}
    </div>
  );
}
