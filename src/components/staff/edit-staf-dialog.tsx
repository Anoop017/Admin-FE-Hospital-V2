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
        <DialogHeader><DialogTitle>Edit Staff</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">First Name</label>
              <Input value={item?.user?.firstName || "Unknown"} disabled className="bg-gray-50" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Last Name</label>
              <Input value={item?.user?.lastName || ""} disabled className="bg-gray-50" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium capitalize">Job Title</label>
            <Input value={jobTitle} onChange={e => setJobTitle(e.target.value)} required />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium capitalize">Hire Date</label>
            <Input type="date" value={hireDate ? new Date(hireDate).toISOString().split('T')[0] : ''} onChange={e => setHireDate(e.target.value)} required />
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
