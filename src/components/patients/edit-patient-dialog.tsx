import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { updatePatient } from "@/lib/api";

export function EditPatientDialog({ item, open, onOpenChange, onSuccess }: any) {
  const [userId, setUserId] = useState(item.userId || "");
  const [dateOfBirth, setDateOfBirth] = useState(item.dateOfBirth || "");
  const [gender, setGender] = useState(item.gender || "");
  const [bloodGroup, setBloodGroup] = useState(item.bloodGroup || "");
  const [address, setAddress] = useState(item.address || "");
  const [medicalNotes, setMedicalNotes] = useState(item.medicalNotes || "");
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if(item) {
      setUserId(item.userId || "");
      setDateOfBirth(item.dateOfBirth || "");
      setGender(item.gender || "");
      setBloodGroup(item.bloodGroup || "");
      setAddress(item.address || "");
      setMedicalNotes(item.medicalNotes || "");
    }
  }, [item]);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    try {
      await updatePatient(item.id, { userId, dateOfBirth, gender, bloodGroup, address, medicalNotes });
      onSuccess();
      onOpenChange(false);
    } catch(err) { console.error(err); } finally { setLoading(false); }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Edit Patient</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">userId</label><Input value={userId} onChange={e => setUserId(e.target.value)} required /></div><div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">dateOfBirth</label><Input value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} required /></div><div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">gender</label><Input value={gender} onChange={e => setGender(e.target.value)} required /></div><div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">bloodGroup</label><Input value={bloodGroup} onChange={e => setBloodGroup(e.target.value)} required /></div><div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">address</label><Input value={address} onChange={e => setAddress(e.target.value)} required /></div><div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">medicalNotes</label><Input value={medicalNotes} onChange={e => setMedicalNotes(e.target.value)} required /></div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
