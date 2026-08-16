import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateBed } from "@/lib/api";

export function EditBedDialog({ item, open, onOpenChange, onSuccess }: any) {
  const [wardId, setWardId] = useState(item.wardId || "");
  const [bedNumber, setBedNumber] = useState(item.bedNumber || "");
  const [status, setStatus] = useState(item.status || "");
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if(item) {
      setWardId(item.wardId || "");
      setBedNumber(item.bedNumber || "");
      setStatus(item.status || "");
    }
  }, [item]);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    try {
      await updateBed(item.id, { wardId, bedNumber, status });
      onSuccess();
      onOpenChange(false);
    } catch(err) { console.error(err); } finally { setLoading(false); }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Edit Bed</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Ward ID</label>
            <Input value={wardId} onChange={e => setWardId(e.target.value)} required />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Bed Number</label>
            <Input value={bedNumber} onChange={e => setBedNumber(e.target.value)} required />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Status</label>
            <Select value={status} onValueChange={setStatus} required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="occupied">Occupied</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
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
