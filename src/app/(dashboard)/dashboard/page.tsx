"use client";

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
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const stats = [
  {
    title: "Visitors",
    value: "4,592",
    change: "+15.9%",
    description: "Stay informed with real-time data to enhance patient care and visitor management.",
    icon: Users,
    iconBg: "bg-gray-100",
    iconColor: "text-gray-700",
  },
  {
    title: "Doctors",
    value: "260",
    change: "+15.9%",
    description: "Stay updated with essential details to streamline medical support and management.",
    icon: Stethoscope,
    iconBg: "bg-[#e2f1ff]",
    iconColor: "text-[#1d4ed8]",
    bgOverride: "bg-[#e2f1ff]",
  },
  {
    title: "Patient",
    value: "540",
    change: "+15.9%",
    description: "Keep track of patient information at a glance, with easy access to key details.",
    icon: UserRound,
    iconBg: "bg-gray-100",
    iconColor: "text-gray-700",
  },
  {
    title: "Total Bed",
    value: "1205",
    subtitle: "Available",
    extra: [
      { label: "Private Bed", value: "110 Bed" },
      { label: "General Bed", value: "215 Bed" },
    ],
    icon: BedDouble,
    iconBg: "bg-gray-100",
    iconColor: "text-gray-700",
  },
];

const chartData = [
  { time: '10am', onTime: 40, onLate: 60 },
  { time: '11am', onTime: 55, onLate: 45 },
  { time: '12am', onTime: 45, onLate: 35 },
  { time: '01am', onTime: 58, onLate: 48 },
  { time: '02am', onTime: 55, onLate: 42 },
  { time: '03am', onTime: 45, onLate: 50 },
  { time: '04am', onTime: 55, onLate: 60 },
  { time: '05am', onTime: 65, onLate: 45 },
  { time: '06am', onTime: 45, onLate: 35 },
  { time: '07am', onTime: 40, onLate: 30 },
];

const recentAppointments = [
  {
    id: 1,
    patient: "Nevaeh Simmons",
    department: "Melati Room",
    age: 23,
    dob: "23 February 2023",
    status: "Active",
    email: "nevaeh@example.com",
    phone: "(316) 555-0116",
    avatar: "https://i.pravatar.cc/150?img=1"
  },
  {
    id: 2,
    patient: "Nevaeh Simmons",
    department: "Melati Room",
    age: 23,
    dob: "23 February 2023",
    status: "Active",
    email: "nevaeh@example.com",
    phone: "(316) 555-0118",
    avatar: "https://i.pravatar.cc/150?img=2"
  },
  {
    id: 3,
    patient: "Nevaeh Simmons",
    department: "Melati Room",
    age: 23,
    dob: "23 February 2023",
    status: "Active",
    email: "nevaeh@example.com",
    phone: "(316) 555-0143",
    avatar: "https://i.pravatar.cc/150?img=3"
  },
];

export default function DashboardPage() {
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
                    <span className="flex items-center gap-0.5 text-xs font-semibold text-gray-600 bg-white px-2 py-0.5 rounded-full shadow-sm">
                      <TrendingUp className="size-3 text-gray-600" />
                      {stat.change}
                    </span>
                  )}
                  {stat.subtitle && (
                    <span className="text-xs font-semibold text-gray-600">
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
                  <Line type="monotone" dataKey="onTime" stroke="#0d9488" strokeWidth={2} dot={{ r: 4, fill: '#fff', stroke: '#0d9488', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="onLate" stroke="#e9d5ff" strokeWidth={2} dot={{ r: 4, fill: '#fff', stroke: '#e9d5ff', strokeWidth: 2 }} activeDot={{ r: 6 }} />
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
               <button className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                  <ChevronLeft className="size-4 text-gray-500" />
               </button>
               <span className="font-semibold text-sm">July 2026</span>
               <button className="p-1 rounded-full border border-gray-200 hover:bg-gray-100 transition-colors">
                  <ChevronRight className="size-4 text-gray-500" />
               </button>
             </div>
             
             {/* Simple static calendar grid for the mockup */}
             <div className="grid grid-cols-7 gap-y-3 text-center mb-4">
                {['S','M','T','W','T','F','S'].map((d, i) => (
                  <div key={i} className="text-[10px] font-bold text-gray-400">{d}</div>
                ))}
                
                {/* Previous month days */}
                <div className="text-[12px] font-medium text-gray-300">26</div>
                <div className="text-[12px] font-medium text-gray-300">27</div>
                <div className="text-[12px] font-medium text-gray-300">28</div>
                <div className="text-[12px] font-medium text-gray-300">29</div>
                <div className="text-[12px] font-medium text-gray-300">30</div>
                <div className="text-[12px] font-medium text-gray-700">1</div>
                <div className="text-[12px] font-medium text-gray-700">2</div>
                
                <div className="text-[12px] font-medium text-gray-700">3</div>
                <div className="text-[12px] font-medium text-teal-700 bg-teal-50 rounded-full w-6 h-6 flex items-center justify-center mx-auto">4</div>
                <div className="text-[12px] font-medium text-gray-700">5</div>
                <div className="text-[12px] font-medium text-gray-700 flex flex-col items-center">6<div className="flex gap-0.5 mt-0.5"><span className="size-1 rounded-full bg-orange-400"/><span className="size-1 rounded-full bg-purple-400"/></div></div>
                <div className="text-[12px] font-medium text-gray-700">7</div>
                <div className="text-[12px] font-medium text-gray-700">8</div>
                <div className="text-[12px] font-medium text-gray-700">9</div>
                
                <div className="text-[12px] font-medium text-gray-700">10</div>
                <div className="text-[12px] font-medium text-gray-700">11</div>
                <div className="text-[12px] font-medium text-gray-700 flex flex-col items-center">12<div className="flex gap-0.5 mt-0.5"><span className="size-1 rounded-full bg-purple-400"/></div></div>
                <div className="text-[12px] font-medium text-gray-700">13</div>
                <div className="text-[12px] font-medium text-gray-700">14</div>
                <div className="text-[12px] font-medium text-gray-700">15</div>
                <div className="text-[12px] font-medium text-gray-700">16</div>
                
                <div className="text-[12px] font-medium text-gray-700">17</div>
                <div className="text-[12px] font-medium text-gray-700">18</div>
                <div className="text-[12px] font-medium text-gray-700">19</div>
                <div className="text-[12px] font-medium text-gray-700">20</div>
                <div className="text-[12px] font-medium text-gray-700">21</div>
                <div className="text-[12px] font-medium text-gray-700">22</div>
                <div className="text-[12px] font-medium text-gray-700">23</div>

                <div className="text-[12px] font-medium text-gray-700">24</div>
                <div className="text-[12px] font-medium text-gray-700 flex flex-col items-center">25<div className="flex gap-0.5 mt-0.5"><span className="size-1 rounded-full bg-orange-400"/></div></div>
                <div className="text-[12px] font-medium text-gray-700">26</div>
                <div className="text-[12px] font-medium text-gray-700">27</div>
                <div className="text-[12px] font-medium text-gray-700">28</div>
                <div className="text-[12px] font-medium text-gray-700">29</div>
                <div className="text-[12px] font-medium text-gray-700 flex flex-col items-center">30<div className="flex gap-0.5 mt-0.5"><span className="size-1 rounded-full bg-red-500"/></div></div>
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
            <p className="text-[11px] text-gray-400 mt-1">Lorem ipsum dolor sit amet consectetur sit amet ipsum dolor sit amet consectetur.</p>
          </div>
          <div className="flex bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            {["Today", "Weekly", "Monthly", "Yearly"].map((period) => (
              <button
                key={period}
                className={`px-4 py-1.5 text-xs font-semibold transition-colors ${
                  period === "Today"
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
                    <input type="checkbox" className="rounded border-gray-300 text-teal-600 focus:ring-teal-600" />
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
                {recentAppointments.map((apt, idx) => (
                  <tr
                    key={apt.id}
                    className="transition-colors hover:bg-gray-50/50"
                  >
                    <td className="py-4 px-2">
                       <input type="checkbox" className="rounded border-gray-300 text-teal-600 focus:ring-teal-600" />
                    </td>
                    <td className="py-4 text-[13px] font-medium text-gray-500">
                      {String(idx + 2).padStart(2, "0")}
                    </td>
                    <td className="py-4 flex items-center gap-3">
                      <img src={apt.avatar} alt="Avatar" className="size-8 rounded-full object-cover" />
                      <div>
                        <p className="text-[13px] font-bold text-gray-800">
                          {apt.patient}
                        </p>
                        <p className="text-[11px] text-gray-400 font-medium">
                          {apt.department}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 text-[13px] font-medium text-gray-600">{apt.age}</td>
                    <td className="py-4 text-[13px] font-medium text-gray-600">
                      {apt.dob}
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
                          <Pencil className="size-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                          <Trash2 className="size-4 text-red-400 cursor-pointer hover:text-red-600" />
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
