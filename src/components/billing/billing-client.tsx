"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Plus,
  CreditCard,
  Search,
  DollarSign,
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCw,
  TrendingUp,
  PieChart,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { findAllBillsBilling, getBillingStats } from "@/lib/api";
import { BillTable } from "./bill-table";
import { CreateBillDialog } from "./create-bill-dialog";
import { EditBillDialog } from "./edit-bill-dialog";
import { DeleteBillDialog } from "./delete-bill-dialog";
import { RecordPaymentDialog } from "./record-payment-dialog";
import { ViewBillDialog } from "./view-bill-dialog";
import type { Bill } from "@/types";

export function BillingClient() {
  const [items, setItems] = useState<Bill[]>([]);
  const [backendStats, setBackendStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [take] = useState<number>(10);
  const [totalMeta, setTotalMeta] = useState<number>(0);
  
  // Modals
  const [createOpen, setCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<Bill | null>(null);
  const [deleteItem, setDeleteItem] = useState<Bill | null>(null);
  const [paymentItem, setPaymentItem] = useState<Bill | null>(null);
  const [viewItem, setViewItem] = useState<Bill | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const stats = await getBillingStats();
      if (stats) setBackendStats(stats);
    } catch (e) {
      console.error("Failed to load billing stats", e);
    }
  }, []);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const params: Record<string, any> = {
        page,
        take,
      };
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (statusFilter !== "all") params.status = statusFilter;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const data = await findAllBillsBilling(params);
      
      if (Array.isArray(data)) {
        setItems(data);
        if ((data as any)._meta?.total !== undefined) {
          setTotalMeta((data as any)._meta.total);
        } else {
          setTotalMeta(data.length);
        }
      } else if (data?.data && Array.isArray(data.data)) {
        setItems(data.data);
        setTotalMeta(data.meta?.total || data.data.length);
      } else {
        setItems([]);
        setTotalMeta(0);
      }
    } catch (err) {
      console.error("Failed to load bills:", err);
    } finally {
      setLoading(false);
    }
  }, [page, take, searchQuery, statusFilter, startDate, endDate]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Statistics calculation (combines backend stats with live array fallback)
  const stats = useMemo(() => {
    if (backendStats?.summary) {
      const s = backendStats.summary;
      return {
        totalInvoiced: parseFloat(String(s.totalBilled || 0)),
        totalCollected: parseFloat(String(s.totalRevenue || 0)),
        outstanding: parseFloat(String(s.outstandingReceivables || 0)),
        collectionRate: parseFloat(String(s.collectionRate || 0)),
        totalCount: s.totalBills ?? 0,
        unpaidCount: s.unpaidBills ?? 0,
        partiallyPaidCount: s.partiallyPaidBills ?? 0,
        paidCount: s.paidBills ?? 0,
        paymentMethods: backendStats.paymentMethods || [],
      };
    }

    // Fallback: calculate from loaded items
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
    const collectionRate = totalInvoiced > 0 ? (totalCollected / totalInvoiced) * 100 : 0;

    return {
      totalInvoiced,
      totalCollected,
      outstanding,
      collectionRate: parseFloat(collectionRate.toFixed(1)),
      totalCount: totalMeta || items.length,
      unpaidCount,
      partiallyPaidCount,
      paidCount,
      paymentMethods: [],
    };
  }, [backendStats, items, totalMeta]);

  const totalPages = Math.max(1, Math.ceil(totalMeta / take));

  const handleRefresh = () => {
    fetchStats();
    fetchItems();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Financial & Billing Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track revenue, manage patient invoices, process payments, and monitor collection rate.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleRefresh} disabled={loading} title="Refresh data">
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
        <Card className="border border-border bg-card shadow-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Total Invoiced</p>
              <p className="text-2xl font-bold text-foreground">
                ${stats.totalInvoiced.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-muted-foreground">{stats.totalCount} total bills</p>
            </div>
            <div className="rounded-full bg-primary/10 p-3 text-primary">
              <DollarSign className="size-5" />
            </div>
          </CardContent>
        </Card>

        {/* Total Collected */}
        <Card className="border border-border bg-card shadow-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Total Collected</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                ${stats.totalCollected.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                <TrendingUp className="size-3.5" />
                <span>{stats.collectionRate}% collection rate</span>
              </div>
            </div>
            <div className="rounded-full bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-5" />
            </div>
          </CardContent>
        </Card>

        {/* Outstanding Receivables */}
        <Card className="border border-border bg-card shadow-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Outstanding</p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                ${stats.outstanding.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-muted-foreground">{stats.unpaidCount + stats.partiallyPaidCount} pending bills</p>
            </div>
            <div className="rounded-full bg-amber-500/10 p-3 text-amber-600 dark:text-amber-400">
              <Clock className="size-5" />
            </div>
          </CardContent>
        </Card>

        {/* Total Invoices Breakdown */}
        <Card className="border border-border bg-card shadow-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Invoice Status</p>
              <p className="text-2xl font-bold text-foreground">{stats.totalCount}</p>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="text-destructive font-semibold">{stats.unpaidCount} unpaid</span>
                <span>•</span>
                <span className="text-emerald-600 font-medium">{stats.paidCount} paid</span>
              </div>
            </div>
            <div className="rounded-full bg-muted p-3 text-muted-foreground">
              <CreditCard className="size-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods Breakdown Banner */}
      {stats.paymentMethods && stats.paymentMethods.length > 0 && (
        <div className="flex flex-wrap items-center gap-4 rounded-lg border border-border bg-muted/30 p-3 text-xs">
          <span className="font-semibold text-foreground flex items-center gap-1.5">
            <PieChart className="size-3.5 text-primary" /> Payment Methods:
          </span>
          {stats.paymentMethods.map((pm: any, idx: number) => (
            <div key={idx} className="flex items-center gap-1.5 text-muted-foreground">
              <span className="capitalize font-medium text-foreground">{pm.method?.replace("_", " ")}:</span>
              <span>${parseFloat(String(pm.amount || 0)).toLocaleString()}</span>
              <span className="text-[10px] text-muted-foreground/80">({pm.count} txns)</span>
            </div>
          ))}
        </div>
      )}

      {/* Filters and Search Toolbar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border self-start">
          <button
            onClick={() => {
              setStatusFilter("all");
              setPage(1);
            }}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              statusFilter === "all"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All ({stats.totalCount})
          </button>
          <button
            onClick={() => {
              setStatusFilter("unpaid");
              setPage(1);
            }}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              statusFilter === "unpaid"
                ? "bg-background text-destructive shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Unpaid ({stats.unpaidCount})
          </button>
          <button
            onClick={() => {
              setStatusFilter("partially_paid");
              setPage(1);
            }}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              statusFilter === "partially_paid"
                ? "bg-background text-amber-600 dark:text-amber-400 shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Partially Paid ({stats.partiallyPaidCount})
          </button>
          <button
            onClick={() => {
              setStatusFilter("paid");
              setPage(1);
            }}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              statusFilter === "paid"
                ? "bg-background text-emerald-600 dark:text-emerald-400 shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Paid ({stats.paidCount})
          </button>
        </div>

        {/* Date Filter & Search Input */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Date range */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="size-3.5 text-muted-foreground" />
            <Input
              type="date"
              className="h-9 text-xs w-32"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPage(1);
              }}
            />
            <span>to</span>
            <Input
              type="date"
              className="h-9 text-xs w-32"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setPage(1);
              }}
            />
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search patient, invoice #..."
              className="pl-9 h-9 text-sm"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <Card className="border border-border bg-card overflow-hidden shadow-xs">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center p-12 text-sm text-muted-foreground">
              <RefreshCw className="size-4 animate-spin mr-2" />
              Loading invoices...
            </div>
          ) : (
            <BillTable
              items={items}
              onView={setViewItem}
              onEdit={setEditItem}
              onDelete={setDeleteItem}
              onPay={setPaymentItem}
            />
          )}

          {/* Pagination Toolbar */}
          <div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground">
            <span>
              Showing {items.length} of {totalMeta} bills
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                disabled={page <= 1 || loading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="size-3.5 mr-1" /> Previous
              </Button>
              <span className="font-medium text-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                disabled={page >= totalPages || loading}
                onClick={() => setPage((p) => p + 1)}
              >
                Next <ChevronRight className="size-3.5 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <CreateBillDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={handleRefresh}
      />

      {editItem && (
        <EditBillDialog
          item={editItem}
          open={!!editItem}
          onOpenChange={(v: boolean) => !v && setEditItem(null)}
          onSuccess={handleRefresh}
        />
      )}

      {deleteItem && (
        <DeleteBillDialog
          item={deleteItem}
          open={!!deleteItem}
          onOpenChange={(v: boolean) => !v && setDeleteItem(null)}
          onSuccess={handleRefresh}
        />
      )}

      {paymentItem && (
        <RecordPaymentDialog
          bill={paymentItem}
          open={!!paymentItem}
          onOpenChange={(v: boolean) => !v && setPaymentItem(null)}
          onSuccess={handleRefresh}
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
