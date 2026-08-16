import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { updateLaborator } from "@/lib/api";

export function EditLaboratorDialog({ item, open, onOpenChange, onSuccess }: any) {
  const [patientId, setPatientId] = useState(item.patientId || "");
  const [doctorId, setDoctorId] = useState(item.doctorId || "");
  const [testName, setTestName] = useState(item.testName || "");
  const [cost, setCost] = useState(item.cost || "");
  const [status, setStatus] = useState(item.status || "");
  const [resultDetails, setResultDetails] = useState(item.resultDetails || "");
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if(item) {
      setPatientId(item.patientId || "");
      setDoctorId(item.doctorId || "");
      setTestName(item.testName || "");
      setCost(item.cost || "");
      setStatus(item.status || "");
      setResultDetails(item.resultDetails || "");
    }
  }, [item]);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    try {
      await updateLaborator(item.id, { patientId, doctorId, testName, cost, status, resultDetails });
      onSuccess();
      onOpenChange(false);
    } catch(err) { console.error(err); } finally { setLoading(false); }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Edit Laborator</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">patientId</label><Input value={patientId} onChange={e => setPatientId(e.target.value)} required /></div><div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">doctorId</label><Input value={doctorId} onChange={e => setDoctorId(e.target.value)} required /></div><div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">testName</label><Input value={testName} onChange={e => setTestName(e.target.value)} required /></div><div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">cost</label><Input value={cost} onChange={e => setCost(e.target.value)} required /></div><div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">status</label><Input value={status} onChange={e => setStatus(e.target.value)} required /></div><div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">resultDetails</label><Input value={resultDetails} onChange={e => setResultDetails(e.target.value)} required /></div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
