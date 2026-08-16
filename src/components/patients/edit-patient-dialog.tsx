import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updatePatient } from "@/lib/api";

export function EditPatientDialog({ item, open, onOpenChange, onSuccess }: any) {
  const [userId, setUserId] = useState(item?.userId || "");
  const [firstName, setFirstName] = useState(item?.user?.firstName || "");
  const [lastName, setLastName] = useState(item?.user?.lastName || "");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState(item?.gender || "");
  const [bloodGroup, setBloodGroup] = useState(item?.bloodGroup || "");
  const [address, setAddress] = useState(item?.address || "");
  const [medicalNotes, setMedicalNotes] = useState(item?.medicalNotes || "");
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if(item) {
      setUserId(item.userId || "");
      setFirstName(item.user?.firstName || "");
      setLastName(item.user?.lastName || "");
      
      if (item.dateOfBirth) {
        // Handle varying date formats (ensure it's YYYY-MM-DD for the date input)
        try {
           const d = new Date(item.dateOfBirth);
           if (!isNaN(d.getTime())) setDateOfBirth(d.toISOString().split('T')[0]);
           else setDateOfBirth("");
        } catch { setDateOfBirth(""); }
      } else {
        setDateOfBirth("");
      }

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
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Edit Patient</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">First Name</label>
              <Input value={firstName} disabled className="bg-gray-50" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Last Name</label>
              <Input value={lastName} disabled className="bg-gray-50" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium capitalize">Date of Birth</label>
              <Input type="date" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium capitalize">Gender</label>
              <Select value={gender} onValueChange={setGender} required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium capitalize">Blood Group</label>
            <Input value={bloodGroup} onChange={e => setBloodGroup(e.target.value)} required />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium capitalize">Address</label>
            <Input value={address} onChange={e => setAddress(e.target.value)} required />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium capitalize">Medical Notes</label>
            <Input value={medicalNotes} onChange={e => setMedicalNotes(e.target.value)} required />
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
