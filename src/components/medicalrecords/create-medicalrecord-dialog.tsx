import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { createMedicalRecord } from "@/lib/api";

export function CreateMedicalRecordDialog({ open, onOpenChange, onSuccess }: any) {
  const [patientId, setPatientId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [appointmentId, setAppointmentId] = useState("");
  const [recordType, setRecordType] = useState("");
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    try {
      await createMedicalRecord({ patientId, doctorId, appointmentId, recordType, description, attachments });
      onSuccess();
      onOpenChange(false);
    } catch(err) { console.error(err); } finally { setLoading(false); }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Create MedicalRecord</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">patientId</label><Input value={patientId} onChange={e => setPatientId(e.target.value)} required /></div><div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">doctorId</label><Input value={doctorId} onChange={e => setDoctorId(e.target.value)} required /></div><div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">appointmentId</label><Input value={appointmentId} onChange={e => setAppointmentId(e.target.value)} required /></div><div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">recordType</label><Input value={recordType} onChange={e => setRecordType(e.target.value)} required /></div><div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">description</label><Input value={description} onChange={e => setDescription(e.target.value)} required /></div><div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">attachments</label><Input value={attachments} onChange={e => setAttachments(e.target.value)} required /></div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
