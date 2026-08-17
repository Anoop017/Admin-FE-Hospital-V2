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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Patient</label>
              <Input value={item?.patient?.user ? `${item.patient.user.firstName} ${item.patient.user.lastName}` : patientId} disabled className="bg-gray-50" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Admitting Doctor</label>
              <Input value={item?.admittingDoctor?.user ? `Dr. ${item.admittingDoctor.user.firstName} ${item.admittingDoctor.user.lastName}` : admittingDoctorId} disabled className="bg-gray-50" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Bed</label>
              <Input value={item?.bed ? `Bed ${item.bed.bedNumber}` : bedId} disabled className="bg-gray-50" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Status</label>
              <select className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" value={status} onChange={e => setStatus(e.target.value)}>
                <option value="pending">Pending</option>
                <option value="admitted">Admitted</option>
                <option value="observation">Observation</option>
                <option value="transferred">Transferred</option>
                <option value="discharged">Discharged</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Reason</label>
            <Input value={reason} onChange={e => setReason(e.target.value)} required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Admission Date</label>
              <Input type="datetime-local" value={admissionDate?.substring(0, 16)} onChange={e => setAdmissionDate(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Discharge Date</label>
              <Input type="datetime-local" value={dischargeDate?.substring(0, 16)} onChange={e => setDischargeDate(e.target.value)} />
            </div>
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
