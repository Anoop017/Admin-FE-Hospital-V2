import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createAdmission, getPatients, getDoctors, getBeds } from "@/lib/api";
import type { Patient, Doctor, Bed } from "@/types";

export function CreateAdmissionDialog({ open, onOpenChange, onSuccess }: any) {
  const [patientId, setPatientId] = useState("");
  const [admittingDoctorId, setAdmittingDoctorId] = useState("");
  const [bedId, setBedId] = useState("");
  const [admissionDate, setAdmissionDate] = useState("");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState("");
  const [dischargeDate, setDischargeDate] = useState("");
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
      await createAdmission({ patientId, admittingDoctorId, bedId, admissionDate, reason });
      onSuccess();
      onOpenChange(false);
    } catch(err) { console.error(err); } finally { setLoading(false); }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Create Admission</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Patient</label>
            <Select value={patientId} onValueChange={(val) => setPatientId(val || "")} required>
              <SelectTrigger className="w-full">
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
            <label className="text-sm font-medium">Admitting Doctor</label>
            <Select value={admittingDoctorId} onValueChange={(val) => setAdmittingDoctorId(val || "")} required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select doctor">
                  {admittingDoctorId ? "Dr. " + doctors.find(d => d.id === admittingDoctorId)?.user.firstName + " " + doctors.find(d => d.id === admittingDoctorId)?.user.lastName : "Select doctor"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {doctors.map(d => <SelectItem key={d.id} value={d.id}>Dr. {d.user.firstName} {d.user.lastName} ({d.specialization})</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Bed</label>
            <Select value={bedId} onValueChange={(val) => setBedId(val || "")} required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select bed">
                  {bedId ? "Bed " + beds.find(b => b.id === bedId)?.bedNumber + (beds.find(b => b.id === bedId)?.ward ? ` (${beds.find(b => b.id === bedId)?.ward?.name})` : "") : "Select bed"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {beds.map(b => <SelectItem key={b.id} value={b.id}>Bed {b.bedNumber}{b.ward ? ` (${b.ward.name})` : ""}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Admission Date</label>
            <Input type="datetime-local" value={admissionDate} onChange={e => setAdmissionDate(e.target.value)} required />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Reason</label>
            <Input value={reason} onChange={e => setReason(e.target.value)} required />
          </div>
          <DialogFooter className="mt-2">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
