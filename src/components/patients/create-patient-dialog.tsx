import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { createPatient, createPatientWithUser, getUsers } from "@/lib/api";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export function CreatePatientDialog({ open, onOpenChange, onSuccess }: any) {
  const [creationMode, setCreationMode] = useState("assign");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  const [userId, setUserId] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [address, setAddress] = useState("");
  const [medicalNotes, setMedicalNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    if (open) {
      getUsers("patient").then(setUsers).catch(console.error);
    }
  }, [open]);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    try {
      if (creationMode === "assign") {
        await createPatient({
          userId,
          dateOfBirth,
          gender: gender as any,
          bloodGroup: bloodGroup as any,
          address,
          medicalNotes,
        });
      } else {
        await createPatientWithUser({
          user: { firstName, lastName, email, mobile, password, roles: ["patient"] },
          patient: {
            dateOfBirth,
            gender: gender as any,
            bloodGroup: bloodGroup as any,
            address,
            medicalNotes,
          },
        });
      }
      onSuccess();
      onOpenChange(false);
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const selectedUser = users.find((u) => String(u.id) === String(userId));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto max-w-xl">
        <DialogHeader>
          <DialogTitle>Register Patient</DialogTitle>
        </DialogHeader>

        <Tabs value={creationMode} onValueChange={(val) => setCreationMode(val || "assign")} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="assign">Assign Existing User</TabsTrigger>
            <TabsTrigger value="create">Create New User Account</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <TabsContent value="assign" className="flex flex-col gap-4 mt-0">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">User Profile</label>
                <Select value={userId} onValueChange={(val) => setUserId(val || "")} required={creationMode === "assign"}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select existing user">
                      {selectedUser
                        ? `${selectedUser.firstName} ${selectedUser.lastName} (${selectedUser.email})`
                        : "Select existing user"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((u) => (
                      <SelectItem key={u.id} value={String(u.id)}>
                        {u.firstName} {u.lastName} • {u.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="create" className="flex flex-col gap-4 mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">First Name</label>
                  <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} required={creationMode === "create"} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Last Name</label>
                  <Input value={lastName} onChange={(e) => setLastName(e.target.value)} required={creationMode === "create"} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required={creationMode === "create"} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Mobile Phone</label>
                  <Input value={mobile} onChange={(e) => setMobile(e.target.value)} required={creationMode === "create"} />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Password</label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required={creationMode === "create"} />
              </div>
            </TabsContent>

            <div className="border-t pt-4 flex flex-col gap-4">
              <h3 className="font-semibold text-sm">Clinical & Demographics</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Date of Birth</label>
                  <Input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Gender</label>
                  <Select value={gender} onValueChange={(val) => setGender(val || "")} required>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Blood Group</label>
                  <Select value={bloodGroup} onValueChange={(val) => setBloodGroup(val || "")} required>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select blood type" />
                    </SelectTrigger>
                    <SelectContent>
                      {BLOOD_GROUPS.map((bg) => (
                        <SelectItem key={bg} value={bg}>
                          {bg}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Residential Address</label>
                  <Input placeholder="City, State / Street" value={address} onChange={(e) => setAddress(e.target.value)} required />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Medical / Allergy Notes</label>
                <Input placeholder="Known allergies, chronic conditions, or baseline notes" value={medicalNotes} onChange={(e) => setMedicalNotes(e.target.value)} />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Registering..." : "Register Patient"}
              </Button>
            </DialogFooter>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
