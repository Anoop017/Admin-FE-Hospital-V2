import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createAdmission, getPatients, getDoctors, getBeds } from "@/lib/api";
import { formatId } from "@/lib/formatters";
import type { Patient, Doctor, Bed } from "@/types";

export function CreateAdmissionDialog({ open, onOpenChange, onSuccess }: any) {
  const [patientId, setPatientId] = useState("");
  const [admittingDoctorId, setAdmittingDoctorId] = useState("");
  const [bedId, setBedId] = useState("");
  const [admissionDate, setAdmissionDate] = useState("");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState("admitted");
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [beds, setBeds] = useState<Bed[]>([]);

  useEffect(() => {
    if (open) {
      getPatients().then(setPatients).catch(console.error);
      getDoctors().then(setDoctors).catch(console.error);
      getBeds().then(setBeds).catch(console.error);
    }
  }, [open]);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    try {
      await createAdmission({
        patientId,
        admittingDoctorId,
        bedId,
        admissionDate,
        reason,
        status: status || undefined,
      });
      onSuccess();
      onOpenChange(false);
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const selectedPatient = patients.find((p) => String(p.id) === String(patientId));
  const selectedDoctor = doctors.find((d) => String(d.id) === String(admittingDoctorId));
  const selectedBed = beds.find((b) => String(b.id) === String(bedId));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Admit Patient to Ward</DialogTitle>
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
            <label className="text-sm font-medium">Attending Physician / Doctor</label>
            <Select value={admittingDoctorId} onValueChange={(val) => setAdmittingDoctorId(val || "")} required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select attending physician">
                  {selectedDoctor
                    ? `Dr. ${selectedDoctor.user?.firstName || ""} ${selectedDoctor.user?.lastName || ""} (${selectedDoctor.specialization || "General"})`
                    : "Select attending physician"}
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
            <label className="text-sm font-medium">Assigned Bed</label>
            <Select value={bedId} onValueChange={(val) => setBedId(val || "")} required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select bed">
                  {selectedBed
                    ? `Bed ${selectedBed.bedNumber}${selectedBed.ward ? ` (${selectedBed.ward.name})` : ""}`
                    : "Select bed"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {beds.map((b) => (
                  <SelectItem key={b.id} value={String(b.id)}>
                    Bed {b.bedNumber} {b.ward ? `• ${b.ward.name}` : ""} {b.status ? `(${b.status})` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Admission Date & Time</label>
              <Input
                type="datetime-local"
                value={admissionDate}
                onChange={(e) => setAdmissionDate(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Admission Status</label>
              <Select value={status} onValueChange={(val) => setStatus(val || "admitted")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admitted">Admitted</SelectItem>
                  <SelectItem value="observation">Under Observation</SelectItem>
                  <SelectItem value="transferred">Transferred</SelectItem>
                  <SelectItem value="pending">Pending Bed Prep</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Admission Reason / Initial Diagnosis</label>
            <Input
              placeholder="e.g. Post-operative recovery, acute myocardial infarction"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>

          <DialogFooter className="mt-2">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Admitting..." : "Confirm Admission"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
