import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { updateAdmission } from "@/lib/api";

export function EditAdmissionDialog({ item, open, onOpenChange, onSuccess }: any) {
  const [patientId, setPatientId] = useState(item.patientId || "");
  const [admittingDoctorId, setAdmittingDoctorId] = useState(item.admittingDoctorId || "");
  const [bedId, setBedId] = useState(item.bedId || "");
  const [admissionDate, setAdmissionDate] = useState(item.admissionDate || "");
  const [reason, setReason] = useState(item.reason || "");
  const [status, setStatus] = useState(item.status || "");
  const [dischargeDate, setDischargeDate] = useState(item.dischargeDate || "");
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if(item) {
      setPatientId(item.patientId || "");
      setAdmittingDoctorId(item.admittingDoctorId || "");
      setBedId(item.bedId || "");
      setAdmissionDate(item.admissionDate || "");
      setReason(item.reason || "");
      setStatus(item.status || "");
      setDischargeDate(item.dischargeDate || "");
    }
  }, [item]);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    try {
      await updateAdmission(item.id, { patientId, admittingDoctorId, bedId, admissionDate, reason, status, dischargeDate });
      onSuccess();
      onOpenChange(false);
    } catch(err) { console.error(err); } finally { setLoading(false); }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Edit Admission</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">patientId</label><Input value={patientId} onChange={e => setPatientId(e.target.value)} required /></div><div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">admittingDoctorId</label><Input value={admittingDoctorId} onChange={e => setAdmittingDoctorId(e.target.value)} required /></div><div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">bedId</label><Input value={bedId} onChange={e => setBedId(e.target.value)} required /></div><div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">admissionDate</label><Input value={admissionDate} onChange={e => setAdmissionDate(e.target.value)} required /></div><div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">reason</label><Input value={reason} onChange={e => setReason(e.target.value)} required /></div><div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">status</label><Input value={status} onChange={e => setStatus(e.target.value)} required /></div><div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">dischargeDate</label><Input value={dischargeDate} onChange={e => setDischargeDate(e.target.value)} required /></div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
