import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createLaborator, getPatients, getDoctors } from "@/lib/api";
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
    } catch(err) { console.error(err); } finally { setLoading(false); }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Create Lab Test</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
              <label className="text-sm font-medium">Doctor</label>
              <Select value={doctorId} onValueChange={(val) => setDoctorId(val || "")} required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select doctor">
                    {doctorId ? "Dr. " + doctors.find(d => d.id === doctorId)?.user.firstName + " " + doctors.find(d => d.id === doctorId)?.user.lastName : "Select doctor"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {doctors.map(d => <SelectItem key={d.id} value={d.id}>Dr. {d.user.firstName} {d.user.lastName} ({d.specialization})</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Test Name</label>
              <Input value={testName} onChange={e => setTestName(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Test Type</label>
              <Input value={testType} onChange={e => setTestType(e.target.value)} required />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Test Date</label>
              <Input type="datetime-local" value={testDate} onChange={e => setTestDate(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Status</label>
              <select className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" value={status} onChange={e => setStatus(e.target.value)}>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Result</label>
            <Input value={result} onChange={e => setResult(e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Report URL</label>
            <Input value={reportUrl} onChange={e => setReportUrl(e.target.value)} />
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
