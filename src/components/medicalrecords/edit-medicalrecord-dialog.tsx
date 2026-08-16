import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { updateMedicalRecord } from "@/lib/api";

export function EditMedicalRecordDialog({ item, open, onOpenChange, onSuccess }: any) {
  const [patientId, setPatientId] = useState(item.patientId || "");
  const [doctorId, setDoctorId] = useState(item.doctorId || "");
  const [appointmentId, setAppointmentId] = useState(item.appointmentId || "");
  const [recordType, setRecordType] = useState(item.recordType || "");
  const [description, setDescription] = useState(item.description || "");
  const [attachments, setAttachments] = useState(item.attachments || "");
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if(item) {
      setPatientId(item.patientId || "");
      setDoctorId(item.doctorId || "");
      setAppointmentId(item.appointmentId || "");
      setRecordType(item.recordType || "");
      setDescription(item.description || "");
      setAttachments(item.attachments || "");
    }
  }, [item]);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    try {
      await updateMedicalRecord(item.id, { patientId, doctorId, appointmentId, recordType, description, attachments });
      onSuccess();
      onOpenChange(false);
    } catch(err) { console.error(err); } finally { setLoading(false); }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Edit MedicalRecord</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">patientId</label><Input value={patientId} onChange={e => setPatientId(e.target.value)} required /></div><div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">doctorId</label><Input value={doctorId} onChange={e => setDoctorId(e.target.value)} required /></div><div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">appointmentId</label><Input value={appointmentId} onChange={e => setAppointmentId(e.target.value)} required /></div><div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">recordType</label><Input value={recordType} onChange={e => setRecordType(e.target.value)} required /></div><div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">description</label><Input value={description} onChange={e => setDescription(e.target.value)} required /></div><div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">attachments</label><Input value={attachments} onChange={e => setAttachments(e.target.value)} required /></div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
