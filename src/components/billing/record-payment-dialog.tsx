import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { makePaymentBilling } from "@/lib/api";
import type { Bill } from "@/types";
import { AlertCircle, CreditCard, DollarSign, Receipt, CheckCircle2 } from "lucide-react";

interface RecordPaymentDialogProps {
  bill: Bill | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function RecordPaymentDialog({ bill, open, onOpenChange, onSuccess }: RecordPaymentDialogProps) {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalNum = parseFloat(String(bill?.totalAmount || 0));
  const paidNum = parseFloat(String(bill?.paidAmount || 0));
  const remainingNum = Math.max(0, totalNum - paidNum);

  useEffect(() => {
    if (bill && open) {
      setError(null);
      setAmount(remainingNum > 0 ? remainingNum.toFixed(2) : "0.00");
      setPaymentMethod("credit_card");
      setReferenceNumber("");
    }
  }, [bill, open, remainingNum]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!bill) return;

    setError(null);
    const payAmountNum = parseFloat(amount);
    if (isNaN(payAmountNum) || payAmountNum <= 0) {
      setError("Please enter a valid payment amount greater than 0.");
      return;
    }

    if (payAmountNum > remainingNum) {
      setError(`Payment amount cannot exceed the remaining balance ($${remainingNum.toFixed(2)}).`);
      return;
    }

    setLoading(true);
    try {
      await makePaymentBilling({
        billId: bill.id,
        amount: payAmountNum,
        paymentMethod,
        ...(referenceNumber.trim() ? { referenceNumber: referenceNumber.trim() } : {}),
      });
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || err?.message || "Failed to record payment. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!bill) return null;

  const patientName = bill.patient?.user
    ? `${bill.patient.user.firstName} ${bill.patient.user.lastName}`
    : `Patient #${bill.patientId.substring(0, 8)}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="size-5 text-primary" />
            Record Payment
          </DialogTitle>
          <DialogDescription>
            Record a payment transaction for invoice #{bill.id.substring(0, 8)}.
          </DialogDescription>
        </DialogHeader>

        {/* Bill Summary Card */}
        <div className="rounded-lg border border-border bg-muted/40 p-3.5 space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Patient:</span>
            <span className="font-medium text-foreground">{patientName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Total Invoiced:</span>
            <span className="font-medium text-foreground">${totalNum.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Already Paid:</span>
            <span className="font-medium text-emerald-600 dark:text-emerald-400">${paidNum.toFixed(2)}</span>
          </div>
          <div className="border-t border-border/80 pt-2 flex justify-between items-center font-medium">
            <span className="text-foreground">Remaining Balance:</span>
            <span className="text-base text-primary font-semibold">${remainingNum.toFixed(2)}</span>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-1">
          {/* Payment Amount */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium flex items-center gap-1.5">
                <DollarSign className="size-4 text-muted-foreground" />
                Payment Amount <span className="text-destructive">*</span>
              </label>
              <button
                type="button"
                onClick={() => setAmount(remainingNum.toFixed(2))}
                className="text-xs text-primary hover:underline"
              >
                Pay Full Balance
              </button>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">$</span>
              <Input
                type="number"
                step="0.01"
                min="0.01"
                max={remainingNum}
                placeholder="0.00"
                className="pl-7"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Payment Method <span className="text-destructive">*</span></label>
            <Select value={paymentMethod} onValueChange={(val) => setPaymentMethod(val || "cash")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="credit_card">Credit / Debit Card</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="insurance">Insurance Claim</SelectItem>
                <SelectItem value="transfer">Bank Transfer / UPI</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reference / Transaction Number */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium flex items-center gap-1.5">
              <Receipt className="size-4 text-muted-foreground" />
              Reference / Transaction # <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
            </label>
            <Input
              type="text"
              placeholder="e.g. TXN-987654321 or Receipt #1042"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
            />
          </div>

          <DialogFooter className="mt-2 pt-2 border-t border-border">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || remainingNum <= 0} className="gap-2">
              {loading ? "Processing..." : "Confirm Payment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
