"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Stethoscope,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Filter,
} from "lucide-react";
import { getAppointments, getDoctors } from "@/lib/api";
import { formatId, formatDate, formatTime, getInitials, getAvatarColor } from "@/lib/formatters";
import type { Appointment, Doctor } from "@/types";

export default function SchedulePage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [apptsRes, docsRes] = await Promise.all([
        getAppointments().catch(() => []),
        getDoctors().catch(() => []),
      ]);
      setAppointments(apptsRes || []);
      setDoctors(docsRes || []);
    } catch (err) {
      console.error("Failed to load doctor schedule:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredAppointments = appointments.filter((apt) => {
    if (selectedDoctorId !== "all" && String(apt.doctorId) !== selectedDoctorId) return false;
    if (selectedStatus !== "all" && apt.status?.toLowerCase() !== selectedStatus.toLowerCase()) return false;
    return true;
  });

  const getStatusBadge = (status: string | undefined) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 gap-1 capitalize">
            <CheckCircle2 className="size-3" /> Completed
          </Badge>
        );
      case "scheduled":
        return (
          <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/30 gap-1 capitalize">
            <Clock className="size-3" /> Scheduled
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="destructive" className="gap-1 capitalize">
            <XCircle className="size-3" /> Cancelled
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="capitalize">
            {status || "Scheduled"}
          </Badge>
        );
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <CalendarIcon className="size-7 text-primary" /> Doctor Appointment Schedule & Roster
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Physician consultation calendar, patient bookings, and shift timetables.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={loadData} disabled={loading} className="gap-1.5 self-start">
          <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh Roster
        </Button>
      </div>

      {/* Doctor Duty Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card className="border border-border bg-card shadow-xs">
          <CardContent className="p-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Doctors</span>
            <p className="text-2xl font-bold text-foreground mt-1">{doctors.length}</p>
          </CardContent>
        </Card>
        <Card className="border border-border bg-card shadow-xs">
          <CardContent className="p-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Bookings</span>
            <p className="text-2xl font-bold text-foreground mt-1">{appointments.length}</p>
          </CardContent>
        </Card>
        <Card className="border border-border bg-card shadow-xs">
          <CardContent className="p-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Scheduled</span>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
              {appointments.filter((a) => a.status === "scheduled").length}
            </p>
          </CardContent>
        </Card>
        <Card className="border border-border bg-card shadow-xs">
          <CardContent className="p-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Completed</span>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              {appointments.filter((a) => a.status === "completed").length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider shrink-0">Filter Physician:</span>
          <select
            className="h-9 w-full sm:w-auto rounded-md border border-input bg-background px-3 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
            value={selectedDoctorId}
            onChange={(e) => setSelectedDoctorId(e.target.value)}
          >
            <option value="all">All Doctors ({doctors.length})</option>
            {doctors.map((d) => (
              <option key={d.id} value={String(d.id)}>
                Dr. {d.user?.firstName || "Doctor"} {d.user?.lastName || ""} ({d.specialization || "General"})
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider shrink-0">Status:</span>
          <select
            className="h-9 w-full sm:w-auto rounded-md border border-input bg-background px-3 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no_show">No Show</option>
          </select>
        </div>
      </div>

      {/* Schedule Timeline List */}
      <Card className="border border-border bg-card shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">Consultation Timeline & Bookings</CardTitle>
          <CardDescription className="text-xs">
            Chronological view of patient consultation sessions across specialties.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {filteredAppointments.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground text-xs">
              No appointments matching the selected physician or status filter.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredAppointments.map((apt) => {
                const patientFirst = apt.patient?.user?.firstName || "";
                const patientLast = apt.patient?.user?.lastName || "";
                const patientName = patientFirst ? `${patientFirst} ${patientLast}` : `Patient #${apt.patientId || apt.id}`;

                const docFirst = apt.doctor?.user?.firstName || "";
                const docLast = apt.doctor?.user?.lastName || "";
                const docName = docFirst ? `Dr. ${docFirst} ${docLast}` : `Doctor #${apt.doctorId || "—"}`;

                return (
                  <div key={apt.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-primary/10 text-primary shrink-0 w-16 text-center">
                        <span className="text-[10px] font-bold uppercase">{formatDate(apt.appointmentDate).split(",")[0]}</span>
                        <span className="text-xs font-semibold">{formatTime(apt.appointmentDate)}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground text-sm">{patientName}</span>
                          <Badge variant="outline" className="font-mono text-[10px]">
                            {formatId("patient", apt.patientId || apt.patient?.id)}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Assigned to: <span className="font-medium text-foreground">{docName}</span> {apt.doctor?.specialization ? `(${apt.doctor.specialization})` : ""}
                        </p>
                        {apt.reason && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Reason: <span className="italic text-foreground">{apt.reason}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 self-end sm:self-center">
                      <Badge variant="outline" className="font-mono text-xs">
                        {formatId("appointment", apt.id)}
                      </Badge>
                      {getStatusBadge(apt.status)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
