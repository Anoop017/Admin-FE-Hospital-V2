import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { createWard } from "@/lib/api";

export function CreateWardDialog({ open, onOpenChange, onSuccess }: any) {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [capacity, setCapacity] = useState("");
  const [floor, setFloor] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    try {
      await createWard({ name, type, capacity: Number(capacity), floor });
      onSuccess();
      onOpenChange(false);
    } catch(err) { console.error(err); } finally { setLoading(false); }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Create Ward</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">name</label><Input value={name} onChange={e => setName(e.target.value)} required /></div><div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">type</label><Input value={type} onChange={e => setType(e.target.value)} required /></div><div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">capacity</label><Input value={capacity} onChange={e => setCapacity(e.target.value)} required /></div><div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">floor</label><Input value={floor} onChange={e => setFloor(e.target.value)} required /></div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
