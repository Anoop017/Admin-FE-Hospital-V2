import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { updateLaborator } from "@/lib/api";

export function EditLaboratorDialog({ item, open, onOpenChange, onSuccess }: any) {
  const [patientId, setPatientId] = useState(item?.patientId || "");
  const [doctorId, setDoctorId] = useState(item?.doctorId || "");
  const [testName, setTestName] = useState(item?.testName || "");
  const [testType, setTestType] = useState(item?.testType || "");
  const [result, setResult] = useState(item?.result || "");
  const [status, setStatus] = useState(item?.status || "pending");
  const [testDate, setTestDate] = useState(item?.testDate || "");
  const [reportUrl, setReportUrl] = useState(item?.reportUrl || "");
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if(item) {
      setPatientId(item.patientId || "");
      setDoctorId(item.doctorId || "");
      setTestName(item.testName || "");
      setTestType(item.testType || "");
      setResult(item.result || "");
      setStatus(item.status || "pending");
      setTestDate(item.testDate || "");
      setReportUrl(item.reportUrl || "");
    }
  }, [item]);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    try {
      await updateLaborator(item.id, { patientId, doctorId, testName, testType, result, status, testDate, reportUrl });
      onSuccess();
      onOpenChange(false);
    } catch(err) { console.error(err); } finally { setLoading(false); }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Edit Lab Test</DialogTitle></DialogHeader>
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
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Test Name</label>
              <Input value={testName} onChange={e => setTestName(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Test Type</label>
              <Input value={testType} onChange={e => setTestType(e.target.value)} required />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Test Date</label>
              <Input type="datetime-local" value={testDate?.substring(0, 16)} onChange={e => setTestDate(e.target.value)} required />
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
            <Button type="submit" disabled={loading}>Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
