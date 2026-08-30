import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Bill } from "@/types";
import { Receipt, Calendar, CreditCard, User, CheckCircle2, Clock, AlertTriangle, ArrowRight, FileDown } from "lucide-react";
import { downloadInvoicePdf } from "@/lib/reports";

interface ViewBillDialogProps {
  bill: Bill | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRecordPayment: (bill: Bill) => void;
}

export function ViewBillDialog({ bill, open, onOpenChange, onRecordPayment }: ViewBillDialogProps) {
  if (!bill) return null;

  const totalNum = parseFloat(String(bill.totalAmount || 0));
  const paidNum = parseFloat(String(bill.paidAmount || 0));
  const balanceNum = Math.max(0, totalNum - paidNum);

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">Paid</Badge>;
      case "partially_paid":
        return <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30">Partially Paid</Badge>;
      case "unpaid":
      default:
        return <Badge variant="destructive">Unpaid</Badge>;
    }
  };

  const patientName = bill.patient?.user
    ? `${bill.patient.user.firstName} ${bill.patient.user.lastName}`
    : `Patient #${bill.patientId}`;

  const isOverdue = bill.status !== "paid" && bill.dueDate && new Date(bill.dueDate) < new Date();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between pr-6">
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Receipt className="size-5 text-primary" />
              Invoice #{bill.id}
            </DialogTitle>
            {getStatusBadge(bill.status)}
          </div>
          <DialogDescription>
            Created on {bill.createdAt ? new Date(bill.createdAt).toLocaleDateString() : "N/A"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Patient Details */}
          <div className="rounded-lg border border-border bg-muted/30 p-3.5 space-y-1.5">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Patient Information</div>
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <User className="size-4 text-muted-foreground" />
              {patientName}
            </div>
            {bill.patient?.user?.email && (
              <div className="text-xs text-muted-foreground pl-6">Email: {bill.patient.user.email}</div>
            )}
            {bill.patient?.user?.mobile && (
              <div className="text-xs text-muted-foreground pl-6">Phone: {bill.patient.user.mobile}</div>
            )}
          </div>

          {/* Amount Overview Cards */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg border border-border bg-card p-3">
              <div className="text-xs text-muted-foreground">Total Invoiced</div>
              <div className="text-lg font-bold text-foreground mt-0.5">${totalNum.toFixed(2)}</div>
            </div>
            <div className="rounded-lg border border-border bg-card p-3">
              <div className="text-xs text-muted-foreground">Total Paid</div>
              <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">${paidNum.toFixed(2)}</div>
            </div>
            <div className="rounded-lg border border-border bg-card p-3">
              <div className="text-xs text-muted-foreground">Balance Due</div>
              <div className={`text-lg font-bold mt-0.5 ${balanceNum > 0 ? "text-primary" : "text-muted-foreground"}`}>
                ${balanceNum.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Dates & Reference Info */}
          <div className="rounded-lg border border-border p-3 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Calendar className="size-3.5" /> Due Date:
              </span>
              <span className={`font-medium ${isOverdue ? "text-destructive font-semibold" : "text-foreground"}`}>
                {bill.dueDate || "N/A"} {isOverdue && "(Overdue)"}
              </span>
            </div>
            {bill.admissionId && (
              <div className="flex justify-between items-center border-t border-border/50 pt-1.5">
                <span className="text-muted-foreground">Admission Link:</span>
                <span className="font-mono text-foreground font-medium">Admission #{bill.admissionId}</span>
              </div>
            )}
            {bill.appointmentId && (
              <div className="flex justify-between items-center border-t border-border/50 pt-1.5">
                <span className="text-muted-foreground">Appointment Link:</span>
                <span className="font-mono text-foreground font-medium">Appointment #{bill.appointmentId}</span>
              </div>
            )}
          </div>

          {/* Payment History Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <CreditCard className="size-3.5" /> Payment History ({bill.payments?.length || 0})
              </span>
            </div>

            {(!bill.payments || bill.payments.length === 0) ? (
              <div className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                No payments recorded yet for this invoice.
              </div>
            ) : (
              <div className="rounded-lg border border-border divide-y divide-border overflow-hidden text-xs">
                {bill.payments.map((p, idx) => (
                  <div key={p.id || idx} className="p-3 flex justify-between items-center bg-card hover:bg-muted/20 transition-colors">
                    <div>
                      <div className="font-medium text-foreground capitalize flex items-center gap-1.5">
                        <CheckCircle2 className="size-3.5 text-emerald-500" />
                        {p.paymentMethod.replace("_", " ")}
                      </div>
                      <div className="text-muted-foreground text-[11px] mt-0.5">
                        {p.paymentDate ? new Date(p.paymentDate).toLocaleString() : "Date N/A"}
                        {p.referenceNumber && ` • Ref: ${p.referenceNumber}`}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-foreground text-sm">${parseFloat(String(p.amount)).toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="mt-2 pt-2 border-t border-border flex items-center justify-between sm:justify-between gap-2">
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button
              variant="outline"
              onClick={() => downloadInvoicePdf(bill.id)}
              className="gap-1.5 text-primary hover:text-primary hover:bg-primary/10"
              title="Download Invoice PDF from Go Microservice"
            >
              <FileDown className="size-4" />
              Download PDF
            </Button>
          </div>
          {balanceNum > 0 && (
            <Button
              onClick={() => {
                onOpenChange(false);
                onRecordPayment(bill);
              }}
              className="gap-1.5"
            >
              <CreditCard className="size-4" />
              Record Payment
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
