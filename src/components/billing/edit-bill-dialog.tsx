import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateBillBilling, getPatients } from "@/lib/api";
import type { Bill, Patient } from "@/types";
import { AlertCircle, Calendar, DollarSign, User, FileEdit } from "lucide-react";

interface EditBillDialogProps {
  item: Bill | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EditBillDialog({ item, open, onOpenChange, onSuccess }: EditBillDialogProps) {
  const [patientId, setPatientId] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("unpaid");
  
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && item) {
      setError(null);
      setPatientId(item.patientId || "");
      setTotalAmount(String(item.totalAmount || ""));
      // format date YYYY-MM-DD
      const rawDate = item.dueDate ? item.dueDate.split("T")[0] : "";
      setDueDate(rawDate);
      setStatus(item.status || "unpaid");

      getPatients()
        .then(setPatients)
        .catch(console.error);
    }
  }, [item, open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!item) return;

    setError(null);
    const amountNum = parseFloat(totalAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError("Please enter a valid total amount.");
      return;
    }

    setLoading(true);
    try {
      await updateBillBilling(item.id, {
        ...(patientId ? { patientId } : {}),
        totalAmount: amountNum,
        dueDate,
        status,
      });
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || err?.message || "Failed to update bill.");
    } finally {
      setLoading(false);
    }
  }

  if (!item) return null;

  const selectedPatient = patients.find((p) => p.id === patientId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileEdit className="size-5 text-primary" />
            Edit Bill #{item.id.substring(0, 8)}
          </DialogTitle>
          <DialogDescription>
            Update billing details, status, or due date.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-1">
          {/* Patient Selection */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium flex items-center gap-1.5">
              <User className="size-4 text-muted-foreground" />
              Patient
            </label>
            <Select value={patientId} onValueChange={(val) => setPatientId(val || "")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select patient">
                  {selectedPatient
                    ? `${selectedPatient.user?.firstName ?? ""} ${selectedPatient.user?.lastName ?? ""}`.trim() || selectedPatient.id
                    : item.patient?.user
                    ? `${item.patient.user.firstName} ${item.patient.user.lastName}`
                    : "Select patient"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {patients.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {`${p.user?.firstName ?? ""} ${p.user?.lastName ?? ""}`.trim() || p.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Total Amount */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium flex items-center gap-1.5">
                <DollarSign className="size-4 text-muted-foreground" />
                Total Amount <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">$</span>
                <Input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  className="pl-7"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Due Date */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium flex items-center gap-1.5">
                <Calendar className="size-4 text-muted-foreground" />
                Due Date <span className="text-destructive">*</span>
              </label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Status Dropdown */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Payment Status</label>
            <Select value={status} onValueChange={(val) => setStatus(val || "unpaid")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unpaid">Unpaid</SelectItem>
                <SelectItem value="partially_paid">Partially Paid</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="mt-2 pt-2 border-t border-border">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
