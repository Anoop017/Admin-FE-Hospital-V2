"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Stethoscope,
  UserRound,
  BedDouble,
  TrendingUp,
  MoreHorizontal,
  Pencil,
  Trash2,
  CalendarCheck,
  Calendar,
  DollarSign,
  Activity,
  CheckCircle2,
  Clock,
  RefreshCw,
  Radio,
} from "lucide-react";
import { ICULiveMonitor } from "@/components/ICULiveMonitor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from "recharts";
import {
  getDashboardSummary,
  getDashboardAnalytics,
  getPatientsOverview,
  deletePatient,
  deletePatientBulk,
  getPatient,
} from "@/lib/api";
import { EditPatientDialog } from "@/components/patients/edit-patient-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [analyticsPeriod, setAnalyticsPeriod] = useState<"week" | "month" | "day">("week");
  const [overviewData, setOverviewData] = useState<any[]>([]);
  const [filter, setFilter] = useState("Today");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingPatient, setEditingPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadOverview = (f: string) => {
    getPatientsOverview(f)
      .then((res) => setOverviewData(Array.isArray(res) ? res : []))
      .catch(console.error);
  };

  const loadAnalytics = (period: "week" | "month" | "day") => {
    setAnalyticsPeriod(period);
    getDashboardAnalytics(period)
      .then(setAnalyticsData)
      .catch(console.error);
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const summary = await getDashboardSummary();
      setData(summary);
      await loadAnalytics("week");
      loadOverview(filter);
    } catch (e) {
      console.error("Failed to load dashboard summary", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleFilterChange = (f: string) => {
    setFilter(f);
    loadOverview(f);
  };

  const handleEditClick = async (id: string) => {
    try {
      const fullPatient = await getPatient(id);
      setEditingPatient(fullPatient);
    } catch (e) {
      console.error(e);
      setEditingPatient({ id });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this patient?")) return;
    try {
      await deletePatient(id);
      loadOverview(filter);
      setSelectedIds((prev) => prev.filter((selId) => selId !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} patients?`)) return;
    try {
      await deletePatientBulk(selectedIds);
      setSelectedIds([]);
      loadOverview(filter);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading && !data) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <RefreshCw className="size-6 animate-spin text-primary" />
          <p className="text-sm">Loading hospital analytics dashboard...</p>
        </div>
      </div>
    );
  }

  // Safe fallback stats extracted from new backend payload
  const patientStats = data?.stats?.patients || { total: 0, percentageChange: 0 };
  const doctorStats = data?.stats?.doctors || { total: 0, percentageChange: 0 };
  const staffStats = data?.stats?.staff || { total: 0 };
  const appointmentsToday = data?.stats?.appointmentsToday ?? 0;
  const bedStats = data?.stats?.beds || {
    total: 0,
    available: 0,
    occupied: 0,
    occupancyRate: 0,
    breakdown: { private: 0, general: 0, icu: 0 },
  };
  const financials = data?.stats?.financials || {
    totalRevenue: 0,
    totalBilled: 0,
    pendingReceivables: 0,
  };

  const upcomingAppointments = Array.isArray(data?.upcomingAppointments)
    ? data.upcomingAppointments
    : [];

  // Prepare chart series from analytics or appointmentTrendChart
  const chartSeries = analyticsData?.labels?.map((label: string, idx: number) => {
    const aptDataset = analyticsData?.datasets?.find((d: any) => d.label === "Appointments");
    const admDataset = analyticsData?.datasets?.find((d: any) => d.label === "Admissions");
    return {
      time: label,
      appointments: aptDataset?.data?.[idx] ?? data?.appointmentTrendChart?.data?.[idx] ?? 0,
      admissions: admDataset?.data?.[idx] ?? 0,
    };
  }) || data?.appointmentTrendChart?.labels?.map((label: string, idx: number) => ({
    time: label,
    appointments: data.appointmentTrendChart.data[idx],
    admissions: 0,
  })) || [];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Hospital Overview</h1>
          <p className="text-sm text-muted-foreground">
            Real-time analytics, bed occupancy, clinical volume, and financial performance.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchAllData} className="gap-1.5 self-start">
          <RefreshCw className="size-3.5" /> Refresh Data
        </Button>
      </div>

      {/* Top KPI Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Patients */}
        <Card className="border border-border bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-sm font-semibold text-muted-foreground">Total Patients</span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <UserRound className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight text-foreground">
                {patientStats.total?.toLocaleString() ?? "0"}
              </span>
              {patientStats.percentageChange !== undefined && (
                <span
                  className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
                    patientStats.percentageChange >= 0
                      ? "bg-teal-500/10 text-teal-600 dark:text-teal-400"
                      : "bg-red-500/10 text-red-500"
                  }`}
                >
                  <TrendingUp className="size-3" />
                  {patientStats.percentageChange > 0 ? "+" : ""}
                  {patientStats.percentageChange}%
                </span>
              )}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Active registered patients across all departments.
            </p>
          </CardContent>
        </Card>

        {/* Doctors & Specialists */}
        <Card className="border border-border bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-sm font-semibold text-muted-foreground">Active Doctors</span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Stethoscope className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight text-foreground">
                {doctorStats.total?.toLocaleString() ?? "0"}
              </span>
              {doctorStats.percentageChange !== undefined && (
                <span className="flex items-center gap-0.5 text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">
                  <TrendingUp className="size-3" />
                  {doctorStats.percentageChange > 0 ? "+" : ""}
                  {doctorStats.percentageChange}%
                </span>
              )}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Medical specialists on active hospital duty roster.
            </p>
          </CardContent>
        </Card>

        {/* Staff & Appointments Today */}
        <Card className="border border-border bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-sm font-semibold text-muted-foreground">Today's Appointments</span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <CalendarCheck className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight text-foreground">
                {appointmentsToday}
              </span>
              <span className="text-xs text-muted-foreground font-medium">scheduled today</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Supported by {staffStats.total ?? 0} active administrative & clinical staff.
            </p>
          </CardContent>
        </Card>

        {/* Bed Occupancy Matrix KPI */}
        <Card className="border border-border bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-sm font-semibold text-muted-foreground">Bed Occupancy</span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <BedDouble className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight text-foreground">
                {bedStats.available ?? 0}
              </span>
              <span className="text-xs text-muted-foreground">/ {bedStats.total ?? 0} Available</span>
              <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                {bedStats.occupancyRate ?? 0}% occ.
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/60 pt-2">
              <span>ICU: <strong>{bedStats.breakdown?.icu ?? 0}</strong></span>
              <span>Private: <strong>{bedStats.breakdown?.private ?? 0}</strong></span>
              <span>General: <strong>{bedStats.breakdown?.general ?? 0}</strong></span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Health Summary Banner */}
      <Card className="border border-border bg-card shadow-xs">
        <CardContent className="p-4 sm:p-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-border">
            <div className="flex items-center gap-3.5">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <DollarSign className="size-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Total Revenue Collected</p>
                <p className="text-xl font-bold text-foreground mt-0.5">
                  ${parseFloat(String(financials.totalRevenue || 0)).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 sm:pl-4 pt-3 sm:pt-0">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Activity className="size-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Total Invoiced Volume</p>
                <p className="text-xl font-bold text-foreground mt-0.5">
                  ${parseFloat(String(financials.totalBilled || 0)).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 sm:pl-4 pt-3 sm:pt-0">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Clock className="size-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Pending Receivables</p>
                <p className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                  ${parseFloat(String(financials.pendingReceivables || 0)).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live ICU Telemetry Section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="size-4 text-rose-500 animate-pulse" />
            <h2 className="text-base font-bold text-foreground">Live ICU Telemetry & Critical Care</h2>
          </div>
          <span className="text-xs text-muted-foreground font-mono">Telemetry Port: 4000 (ws/vitals)</span>
        </div>
        <ICULiveMonitor />
      </div>

      {/* Analytics & Upcoming Appointments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Time-Series Analytics Chart */}
        <Card className="lg:col-span-2 border border-border bg-card shadow-xs">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
            <div>
              <CardTitle className="text-base font-bold text-foreground">Clinical Activity Trend</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Appointments & Admissions comparison</p>
            </div>
            {/* Period Selector Tabs */}
            <div className="flex self-start sm:self-auto bg-muted/60 p-1 rounded-lg border border-border">
              {(["day", "week", "month"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => loadAnalytics(p)}
                  className={`px-3 py-1 text-xs font-medium rounded-md capitalize transition-all ${
                    analyticsPeriod === p
                      ? "bg-background text-foreground shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[240px] sm:h-[280px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartSeries} margin={{ top: 10, right: 10, bottom: 5, left: -25 }}>
                  <defs>
                    <linearGradient id="colorApt" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorAdm" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-neutral-800" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9ca3af" }} dy={8} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9ca3af" }} />
                  <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", backgroundColor: "#fff", color: "#111" }} />
                  <Legend verticalAlign="top" height={36} />
                  <Area name="Appointments" type="monotone" dataKey="appointments" stroke="#0d9488" strokeWidth={2} fillOpacity={1} fill="url(#colorApt)" />
                  <Area name="Admissions" type="monotone" dataKey="admissions" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorAdm)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Appointments List */}
        <Card className="border border-border bg-card shadow-xs flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-bold text-foreground">Upcoming Appointments</CardTitle>
            <Badge variant="secondary" className="text-xs">{upcomingAppointments.length}</Badge>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto max-h-[320px] divide-y divide-border/60">
            {upcomingAppointments.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                <Calendar className="size-8 text-muted-foreground/50 mb-2" />
                <p className="text-xs">No pending appointments today</p>
              </div>
            ) : (
              upcomingAppointments.map((apt: any) => {
                const patientName = apt.patient?.user
                  ? `${apt.patient.user.firstName} ${apt.patient.user.lastName}`
                  : `Patient #${apt.patientId}`;
                const docName = apt.doctor?.user
                  ? `Dr. ${apt.doctor.user.firstName} ${apt.doctor.user.lastName}`
                  : `Doctor #${apt.doctorId}`;
                const timeStr = apt.appointmentDate
                  ? new Date(apt.appointmentDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                  : "";

                return (
                  <div key={apt.id} className="py-2.5 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">{patientName}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{docName} • {apt.reason || "General Consultation"}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono font-medium text-foreground">{timeStr}</span>
                      <div>
                        <Badge variant="outline" className="text-[10px] capitalize px-1.5 py-0">
                          {apt.status || "scheduled"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>

      {/* Patient Activity Overview Table */}
      <Card className="border border-border bg-card shadow-xs">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-4">
          <div>
            <CardTitle className="text-base font-bold text-foreground">Patient Activity Log</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">Recent clinical visits, triage, and patient activity.</p>
          </div>
          <div className="flex overflow-x-auto no-scrollbar max-w-full bg-muted/60 p-1 rounded-lg border border-border">
            {selectedIds.length > 0 ? (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
                className="text-xs h-7 whitespace-nowrap"
              >
                Delete Selected ({selectedIds.length})
              </Button>
            ) : (
              ["Today", "Weekly", "Monthly", "Yearly"].map((period) => (
                <button
                  key={period}
                  onClick={() => handleFilterChange(period)}
                  className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-all ${
                    period === filter
                      ? "bg-background text-foreground shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {period}
                </button>
              ))
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto touch-pan-x">
            <table className="w-full text-left text-sm min-w-[720px]">
              <thead className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 w-10 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="rounded border-border text-primary focus:ring-primary cursor-pointer"
                      checked={overviewData.length > 0 && selectedIds.length === overviewData.length}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedIds(overviewData.map((o) => o.id));
                        else setSelectedIds([]);
                      }}
                    />
                  </th>
                  <th className="py-3 px-4 whitespace-nowrap">No</th>
                  <th className="py-3 px-4 whitespace-nowrap">Patient</th>
                  <th className="py-3 px-4 whitespace-nowrap">Age</th>
                  <th className="py-3 px-4 whitespace-nowrap">Date of Birth</th>
                  <th className="py-3 px-4 whitespace-nowrap">Status</th>
                  <th className="py-3 px-4 whitespace-nowrap">Email</th>
                  <th className="py-3 px-4 whitespace-nowrap">Phone</th>
                  <th className="py-3 px-4 text-center whitespace-nowrap min-w-[80px]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {overviewData.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-xs text-muted-foreground">
                      No patient records found for this period.
                    </td>
                  </tr>
                ) : (
                  overviewData.map((apt, idx) => (
                    <tr key={apt.id || idx} className="transition-colors hover:bg-muted/30">
                      <td className="py-3.5 px-4">
                        <input
                          type="checkbox"
                          className="rounded border-border text-primary focus:ring-primary cursor-pointer"
                          checked={selectedIds.includes(apt.id)}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedIds((prev) => [...prev, apt.id]);
                            else setSelectedIds((prev) => prev.filter((id) => id !== apt.id));
                          }}
                        />
                      </td>
                      <td className="py-3.5 px-4 text-xs font-medium text-muted-foreground">
                        {String(apt.no || idx + 1).padStart(2, "0")}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="text-sm font-semibold text-foreground">{apt.name}</p>
                        {apt.room && <p className="text-xs text-muted-foreground">{apt.room}</p>}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-foreground">{apt.age || "—"}</td>
                      <td className="py-3.5 px-4 text-xs text-muted-foreground">{apt.dateOfBirth || "—"}</td>
                      <td className="py-3.5 px-4">
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-xs">
                          {apt.status || "Active"}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-muted-foreground">{apt.email || "—"}</td>
                      <td className="py-3.5 px-4 text-xs text-muted-foreground">{apt.phone || "—"}</td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEditClick(apt.id)}
                            className="text-muted-foreground hover:text-foreground p-1 transition-colors"
                            title="Edit Patient"
                          >
                            <Pencil className="size-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(apt.id)}
                            className="text-muted-foreground hover:text-destructive p-1 transition-colors"
                            title="Delete Patient"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {editingPatient && (
        <EditPatientDialog
          open={!!editingPatient}
          onOpenChange={(open: boolean) => !open && setEditingPatient(null)}
          item={editingPatient}
          onSuccess={() => {
            setEditingPatient(null);
            loadOverview(filter);
          }}
        />
      )}
    </div>
  );
}
