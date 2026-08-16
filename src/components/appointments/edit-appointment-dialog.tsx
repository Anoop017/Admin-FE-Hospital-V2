import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { updateAppointment } from "@/lib/api";

export function EditAppointmentDialog({ item, open, onOpenChange, onSuccess }: any) {
  const [patientId, setPatientId] = useState(item.patientId || "");
  const [doctorId, setDoctorId] = useState(item.doctorId || "");
  const [appointmentDate, setAppointmentDate] = useState(item.appointmentDate || "");
  const [reason, setReason] = useState(item.reason || "");
  const [notes, setNotes] = useState(item.notes || "");
  const [status, setStatus] = useState(item.status || "");
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if(item) {
      setPatientId(item.patientId || "");
      setDoctorId(item.doctorId || "");
      setAppointmentDate(item.appointmentDate || "");
      setReason(item.reason || "");
      setNotes(item.notes || "");
      setStatus(item.status || "");
    }
  }, [item]);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    try {
      await updateAppointment(item.id, { patientId, doctorId, appointmentDate, reason, notes, status });
      onSuccess();
      onOpenChange(false);
    } catch(err) { console.error(err); } finally { setLoading(false); }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Edit Appointment</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Patient</label>
              <Input value={item?.patient?.user ? `${item.patient.user.firstName} ${item.patient.user.lastName}` : patientId} disabled className="bg-gray-50" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Doctor</label>
              <Input value={item?.doctor?.user ? `Dr. ${item.doctor.user.firstName} ${item.doctor.user.lastName}` : doctorId} disabled className="bg-gray-50" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Appointment Date</label>
              <Input type="datetime-local" value={appointmentDate?.substring(0, 16)} onChange={e => setAppointmentDate(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Status</label>
              <Input value={status} onChange={e => setStatus(e.target.value)} required />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Reason</label>
            <Input value={reason} onChange={e => setReason(e.target.value)} required />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Notes</label>
            <Input value={notes} onChange={e => setNotes(e.target.value)} />
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
