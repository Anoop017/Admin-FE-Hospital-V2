import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createAppointment, getPatients, getDoctors } from "@/lib/api";
import type { Patient, Doctor } from "@/types";

export function CreateAppointmentDialog({ open, onOpenChange, onSuccess }: any) {
  const [patientId, setPatientId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    if (open) {
      getPatients().then(setPatients).catch(console.error);
      getDoctors().then(setDoctors).catch(console.error);
    }
  }, [open]);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    try {
      await createAppointment({ patientId, doctorId, appointmentDate, reason, notes });
      onSuccess();
      onOpenChange(false);
    } catch(err) { console.error(err); } finally { setLoading(false); }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Create Appointment</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium capitalize">patient</label>
            <Select value={patientId} onValueChange={(val) => setPatientId(val || "")} required>
              <SelectTrigger>
                <SelectValue placeholder="Select patient">
                  {patientId ? patients.find(p => p.id === patientId)?.user.firstName + " " + patients.find(p => p.id === patientId)?.user.lastName : "Select patient"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {patients.map(p => <SelectItem key={p.id} value={p.id}>{p.user.firstName} {p.user.lastName}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium capitalize">doctor</label>
            <Select value={doctorId} onValueChange={(val) => setDoctorId(val || "")} required>
              <SelectTrigger>
                <SelectValue placeholder="Select doctor">
                  {doctorId ? "Dr. " + doctors.find(d => d.id === doctorId)?.user.firstName + " " + doctors.find(d => d.id === doctorId)?.user.lastName : "Select doctor"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {doctors.map(d => <SelectItem key={d.id} value={d.id}>Dr. {d.user.firstName} {d.user.lastName} ({d.specialization})</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">appointmentDate</label><Input value={appointmentDate} onChange={e => setAppointmentDate(e.target.value)} required /></div><div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">reason</label><Input value={reason} onChange={e => setReason(e.target.value)} required /></div><div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">notes</label><Input value={notes} onChange={e => setNotes(e.target.value)} required /></div><div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">status</label><Input value={status} onChange={e => setStatus(e.target.value)} required /></div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
