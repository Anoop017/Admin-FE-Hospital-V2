import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { createStaf, createStafWithUser, getUsers, getDepartments } from "@/lib/api";

export function CreateStafDialog({ open, onOpenChange, onSuccess }: any) {
  const [creationMode, setCreationMode] = useState("assign");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  const [userId, setUserId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [hireDate, setHireDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);

  useEffect(() => {
    if (open) {
      getUsers("staff").then(setUsers).catch(console.error);
      getDepartments().then(setDepartments).catch(console.error);
    }
  }, [open]);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    try {
      if (creationMode === "assign") {
        await createStaf({ userId, departmentId, jobTitle, hireDate });
      } else {
        await createStafWithUser({
          user: { firstName, lastName, email, mobile, password, roles: ["staff"] },
          staff: { departmentId, jobTitle, hireDate }
        });
      }
      onSuccess();
      onOpenChange(false);
    } catch(err) { console.error(err); } finally { setLoading(false); }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto max-w-xl">
        <DialogHeader><DialogTitle>Create Staff</DialogTitle></DialogHeader>
        
        <Tabs value={creationMode} onValueChange={(val) => setCreationMode(val || "")} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="assign">Assign Existing User</TabsTrigger>
            <TabsTrigger value="create">Create New User</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <TabsContent value="assign" className="flex flex-col gap-4 mt-0">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium capitalize">User</label>
                <Select value={userId} onValueChange={(val) => setUserId(val || "")} required={creationMode === 'assign'}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select user">
                      {userId ? users.find(u => u.id === userId)?.firstName + " " + users.find(u => u.id === userId)?.lastName : "Select user"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {users.map(u => <SelectItem key={u.id} value={u.id}>{u.firstName} {u.lastName}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="create" className="flex flex-col gap-4 mt-0">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">First Name</label><Input value={firstName} onChange={e => setFirstName(e.target.value)} required={creationMode === 'create'} /></div>
                <div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">Last Name</label><Input value={lastName} onChange={e => setLastName(e.target.value)} required={creationMode === 'create'} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">Email</label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} required={creationMode === 'create'} /></div>
                <div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">Mobile</label><Input value={mobile} onChange={e => setMobile(e.target.value)} required={creationMode === 'create'} /></div>
              </div>
              <div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">Password</label><Input type="password" value={password} onChange={e => setPassword(e.target.value)} required={creationMode === 'create'} /></div>
            </TabsContent>

            <div className="border-t pt-4 flex flex-col gap-4">
              <h3 className="font-semibold text-sm">Staff Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium capitalize">Department</label>
                  <Select value={departmentId} onValueChange={(val) => setDepartmentId(val || "")} required>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select department">
                        {departmentId ? departments.find(d => d.id === departmentId)?.name : "Select department"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">Job Title</label><Input value={jobTitle} onChange={e => setJobTitle(e.target.value)} required /></div>
              </div>
              <div className="flex flex-col gap-2"><label className="text-sm font-medium capitalize">Hire Date</label><Input type="date" value={hireDate} onChange={e => setHireDate(e.target.value)} required /></div>
            </div>

            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" disabled={loading}>Create</Button>
            </DialogFooter>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
