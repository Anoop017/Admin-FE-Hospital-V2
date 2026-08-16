import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { updateWard } from "@/lib/api";

export function EditWardDialog({ item, open, onOpenChange, onSuccess }: any) {
  const [name, setName] = useState(item.name || "");
  const [type, setType] = useState(item.type || "");
  const [capacity, setCapacity] = useState(item.capacity || "");
  const [floor, setFloor] = useState(item.floor || "");
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if(item) {
      setName(item.name || "");
      setType(item.type || "");
      setCapacity(item.capacity || "");
      setFloor(item.floor || "");
    }
  }, [item]);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    try {
      await updateWard(item.id, { name, type, capacity, floor });
      onSuccess();
      onOpenChange(false);
    } catch(err) { console.error(err); } finally { setLoading(false); }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Edit Ward</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">name</label><Input value={name} onChange={e => setName(e.target.value)} required /></div><div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">type</label><Input value={type} onChange={e => setType(e.target.value)} required /></div><div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">capacity</label><Input value={capacity} onChange={e => setCapacity(e.target.value)} required /></div><div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">floor</label><Input value={floor} onChange={e => setFloor(e.target.value)} required /></div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
