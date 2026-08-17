import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { updateMedicalRecord } from "@/lib/api";

export function EditMedicalRecordDialog({ item, open, onOpenChange, onSuccess }: any) {
  const [patientId, setPatientId] = useState(item?.patientId || "");
  const [doctorId, setDoctorId] = useState(item?.doctorId || "");
  const [diagnosis, setDiagnosis] = useState(item?.diagnosis || "");
  const [symptoms, setSymptoms] = useState(item?.symptoms || "");
  const [treatment, setTreatment] = useState(item?.treatment || "");
  const [notes, setNotes] = useState(item?.notes || "");
  const [recordDate, setRecordDate] = useState(item?.recordDate || "");
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if(item) {
      setPatientId(item.patientId || "");
      setDoctorId(item.doctorId || "");
      setDiagnosis(item.diagnosis || "");
      setSymptoms(item.symptoms || "");
      setTreatment(item.treatment || "");
      setNotes(item.notes || "");
      setRecordDate(item.recordDate || "");
    }
  }, [item]);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    try {
      await updateMedicalRecord(item.id, { patientId, doctorId, diagnosis, symptoms, treatment, notes, recordDate });
      onSuccess();
      onOpenChange(false);
    } catch(err) { console.error(err); } finally { setLoading(false); }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Edit Medical Record</DialogTitle></DialogHeader>
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
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Record Date</label>
            <Input type="datetime-local" value={recordDate?.substring(0, 16)} onChange={e => setRecordDate(e.target.value)} required />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Diagnosis</label>
            <Input value={diagnosis} onChange={e => setDiagnosis(e.target.value)} required />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Symptoms</label>
            <Input value={symptoms} onChange={e => setSymptoms(e.target.value)} required />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Treatment</label>
            <Input value={treatment} onChange={e => setTreatment(e.target.value)} required />
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
