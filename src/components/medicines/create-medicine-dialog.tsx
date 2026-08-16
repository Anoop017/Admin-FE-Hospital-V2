import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { createMedicine } from "@/lib/api";

export function CreateMedicineDialog({ open, onOpenChange, onSuccess }: any) {
  const [name, setName] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    try {
      await createMedicine({ name, manufacturer, unitPrice: Number(unitPrice), stockQuantity: Number(stockQuantity), expiryDate });
      onSuccess();
      onOpenChange(false);
    } catch(err) { console.error(err); } finally { setLoading(false); }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Create Medicine</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">name</label><Input value={name} onChange={e => setName(e.target.value)} required /></div><div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">manufacturer</label><Input value={manufacturer} onChange={e => setManufacturer(e.target.value)} required /></div><div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">unitPrice</label><Input value={unitPrice} onChange={e => setUnitPrice(e.target.value)} required /></div><div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">stockQuantity</label><Input value={stockQuantity} onChange={e => setStockQuantity(e.target.value)} required /></div><div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">expiryDate</label><Input value={expiryDate} onChange={e => setExpiryDate(e.target.value)} required /></div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
