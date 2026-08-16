import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { updateDoctor } from "@/lib/api";

export function EditDoctorDialog({ item, open, onOpenChange, onSuccess }: any) {
  const [userId, setUserId] = useState(item.userId || "");
  const [specialization, setSpecialization] = useState(item.specialization || "");
  const [licenseNumber, setLicenseNumber] = useState(item.licenseNumber || "");
  const [experienceYears, setExperienceYears] = useState(item.experienceYears || "");
  const [consultationFee, setConsultationFee] = useState(item.consultationFee || "");
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if(item) {
      setUserId(item.userId || "");
      setSpecialization(item.specialization || "");
      setLicenseNumber(item.licenseNumber || "");
      setExperienceYears(item.experienceYears || "");
      setConsultationFee(item.consultationFee || "");
    }
  }, [item]);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    try {
      await updateDoctor(item.id, { userId, specialization, licenseNumber, experienceYears, consultationFee });
      onSuccess();
      onOpenChange(false);
    } catch(err) { console.error(err); } finally { setLoading(false); }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Edit Doctor</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">userId</label><Input value={userId} onChange={e => setUserId(e.target.value)} required /></div><div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">specialization</label><Input value={specialization} onChange={e => setSpecialization(e.target.value)} required /></div><div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">licenseNumber</label><Input value={licenseNumber} onChange={e => setLicenseNumber(e.target.value)} required /></div><div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">experienceYears</label><Input value={experienceYears} onChange={e => setExperienceYears(e.target.value)} required /></div><div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">consultationFee</label><Input value={consultationFee} onChange={e => setConsultationFee(e.target.value)} required /></div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
