import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createBillBilling, getPatients, getAdmissions, getAppointments } from "@/lib/api";
import type { Patient, Admission, Appointment } from "@/types";
import { AlertCircle, Calendar, DollarSign, User } from "lucide-react";

interface CreateBillDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateBillDialog({ open, onOpenChange, onSuccess }: CreateBillDialogProps) {
  const [patientId, setPatientId] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split("T")[0];
  });
  const [admissionId, setAdmissionId] = useState<string>("");
  const [appointmentId, setAppointmentId] = useState<string>("");
  
  const [patients, setPatients] = useState<Patient[]>([]);
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setError(null);
      setLoadingData(true);
      Promise.all([
        getPatients().catch(() => []),
        getAdmissions().catch(() => []),
        getAppointments().catch(() => []),
      ])
        .then(([patientsRes, admissionsRes, appointmentsRes]) => {
          setPatients(patientsRes || []);
          setAdmissions(admissionsRes || []);
          setAppointments(appointmentsRes || []);
        })
        .finally(() => {
          setLoadingData(false);
        });
    } else {
      // Reset form on close
      setPatientId("");
      setTotalAmount("");
      const d = new Date();
      d.setDate(d.getDate() + 7);
      setDueDate(d.toISOString().split("T")[0]);
      setAdmissionId("");
      setAppointmentId("");
      setError(null);
    }
  }, [open]);

  // Filter admissions and appointments by selected patient if applicable
  const patientAdmissions = admissions.filter((adm) => !patientId || adm.patientId === patientId);
  const patientAppointments = appointments.filter((apt) => !patientId || apt.patientId === patientId);

  const selectedPatient = patients.find((p) => p.id === patientId);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!patientId) {
      setError("Please select a patient.");
      return;
    }

    const amountNum = parseFloat(totalAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError("Please enter a valid total amount greater than 0.");
      return;
    }

    if (!dueDate) {
      setError("Please select a due date.");
      return;
    }

    setLoading(true);
    try {
      await createBillBilling({
        patientId,
        totalAmount: amountNum,
        dueDate,
        ...(admissionId && admissionId !== "none" ? { admissionId } : {}),
        ...(appointmentId && appointmentId !== "none" ? { appointmentId } : {}),
      });
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || err?.message || "Failed to create bill. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Generate New Bill</DialogTitle>
          <DialogDescription>
            Create an invoice for a patient. Newly generated bills start with an unpaid status.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-1">
          {/* Patient Selection */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium flex items-center gap-1.5">
              <User className="size-4 text-muted-foreground" />
              Patient <span className="text-destructive">*</span>
            </label>
            <Select
              value={patientId}
              onValueChange={(val) => {
                setPatientId(val || "");
                setAdmissionId("");
                setAppointmentId("");
              }}
              disabled={loadingData}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={loadingData ? "Loading patients..." : "Select patient"}>
                  {selectedPatient
                    ? `${selectedPatient.user?.firstName ?? ""} ${selectedPatient.user?.lastName ?? ""}`.trim() || selectedPatient.id
                    : "Select patient"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {patients.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground text-center">No patients found</div>
                ) : (
                  patients.map((p) => {
                    const name = `${p.user?.firstName ?? ""} ${p.user?.lastName ?? ""}`.trim() || "Unknown Patient";
                    const emailOrMobile = p.user?.email || p.user?.mobile || "";
                    return (
                      <SelectItem key={p.id} value={p.id}>
                        <div className="flex flex-col text-left">
                          <span className="font-medium text-foreground">{name}</span>
                          {emailOrMobile && <span className="text-xs text-muted-foreground">{emailOrMobile}</span>}
                        </div>
                      </SelectItem>
                    );
                  })
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Total Amount */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium flex items-center gap-1.5">
                <DollarSign className="size-4 text-muted-foreground" />
                Total Amount <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">$</span>
                <Input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  className="pl-7"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Due Date */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium flex items-center gap-1.5">
                <Calendar className="size-4 text-muted-foreground" />
                Due Date <span className="text-destructive">*</span>
              </label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Optional Admission Association */}
          {patientAdmissions.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-muted-foreground">
                Associated Admission <span className="text-xs font-normal">(Optional)</span>
              </label>
              <Select value={admissionId} onValueChange={(val) => setAdmissionId(val || "")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="None / Direct bill">
                    {admissionId && admissionId !== "none"
                      ? `Admission: ${admissionId.substring(0, 8)}...`
                      : "None / Direct bill"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None / Direct bill</SelectItem>
                  {patientAdmissions.map((adm) => (
                    <SelectItem key={adm.id} value={adm.id}>
                      Admission {adm.id.substring(0, 8)} — Reason: {adm.reason || "General"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Optional Appointment Association */}
          {patientAppointments.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-muted-foreground">
                Associated Appointment <span className="text-xs font-normal">(Optional)</span>
              </label>
              <Select value={appointmentId} onValueChange={(val) => setAppointmentId(val || "")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="None / Direct bill">
                    {appointmentId && appointmentId !== "none"
                      ? `Appointment: ${appointmentId.substring(0, 8)}...`
                      : "None / Direct bill"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None / Direct bill</SelectItem>
                  {patientAppointments.map((apt) => (
                    <SelectItem key={apt.id} value={apt.id}>
                      Appt: {apt.reason || "Checkup"} ({apt.appointmentDate?.split("T")[0] || ""})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <DialogFooter className="mt-4 pt-2 border-t border-border">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || loadingData}>
              {loading ? "Creating..." : "Create Bill"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
