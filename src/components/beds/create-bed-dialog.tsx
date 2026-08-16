import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createBed, getWards } from "@/lib/api";
import type { Ward } from "@/types";

export function CreateBedDialog({ open, onOpenChange, onSuccess }: any) {
  const [wardId, setWardId] = useState("");
  const [bedNumber, setBedNumber] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [wards, setWards] = useState<Ward[]>([]);

  useEffect(() => {
    if (open) {
      getWards().then(setWards).catch(console.error);
    }
  }, [open]);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    try {
      await createBed({ wardId, bedNumber });
      onSuccess();
      onOpenChange(false);
    } catch(err) { console.error(err); } finally { setLoading(false); }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Create Bed</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium capitalize">ward</label>
            <Select value={wardId} onValueChange={(val) => setWardId(val || "")} required>
              <SelectTrigger>
                <SelectValue placeholder="Select ward">
                  {wardId ? wards.find(w => w.id === wardId)?.name : "Select ward"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {wards.map(w => <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">bedNumber</label><Input value={bedNumber} onChange={e => setBedNumber(e.target.value)} required /></div><div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">status</label><Input value={status} onChange={e => setStatus(e.target.value)} required /></div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
