import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { updateBillBilling } from "@/lib/api";

export function EditBillDialog({ item, open, onOpenChange, onSuccess }: any) {
  const [patientId, setPatientId] = useState(item.patientId || "");
  const [totalAmount, setTotalAmount] = useState(item.totalAmount || "");
  const [dueDate, setDueDate] = useState(item.dueDate || "");
  const [status, setStatus] = useState(item.status || "");
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if(item) {
      setPatientId(item.patientId || "");
      setTotalAmount(item.totalAmount || "");
      setDueDate(item.dueDate || "");
      setStatus(item.status || "");
    }
  }, [item]);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    try {
      await updateBillBilling(item.id, { patientId, totalAmount, dueDate, status });
      onSuccess();
      onOpenChange(false);
    } catch(err) { console.error(err); } finally { setLoading(false); }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Edit Bill</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">patientId</label><Input value={patientId} onChange={e => setPatientId(e.target.value)} required /></div><div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">totalAmount</label><Input value={totalAmount} onChange={e => setTotalAmount(e.target.value)} required /></div><div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">dueDate</label><Input value={dueDate} onChange={e => setDueDate(e.target.value)} required /></div><div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">status</label><Input value={status} onChange={e => setStatus(e.target.value)} required /></div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
