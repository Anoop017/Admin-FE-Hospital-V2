import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { updateMedicine } from "@/lib/api";

export function EditMedicineDialog({ item, open, onOpenChange, onSuccess }: any) {
  const [name, setName] = useState(item.name || "");
  const [manufacturer, setManufacturer] = useState(item.manufacturer || "");
  const [unitPrice, setUnitPrice] = useState(item.unitPrice || "");
  const [stockQuantity, setStockQuantity] = useState(item.stockQuantity || "");
  const [expiryDate, setExpiryDate] = useState(item.expiryDate || "");
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if(item) {
      setName(item.name || "");
      setManufacturer(item.manufacturer || "");
      setUnitPrice(item.unitPrice || "");
      setStockQuantity(item.stockQuantity || "");
      setExpiryDate(item.expiryDate || "");
    }
  }, [item]);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    try {
      await updateMedicine(item.id, { name, manufacturer, unitPrice, stockQuantity, expiryDate });
      onSuccess();
      onOpenChange(false);
    } catch(err) { console.error(err); } finally { setLoading(false); }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Edit Medicine</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">name</label><Input value={name} onChange={e => setName(e.target.value)} required /></div><div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">manufacturer</label><Input value={manufacturer} onChange={e => setManufacturer(e.target.value)} required /></div><div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">unitPrice</label><Input value={unitPrice} onChange={e => setUnitPrice(e.target.value)} required /></div><div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">stockQuantity</label><Input value={stockQuantity} onChange={e => setStockQuantity(e.target.value)} required /></div><div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">expiryDate</label><Input value={expiryDate} onChange={e => setExpiryDate(e.target.value)} required /></div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
