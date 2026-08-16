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
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getDashboardSummary, getPatientsOverview, deletePatient, deletePatientBulk, getPatient } from "@/lib/api";
import { EditPatientDialog } from "@/components/patients/edit-patient-dialog";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [overviewData, setOverviewData] = useState<any[]>([]);
  const [filter, setFilter] = useState("Today");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingPatient, setEditingPatient] = useState<any>(null);

  const loadOverview = (f: string) => {
    getPatientsOverview(f).then(setOverviewData).catch(console.error);
  };

  useEffect(() => {
    getDashboardSummary().then(setData).catch(console.error);
    loadOverview(filter);
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
      // Fallback
      setEditingPatient({ id });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this patient?")) return;
    try {
      await deletePatient(id);
      loadOverview(filter);
      setSelectedIds(prev => prev.filter(selId => selId !== id));
    } catch (e) { console.error(e); }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} patients?`)) return;
    try {
      await deletePatientBulk(selectedIds);
      setSelectedIds([]);
      loadOverview(filter);
    } catch (e) { console.error(e); }
  };

  if (!data) return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;

  const stats = [
    {
      title: "Visitors",
      value: data.stats.visitors.total.toLocaleString(),
      change: `${data.stats.visitors.percentageChange > 0 ? '+' : ''}${data.stats.visitors.percentageChange}%`,
      changeColor: data.stats.visitors.percentageChange >= 0 ? "text-teal-600" : "text-red-500",
      description: "Stay informed with real-time data to enhance patient care and visitor management.",
      icon: Users,
      iconBg: "bg-gray-100",
      iconColor: "text-gray-700",
    },
    {
      title: "Doctors",
      value: data.stats.doctors.total.toLocaleString(),
      change: `${data.stats.doctors.percentageChange > 0 ? '+' : ''}${data.stats.doctors.percentageChange}%`,
      changeColor: data.stats.doctors.percentageChange >= 0 ? "text-teal-600" : "text-red-500",
      description: "Stay updated with essential details to streamline medical support and management.",
      icon: Stethoscope,
      iconBg: "bg-[#e2f1ff]",
      iconColor: "text-[#1d4ed8]",
      bgOverride: "bg-[#e2f1ff]",
    },
    {
      title: "Patient",
      value: data.stats.patients.total.toLocaleString(),
      change: `${data.stats.patients.percentageChange > 0 ? '+' : ''}${data.stats.patients.percentageChange}%`,
      changeColor: data.stats.patients.percentageChange >= 0 ? "text-teal-600" : "text-red-500",
      description: "Keep track of patient information at a glance, with easy access to key details.",
      icon: UserRound,
      iconBg: "bg-gray-100",
      iconColor: "text-gray-700",
    },
    {
      title: "Total Bed",
      value: data.stats.beds.total.toLocaleString(),
      subtitle: `${data.stats.beds.available} Available`,
      extra: [
        { label: "Private Bed", value: `${data.stats.beds.breakdown.private} Bed` },
        { label: "General Bed", value: `${data.stats.beds.breakdown.general} Bed` },
      ],
      icon: BedDouble,
      iconBg: "bg-gray-100",
      iconColor: "text-gray-700",
    },
  ];

  const chartData = data.patientOverviewChart?.labels?.map((label: string, index: number) => ({
    time: label,
    onTime: data.patientOverviewChart.datasets.onTime[index],
    onLate: data.patientOverviewChart.datasets.onLate[index],
  })) || [];

  const getEventsForDay = (day: number) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');
    const dateStr = `${currentYear}-${currentMonth}-${String(day).padStart(2, '0')}`;
    return data.calendarEvents?.filter((e: any) => e.date === dateStr).map((e: any) => e.type) || [];
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className={`border-none shadow-sm ${stat.bgOverride || 'bg-white'}`}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                  <div className={`flex size-8 items-center justify-center rounded-full ${stat.iconBg}`}>
                    <Icon className={`size-4 ${stat.iconColor}`} />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    {stat.title}
                  </span>
                </div>
                <MoreHorizontal className="size-4 text-gray-400 cursor-pointer hover:text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold tracking-tight text-gray-900">
                    {stat.value}
                  </span>
                  {stat.change && (
                    <span className={`flex items-center gap-0.5 text-xs font-semibold bg-white px-2 py-0.5 rounded-full shadow-sm ${stat.changeColor}`}>
                      <TrendingUp className={`size-3 ${stat.changeColor}`} />
                      {stat.change}
                    </span>
                  )}
                  {stat.subtitle && (
                    <span className="text-xs font-semibold text-gray-600 ml-1">
                      {stat.subtitle}
                    </span>
                  )}
                </div>
                {stat.description && (
                  <p className="mt-4 text-[10px] text-gray-500 font-medium leading-relaxed max-w-[200px]">
                    {stat.description}
                  </p>
                )}
                {stat.extra && (
                  <div className="mt-4 flex gap-6">
                    {stat.extra.map((e) => (
                      <div key={e.label} className="text-[11px] flex flex-col gap-0.5">
                        <span className="font-bold text-gray-900">
                          {e.value}
                        </span>
                        <span className="text-gray-500 font-medium">
                          {e.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Patient Overview Chart */}
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-bold text-gray-800">
              Patient Overview
            </CardTitle>
            <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-teal-600" /> On Time
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-purple-200" /> On Late
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line name="On Time" type="monotone" dataKey="onTime" stroke="#0d9488" strokeWidth={2} dot={{ r: 4, fill: '#fff', stroke: '#0d9488', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  <Line name="On Late" type="monotone" dataKey="onLate" stroke="#e9d5ff" strokeWidth={2} dot={{ r: 4, fill: '#fff', stroke: '#e9d5ff', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Calendar Widget */}
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-bold text-gray-800">
              Calendar
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
             <div className="flex items-center justify-between mb-4 px-2">
               <button className="p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
                  <ChevronLeft className="size-4 text-gray-500" />
               </button>
               <span className="font-semibold text-sm">{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
               <button className="p-1 rounded-full border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer">
                  <ChevronRight className="size-4 text-gray-500" />
               </button>
             </div>
             
             {/* Simple static calendar grid for the mockup */}
             <div className="grid grid-cols-7 gap-y-3 text-center mb-4">
                {['S','M','T','W','T','F','S'].map((d, i) => (
                  <div key={i} className="text-[10px] font-bold text-gray-400">{d}</div>
                ))}
                
                {/* Previous month days */}
                {[26,27,28,29,30].map((d) => <div key={'prev'+d} className="text-[12px] font-medium text-gray-300">{d}</div>)}
                
                {/* Current month days */}
                {Array.from({ length: 31 }).map((_, i) => {
                  const day = i + 1;
                  const events = getEventsForDay(day);
                  
                  return (
                    <div key={'cur'+day} className={`text-[12px] font-medium ${day === 4 ? 'text-teal-700 bg-teal-50 rounded-full w-6 h-6 flex items-center justify-center mx-auto' : 'text-gray-700'} flex flex-col items-center`}>
                      {day}
                      {events.length > 0 && (
                        <div className="flex gap-0.5 mt-0.5">
                          {events.map((type: string, idx: number) => {
                             let dotColor = "bg-gray-400";
                             if (type === "appointment") dotColor = "bg-orange-400";
                             if (type === "meeting") dotColor = "bg-red-500";
                             if (type === "surgery") dotColor = "bg-purple-400";
                             return <span key={idx} className={`size-1 rounded-full ${dotColor}`} />
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
             </div>
             
             <div className="flex justify-between px-2 text-[9px] font-semibold text-gray-500 mt-2">
                <div className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-orange-400"/> Appointment</div>
                <div className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-red-500"/> Meeting</div>
                <div className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-purple-400"/> Surgery</div>
             </div>
          </CardContent>
        </Card>
      </div>

      {/* Patient Overview table */}
      <Card className="border-none shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-6">
          <div>
            <CardTitle className="text-base font-bold text-gray-800">
              Patient Overview
            </CardTitle>
            <p className="text-[11px] text-gray-400 mt-1">Recent appointments to quickly review patient activity.</p>
          </div>
            <div className="flex bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              {selectedIds.length > 0 ? (
                <button
                  onClick={handleBulkDelete}
                  className="cursor-pointer px-4 py-1.5 text-xs font-semibold transition-colors bg-red-50 text-red-600 hover:bg-red-100"
                >
                  Delete Selected ({selectedIds.length})
                </button>
              ) : ["Today", "Weekly", "Monthly", "Yearly"].map((period) => (
                <button
                  key={period}
                  onClick={() => handleFilterChange(period)}
                  className={`cursor-pointer px-4 py-1.5 text-xs font-semibold transition-colors ${
                    period === filter
                      ? "bg-[#efe6fa] text-[#6b21a8]"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-3 px-2 text-left">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-teal-600 focus:ring-teal-600 cursor-pointer"
                      checked={overviewData.length > 0 && selectedIds.length === overviewData.length}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedIds(overviewData.map(o => o.id));
                        else setSelectedIds([]);
                      }}
                    />
                  </th>
                  <th className="pb-3 text-left text-xs font-semibold text-gray-500">
                    No
                  </th>
                  <th className="pb-3 text-left text-xs font-semibold text-gray-500">
                    Name
                  </th>
                  <th className="pb-3 text-left text-xs font-semibold text-gray-500">
                    Age
                  </th>
                  <th className="pb-3 text-left text-xs font-semibold text-gray-500">
                    Date of Birth
                  </th>
                  <th className="pb-3 text-left text-xs font-semibold text-gray-500">
                    Status
                  </th>
                  <th className="pb-3 text-left text-xs font-semibold text-gray-500">
                    Email address
                  </th>
                  <th className="pb-3 text-left text-xs font-semibold text-gray-500">
                    Phone
                  </th>
                  <th className="pb-3 text-center text-xs font-semibold text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {overviewData.map((apt, idx) => (
                  <tr
                    key={apt.id}
                    className="transition-colors hover:bg-gray-50/50"
                  >
                    <td className="py-4 px-2">
                       <input 
                         type="checkbox" 
                         className="rounded border-gray-300 text-teal-600 focus:ring-teal-600 cursor-pointer"
                         checked={selectedIds.includes(apt.id)}
                         onChange={(e) => {
                           if (e.target.checked) setSelectedIds(prev => [...prev, apt.id]);
                           else setSelectedIds(prev => prev.filter(id => id !== apt.id));
                         }}
                       />
                    </td>
                    <td className="py-4 text-[13px] font-medium text-gray-500">
                      {String(apt.no || idx + 1).padStart(2, "0")}
                    </td>
                    <td className="py-4 flex items-center gap-3">
                      <div>
                        <p className="text-[13px] font-bold text-gray-800">
                          {apt.name}
                        </p>
                        <p className="text-[11px] text-gray-400 font-medium">
                          {apt.room}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 text-[13px] font-medium text-gray-600">{apt.age}</td>
                    <td className="py-4 text-[13px] font-medium text-gray-600">
                      {apt.dateOfBirth}
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#f0fdf4] w-fit border border-[#bbf7d0]">
                         <span className="size-1.5 rounded-full bg-[#16a34a]" />
                         <span className="text-[11px] font-semibold text-[#16a34a]">{apt.status}</span>
                      </div>
                    </td>
                    <td className="py-4 text-[13px] font-medium text-gray-500">
                      {apt.email}
                    </td>
                    <td className="py-4 text-[13px] font-medium text-gray-500">
                      {apt.phone}
                    </td>
                    <td className="py-4 text-center">
                       <div className="flex items-center justify-center gap-3">
                          <Pencil 
                            onClick={() => handleEditClick(apt.id)}
                            className="size-4 text-gray-400 cursor-pointer hover:text-gray-600" 
                          />
                          <Trash2 
                            onClick={() => handleDelete(apt.id)}
                            className="size-4 text-red-400 cursor-pointer hover:text-red-600" 
                          />
                       </div>
                    </td>
                  </tr>
                ))}
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
