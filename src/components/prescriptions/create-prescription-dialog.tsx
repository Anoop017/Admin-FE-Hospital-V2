import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createPrescription, getPatients, getDoctors } from "@/lib/api";
import { formatId } from "@/lib/formatters";
import type { Patient, Doctor } from "@/types";

export function CreatePrescriptionDialog({ open, onOpenChange, onSuccess }: any) {
  const [patientId, setPatientId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [medication, setMedication] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");
  const [issuedDate, setIssuedDate] = useState("");
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
      await createPrescription({ patientId, doctorId, medication, dosage, frequency, duration, notes, issuedDate });
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
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Issue Medical Prescription (Rx)</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <label className="text-sm font-medium">Prescribing Physician</label>
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
                      Dr. {d.user?.firstName ? `${d.user.firstName} ${d.user.lastName}` : `Doctor #${d.id}`} ({d.specialization || "General"})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Medication & Form</label>
            <Input
              placeholder="e.g. Amoxicillin 500mg Oral Capsule"
              value={medication}
              onChange={(e) => setMedication(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Dosage</label>
              <Input
                placeholder="e.g. 1 Tablet"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Frequency</label>
              <Input
                placeholder="e.g. TID (3x daily)"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Duration</label>
              <Input
                placeholder="e.g. 7 Days"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Issue Date & Time</label>
            <Input
              type="datetime-local"
              value={issuedDate}
              onChange={(e) => setIssuedDate(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Pharmacist / Patient Instructions</label>
            <Input
              placeholder="e.g. Take with food, complete full antibiotic course"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <DialogFooter className="mt-2">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Issuing..." : "Issue Prescription"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
