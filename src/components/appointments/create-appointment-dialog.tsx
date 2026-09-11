import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createAppointment, getPatients, getDoctors } from "@/lib/api";
import { formatId } from "@/lib/formatters";
import type { Patient, Doctor } from "@/types";

export function CreateAppointmentDialog({ open, onOpenChange, onSuccess }: any) {
  const [patientId, setPatientId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
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
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const selectedPatient = patients.find((p) => String(p.id) === String(patientId));
  const selectedDoctor = doctors.find((d) => String(d.id) === String(doctorId));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule Appointment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Patient</label>
            <Select value={patientId} onValueChange={(val) => setPatientId(val || "")} required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select patient">
                  {selectedPatient
                    ? `${selectedPatient.user?.firstName || "Patient"} ${selectedPatient.user?.lastName || ""} (${formatId("patient", selectedPatient.id)})`
                    : "Select patient"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {patients.map((p) => (
                  <SelectItem key={p.id} value={String(p.id)}>
                    {p.user?.firstName ? `${p.user.firstName} ${p.user.lastName}` : `Patient #${p.id}`} • {formatId("patient", p.id)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Doctor</label>
            <Select value={doctorId} onValueChange={(val) => setDoctorId(val || "")} required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select doctor">
                  {selectedDoctor
                    ? `Dr. ${selectedDoctor.user?.firstName || ""} ${selectedDoctor.user?.lastName || ""} (${selectedDoctor.specialization || "Physician"})`
                    : "Select doctor"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {doctors.map((d) => (
                  <SelectItem key={d.id} value={String(d.id)}>
                    Dr. {d.user?.firstName ? `${d.user.firstName} ${d.user.lastName}` : `Doctor #${d.id}`} • {d.specialization || "General"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Appointment Date & Time</label>
            <Input
              type="datetime-local"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Chief Complaint / Reason</label>
            <Input
              placeholder="e.g. Annual physical examination, acute headache"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Clinical Notes (Optional)</label>
            <Input
              placeholder="Any relevant symptoms, prior history, or special instructions"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <DialogFooter className="mt-2">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Scheduling..." : "Schedule Appointment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
