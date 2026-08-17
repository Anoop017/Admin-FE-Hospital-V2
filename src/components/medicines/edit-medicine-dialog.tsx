import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { updateMedicine } from "@/lib/api";

export function EditMedicineDialog({ item, open, onOpenChange, onSuccess }: any) {
  const [name, setName] = useState(item?.name || "");
  const [manufacturer, setManufacturer] = useState(item?.manufacturer || "");
  const [category, setCategory] = useState(item?.category || "");
  const [price, setPrice] = useState(item?.price || "");
  const [stockQuantity, setStockQuantity] = useState(item?.stockQuantity || "");
  const [expiryDate, setExpiryDate] = useState(item?.expiryDate || "");
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if(item) {
      setName(item.name || "");
      setManufacturer(item.manufacturer || "");
      setCategory(item.category || "");
      setPrice(item.price || "");
      setStockQuantity(item.stockQuantity || "");
      setExpiryDate(item.expiryDate ? item.expiryDate.split("T")[0] : "");
    }
  }, [item]);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    try {
      await updateMedicine(item.id, { name, manufacturer, category, price: Number(price), stockQuantity: Number(stockQuantity), expiryDate });
      onSuccess();
      onOpenChange(false);
    } catch(err) { console.error(err); } finally { setLoading(false); }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Edit Medicine</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Name</label>
            <Input value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Manufacturer</label>
            <Input value={manufacturer} onChange={e => setManufacturer(e.target.value)} required />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Category</label>
            <Input value={category} onChange={e => setCategory(e.target.value)} required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Price</label>
              <Input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Stock Quantity</label>
              <Input type="number" value={stockQuantity} onChange={e => setStockQuantity(e.target.value)} required />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Expiry Date</label>
            <Input type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} required />
          </div>
          <DialogFooter className="mt-2">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
