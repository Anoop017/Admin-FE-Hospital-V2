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
          <div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">patientId</label><Input value={patientId} onChange={e => setPatientId(e.target.value)} required /></div><div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">doctorId</label><Input value={doctorId} onChange={e => setDoctorId(e.target.value)} required /></div><div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">appointmentDate</label><Input value={appointmentDate} onChange={e => setAppointmentDate(e.target.value)} required /></div><div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">reason</label><Input value={reason} onChange={e => setReason(e.target.value)} required /></div><div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">notes</label><Input value={notes} onChange={e => setNotes(e.target.value)} required /></div><div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">status</label><Input value={status} onChange={e => setStatus(e.target.value)} required /></div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
