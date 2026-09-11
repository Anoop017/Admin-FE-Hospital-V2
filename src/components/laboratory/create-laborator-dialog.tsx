import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createLaborator, getPatients, getDoctors } from "@/lib/api";
import { formatId } from "@/lib/formatters";
import type { Patient, Doctor } from "@/types";

export function CreateLaboratorDialog({ open, onOpenChange, onSuccess }: any) {
  const [patientId, setPatientId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [testName, setTestName] = useState("");
  const [testType, setTestType] = useState("");
  const [result, setResult] = useState("");
  const [status, setStatus] = useState("pending");
  const [testDate, setTestDate] = useState("");
  const [reportUrl, setReportUrl] = useState("");
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
      await createLaborator({ patientId, doctorId, testName, testType, result, status, testDate, reportUrl });
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
          <DialogTitle>Order Laboratory Test</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
              <label className="text-sm font-medium">Ordering Physician</label>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Test Name / Panel</label>
              <Input
                placeholder="e.g. Complete Blood Count (CBC)"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Diagnostic Category</label>
              <Input
                placeholder="e.g. Hematology, Biochemistry, Immunology"
                value={testType}
                onChange={(e) => setTestType(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Specimen Collection Date</label>
              <Input
                type="datetime-local"
                value={testDate}
                onChange={(e) => setTestDate(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Test Status</label>
              <Select value={status} onValueChange={(val) => setStatus(val || "pending")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending Processing</SelectItem>
                  <SelectItem value="completed">Completed & Verified</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Diagnostic Findings / Result Values</label>
            <Input
              placeholder="e.g. WBC: 6.8 K/uL, RBC: 4.5 M/uL, Hemoglobin: 14.2 g/dL (Normal)"
              value={result}
              onChange={(e) => setResult(e.target.value)}
            />
          </div>

          <DialogFooter className="mt-2">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Ordering..." : "Order Lab Test"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
