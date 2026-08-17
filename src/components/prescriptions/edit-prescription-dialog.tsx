import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { updatePrescription } from "@/lib/api";

export function EditPrescriptionDialog({ item, open, onOpenChange, onSuccess }: any) {
  const [patientId, setPatientId] = useState(item?.patientId || "");
  const [doctorId, setDoctorId] = useState(item?.doctorId || "");
  const [medication, setMedication] = useState(item?.medication || "");
  const [dosage, setDosage] = useState(item?.dosage || "");
  const [frequency, setFrequency] = useState(item?.frequency || "");
  const [duration, setDuration] = useState(item?.duration || "");
  const [notes, setNotes] = useState(item?.notes || "");
  const [issuedDate, setIssuedDate] = useState(item?.issuedDate || "");
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if(item) {
      setPatientId(item.patientId || "");
      setDoctorId(item.doctorId || "");
      setMedication(item.medication || "");
      setDosage(item.dosage || "");
      setFrequency(item.frequency || "");
      setDuration(item.duration || "");
      setNotes(item.notes || "");
      setIssuedDate(item.issuedDate || "");
    }
  }, [item]);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    try {
      await updatePrescription(item.id, { patientId, doctorId, medication, dosage, frequency, duration, notes, issuedDate });
      onSuccess();
      onOpenChange(false);
    } catch(err) { console.error(err); } finally { setLoading(false); }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Edit Prescription</DialogTitle></DialogHeader>
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
            <label className="text-sm font-medium">Medication</label>
            <Input value={medication} onChange={e => setMedication(e.target.value)} required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Dosage</label>
              <Input value={dosage} onChange={e => setDosage(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Frequency</label>
              <Input value={frequency} onChange={e => setFrequency(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Duration</label>
              <Input value={duration} onChange={e => setDuration(e.target.value)} required />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Issued Date</label>
            <Input type="datetime-local" value={issuedDate?.substring(0, 16)} onChange={e => setIssuedDate(e.target.value)} />
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
