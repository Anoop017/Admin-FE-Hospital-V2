import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getPatientSummary } from "@/lib/api";
import {
  User,
  CalendarCheck,
  FileText,
  Activity,
  CreditCard,
  Pill,
  RefreshCw,
  Clock,
  HeartPulse,
} from "lucide-react";

interface PatientSummaryDialogProps {
  patientId: number | string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PatientSummaryDialog({
  patientId,
  open,
  onOpenChange,
}: PatientSummaryDialogProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "appointments" | "records" | "prescriptions" | "admissions" | "bills"
  >("appointments");

  useEffect(() => {
    if (open && patientId) {
      setLoading(true);
      getPatientSummary(patientId)
        .then((res) => setData(res))
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setData(null);
    }
  }, [open, patientId]);

  if (!open) return null;

  const patient = data?.patient;
  const timeline = data?.timeline || {};
  const appointments = timeline.recentAppointments || [];
  const records = timeline.recentMedicalRecords || [];
  const prescriptions = timeline.recentPrescriptions || [];
  const admissions = timeline.admissionsHistory || [];
  const bills = timeline.recentBills || [];

  const patientName = patient?.user
    ? `${patient.user.firstName} ${patient.user.lastName}`
    : `Patient #${patientId}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[680px] max-h-[88vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <HeartPulse className="size-5 text-primary" />
            <DialogTitle className="text-lg">Patient 360° Clinical History</DialogTitle>
          </div>
          <DialogDescription>
            Unified medical history and department activity timeline.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center p-12 text-sm text-muted-foreground">
            <RefreshCw className="size-4 animate-spin mr-2" /> Loading clinical history...
          </div>
        ) : (
          <div className="space-y-4 py-2">
            {/* Patient Header Card */}
            <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                    <User className="size-4 text-primary" />
                    {patientName}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {patient?.user?.email || "No email"} • {patient?.user?.mobile || "No phone"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {patient?.gender && (
                    <Badge variant="outline" className="capitalize text-xs">
                      {patient.gender}
                    </Badge>
                  )}
                  {patient?.bloodGroup && (
                    <Badge className="bg-red-500/10 text-red-600 border border-red-500/30 text-xs">
                      {patient.bloodGroup}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-border/60 text-xs text-muted-foreground">
                <div>
                  <span>DOB: </span>
                  <strong className="text-foreground">{patient?.dateOfBirth || "N/A"}</strong>
                </div>
                <div>
                  <span>Appointments: </span>
                  <strong className="text-foreground">{appointments.length}</strong>
                </div>
                <div>
                  <span>Prescriptions: </span>
                  <strong className="text-foreground">{prescriptions.length}</strong>
                </div>
                <div>
                  <span>Admissions: </span>
                  <strong className="text-foreground">{admissions.length}</strong>
                </div>
              </div>
            </div>

            {/* Department Navigation Tabs */}
            <div className="flex bg-muted/60 p-1 rounded-lg border border-border overflow-x-auto no-scrollbar gap-1">
              <button
                onClick={() => setActiveTab("appointments")}
                className={`flex shrink-0 items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-all ${
                  activeTab === "appointments"
                    ? "bg-background text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <CalendarCheck className="size-3.5" /> Appointments ({appointments.length})
              </button>
              <button
                onClick={() => setActiveTab("records")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-all ${
                  activeTab === "records"
                    ? "bg-background text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <FileText className="size-3.5" /> Clinical Notes ({records.length})
              </button>
              <button
                onClick={() => setActiveTab("prescriptions")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-all ${
                  activeTab === "prescriptions"
                    ? "bg-background text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Pill className="size-3.5" /> Prescriptions ({prescriptions.length})
              </button>
              <button
                onClick={() => setActiveTab("admissions")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-all ${
                  activeTab === "admissions"
                    ? "bg-background text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Activity className="size-3.5" /> Inpatient ({admissions.length})
              </button>
              <button
                onClick={() => setActiveTab("bills")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-all ${
                  activeTab === "bills"
                    ? "bg-background text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <CreditCard className="size-3.5" /> Billing ({bills.length})
              </button>
            </div>

            {/* Tab Contents */}
            <div className="rounded-lg border border-border bg-card p-4 min-h-[220px]">
              {/* Appointments */}
              {activeTab === "appointments" && (
                <div className="space-y-3">
                  {appointments.length === 0 ? (
                    <p className="text-center py-6 text-xs text-muted-foreground">No appointment records.</p>
                  ) : (
                    appointments.map((apt: any) => (
                      <div key={apt.id} className="p-3 rounded-lg border border-border/80 text-xs flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-foreground">{apt.reason || "General Consultation"}</p>
                          <p className="text-muted-foreground mt-0.5">
                            {apt.appointmentDate ? new Date(apt.appointmentDate).toLocaleString() : "Date N/A"}
                          </p>
                          {apt.notes && <p className="text-muted-foreground mt-1 italic">"{apt.notes}"</p>}
                        </div>
                        <Badge variant="outline" className="capitalize">{apt.status || "scheduled"}</Badge>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Medical Records */}
              {activeTab === "records" && (
                <div className="space-y-3">
                  {records.length === 0 ? (
                    <p className="text-center py-6 text-xs text-muted-foreground">No clinical records found.</p>
                  ) : (
                    records.map((rec: any) => (
                      <div key={rec.id} className="p-3 rounded-lg border border-border/80 text-xs space-y-1.5">
                        <div className="flex justify-between">
                          <strong className="text-foreground text-sm">{rec.diagnosis}</strong>
                          <span className="text-muted-foreground">{rec.recordDate ? new Date(rec.recordDate).toLocaleDateString() : ""}</span>
                        </div>
                        {rec.symptoms && <p className="text-muted-foreground">Symptoms: <span className="text-foreground">{rec.symptoms}</span></p>}
                        {rec.treatment && <p className="text-muted-foreground">Treatment: <span className="text-foreground">{rec.treatment}</span></p>}
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Prescriptions */}
              {activeTab === "prescriptions" && (
                <div className="space-y-3">
                  {prescriptions.length === 0 ? (
                    <p className="text-center py-6 text-xs text-muted-foreground">No prescriptions found.</p>
                  ) : (
                    prescriptions.map((px: any) => (
                      <div key={px.id} className="p-3 rounded-lg border border-border/80 text-xs flex justify-between items-start">
                        <div>
                          <p className="font-bold text-foreground text-sm">{px.medication}</p>
                          <p className="text-muted-foreground mt-0.5">
                            {px.dosage} • {px.frequency} • {px.duration}
                          </p>
                          {px.notes && <p className="text-muted-foreground mt-1">Instructions: {px.notes}</p>}
                        </div>
                        <Badge variant="secondary">{px.issuedDate ? new Date(px.issuedDate).toLocaleDateString() : "Active"}</Badge>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Admissions */}
              {activeTab === "admissions" && (
                <div className="space-y-3">
                  {admissions.length === 0 ? (
                    <p className="text-center py-6 text-xs text-muted-foreground">No inpatient admissions.</p>
                  ) : (
                    admissions.map((adm: any) => (
                      <div key={adm.id} className="p-3 rounded-lg border border-border/80 text-xs flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-foreground">Reason: {adm.reason}</p>
                          <p className="text-muted-foreground mt-0.5">
                            Admitted: {adm.admissionDate ? new Date(adm.admissionDate).toLocaleDateString() : "—"}
                            {adm.dischargeDate && ` • Discharged: ${new Date(adm.dischargeDate).toLocaleDateString()}`}
                          </p>
                        </div>
                        <Badge variant={adm.status === "admitted" ? "default" : "secondary"} className="capitalize">
                          {adm.status}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Bills */}
              {activeTab === "bills" && (
                <div className="space-y-3">
                  {bills.length === 0 ? (
                    <p className="text-center py-6 text-xs text-muted-foreground">No invoices recorded.</p>
                  ) : (
                    bills.map((b: any) => (
                      <div key={b.id} className="p-3 rounded-lg border border-border/80 text-xs flex justify-between items-center">
                        <div>
                          <p className="font-mono font-bold text-foreground">Invoice #{b.id.substring(0, 8)}</p>
                          <p className="text-muted-foreground mt-0.5">
                            Total: ${parseFloat(String(b.totalAmount || 0)).toFixed(2)} • Paid: ${parseFloat(String(b.paidAmount || 0)).toFixed(2)}
                          </p>
                        </div>
                        <Badge
                          variant={b.status === "paid" ? "default" : "destructive"}
                          className={b.status === "paid" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 capitalize" : "capitalize"}
                        >
                          {b.status}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        <DialogFooter className="border-t border-border pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
