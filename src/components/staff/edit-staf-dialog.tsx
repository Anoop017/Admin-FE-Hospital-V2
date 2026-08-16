import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { updateStaf } from "@/lib/api";

export function EditStafDialog({ item, open, onOpenChange, onSuccess }: any) {
  const [userId, setUserId] = useState(item.userId || "");
  const [departmentId, setDepartmentId] = useState(item.departmentId || "");
  const [jobTitle, setJobTitle] = useState(item.jobTitle || "");
  const [hireDate, setHireDate] = useState(item.hireDate || "");
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if(item) {
      setUserId(item.userId || "");
      setDepartmentId(item.departmentId || "");
      setJobTitle(item.jobTitle || "");
      setHireDate(item.hireDate || "");
    }
  }, [item]);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    try {
      await updateStaf(item.id, { userId, departmentId, jobTitle, hireDate });
      onSuccess();
      onOpenChange(false);
    } catch(err) { console.error(err); } finally { setLoading(false); }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Edit Staf</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">userId</label><Input value={userId} onChange={e => setUserId(e.target.value)} required /></div><div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">departmentId</label><Input value={departmentId} onChange={e => setDepartmentId(e.target.value)} required /></div><div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">jobTitle</label><Input value={jobTitle} onChange={e => setJobTitle(e.target.value)} required /></div><div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">hireDate</label><Input value={hireDate} onChange={e => setHireDate(e.target.value)} required /></div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
