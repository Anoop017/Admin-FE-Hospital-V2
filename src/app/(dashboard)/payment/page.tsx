"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  CreditCard,
  CheckCircle2,
  Clock,
  RefreshCw,
  Receipt,
  FileDown,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import { findAllBillsBilling } from "@/lib/api";
import { downloadInvoicePdf } from "@/lib/reports";
import { formatId, formatDate, formatCurrency } from "@/lib/formatters";
import type { Bill, Payment } from "@/types";

export default function PaymentPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const billsRes = await findAllBillsBilling().catch(() => []);
      const billsList = Array.isArray(billsRes) ? billsRes : (billsRes as any)?.data || [];
      setBills(billsList);

      // Extract all recorded payment transactions across bills
      const allPayments: any[] = [];
      billsList.forEach((bill: Bill) => {
        if (bill.payments && Array.isArray(bill.payments)) {
          bill.payments.forEach((pay: Payment) => {
            allPayments.push({
              ...pay,
              patient: bill.patient,
              invoiceTotal: bill.totalAmount,
              billStatus: bill.status,
            });
          });
        }
      });
      setPayments(allPayments);
    } catch (err) {
      console.error("Failed to load payment transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalCollected = bills.reduce((acc, b) => acc + parseFloat(String(b.paidAmount || 0)), 0);
  const totalBilled = bills.reduce((acc, b) => acc + parseFloat(String(b.totalAmount || 0)), 0);
  const totalReceivables = Math.max(0, totalBilled - totalCollected);

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <DollarSign className="size-7 text-primary" /> Payment Transactions & Financial Ledger
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Audit trail of patient payment settlements, insurance reimbursements, and payment receipts.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={loadData} disabled={loading} className="gap-1.5 self-start">
          <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh Ledger
        </Button>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border border-border bg-card shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Settled</span>
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
                <CheckCircle2 className="size-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
              {formatCurrency(totalCollected)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Successfully settled payments across all departments.</p>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pending Receivables</span>
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600">
                <Clock className="size-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-2">
              {formatCurrency(totalReceivables)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Outstanding patient balances and pending invoices.</p>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Gross Billed Volume</span>
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600">
                <Receipt className="size-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground mt-2">
              {formatCurrency(totalBilled)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Total volume billed across inpatient and outpatient care.</p>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card className="border border-border bg-card shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">Transaction History Ledger</CardTitle>
          <CardDescription className="text-xs">
            Individual receipts and payment methods logged in the hospital database.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="w-full overflow-x-auto touch-pan-x">
            <table className="w-full text-left text-sm min-w-[800px]">
              <thead className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="h-10 px-4 whitespace-nowrap">Receipt / Pay ID</th>
                  <th className="h-10 px-4 whitespace-nowrap">Invoice Reference</th>
                  <th className="h-10 px-4 whitespace-nowrap">Patient</th>
                  <th className="h-10 px-4 whitespace-nowrap">Amount Paid</th>
                  <th className="h-10 px-4 whitespace-nowrap">Payment Method</th>
                  <th className="h-10 px-4 whitespace-nowrap">Transaction Ref</th>
                  <th className="h-10 px-4 whitespace-nowrap">Settled Date</th>
                  <th className="h-10 px-4 text-right whitespace-nowrap min-w-[100px]">Invoice PDF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {payments.length === 0 ? (
                  bills.map((b) => (
                    <tr key={b.id} className="transition-colors hover:bg-muted/30">
                      <td className="p-4 align-middle font-mono text-xs">
                        <Badge variant="outline">{formatId("payment", b.id)}</Badge>
                      </td>
                      <td className="p-4 align-middle font-mono text-xs text-muted-foreground">
                        {formatId("bill", b.id)}
                      </td>
                      <td className="p-4 align-middle font-medium text-foreground">
                        {b.patient?.user?.firstName ? `${b.patient.user.firstName} ${b.patient.user.lastName}` : `Patient #${b.patientId}`}
                      </td>
                      <td className="p-4 align-middle font-semibold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(b.paidAmount)}
                      </td>
                      <td className="p-4 align-middle capitalize text-xs">
                        <Badge variant="secondary" className="font-normal text-xs">
                          Direct Settlement
                        </Badge>
                      </td>
                      <td className="p-4 align-middle font-mono text-xs text-muted-foreground">
                        TXN-AUTO-{b.id}
                      </td>
                      <td className="p-4 align-middle text-xs text-muted-foreground">
                        {formatDate(b.updatedAt || b.createdAt)}
                      </td>
                      <td className="p-4 align-middle text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 gap-1 text-xs text-muted-foreground hover:text-primary"
                          onClick={() => downloadInvoicePdf(b.id)}
                        >
                          <FileDown className="size-3.5" /> PDF
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  payments.map((p) => (
                    <tr key={p.id} className="transition-colors hover:bg-muted/30">
                      <td className="p-4 align-middle font-mono text-xs">
                        <Badge variant="outline">{formatId("payment", p.id)}</Badge>
                      </td>
                      <td className="p-4 align-middle font-mono text-xs text-muted-foreground">
                        {formatId("bill", p.billId)}
                      </td>
                      <td className="p-4 align-middle font-medium text-foreground">
                        {p.patient?.user?.firstName ? `${p.patient.user.firstName} ${p.patient.user.lastName}` : "Patient"}
                      </td>
                      <td className="p-4 align-middle font-semibold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(p.amount)}
                      </td>
                      <td className="p-4 align-middle capitalize text-xs">
                        <Badge variant="secondary" className="font-normal text-xs">
                          {p.paymentMethod?.replace(/_/g, " ") || "Cash"}
                        </Badge>
                      </td>
                      <td className="p-4 align-middle font-mono text-xs text-muted-foreground">
                        {p.referenceNumber || "—"}
                      </td>
                      <td className="p-4 align-middle text-xs text-muted-foreground">
                        {formatDate(p.paymentDate || p.createdAt)}
                      </td>
                      <td className="p-4 align-middle text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 gap-1 text-xs text-muted-foreground hover:text-primary"
                          onClick={() => downloadInvoicePdf(p.billId)}
                        >
                          <FileDown className="size-3.5" /> PDF
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
