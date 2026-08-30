"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ICULiveMonitor } from "@/components/ICULiveMonitor";
import { getBeds, getWards, getAdmissions } from "@/lib/api";
import { downloadDischargeSummaryPdf } from "@/lib/reports";
import type { Bed, Ward, Admission } from "@/types";
import {
  BedDouble,
  Activity,
  Radio,
  RefreshCw,
  FileDown,
  User,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Layers,
  Filter,
} from "lucide-react";

export default function BedManagerPage() {
  const [beds, setBeds] = useState<Bed[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [selectedWard, setSelectedWard] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bedsRes, wardsRes, admissionsRes] = await Promise.all([
        getBeds().catch(() => []),
        getWards().catch(() => []),
        getAdmissions().catch(() => []),
      ]);
      setBeds(bedsRes || []);
      setWards(wardsRes || []);
      setAdmissions(admissionsRes || []);
    } catch (err) {
      console.error("Failed to load bed manager data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredBeds = beds.filter((b) => {
    if (selectedWard === "all") return true;
    return String(b.wardId) === selectedWard || b.ward?.name?.toLowerCase().includes(selectedWard.toLowerCase());
  });

  const totalBeds = beds.length;
  const availableBeds = beds.filter((b) => b.status?.toLowerCase() === "available").length;
  const occupiedBeds = beds.filter((b) => b.status?.toLowerCase() === "occupied").length;
  const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <BedDouble className="size-7 text-primary" /> Bed & ICU Telemetry Manager
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Real-time ward occupancy monitoring and live ICU telemetry feeds.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchData} disabled={loading} className="gap-1.5 self-start">
          <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card className="border border-border bg-card shadow-xs">
          <CardContent className="p-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Beds</span>
            <p className="text-2xl font-bold text-foreground mt-1">{totalBeds}</p>
          </CardContent>
        </Card>
        <Card className="border border-border bg-card shadow-xs">
          <CardContent className="p-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Occupied</span>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{occupiedBeds}</p>
          </CardContent>
        </Card>
        <Card className="border border-border bg-card shadow-xs">
          <CardContent className="p-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Available</span>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{availableBeds}</p>
          </CardContent>
        </Card>
        <Card className="border border-border bg-card shadow-xs">
          <CardContent className="p-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Occupancy</span>
            <p className="text-2xl font-bold text-primary mt-1">{occupancyRate}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Live ICU Telemetry Feeds */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="size-5 text-rose-500 animate-pulse" />
            <h2 className="text-lg font-bold text-foreground">Live ICU Telemetry Feeds</h2>
          </div>
          <Badge variant="outline" className="text-xs font-mono bg-rose-500/10 text-rose-600 border-rose-500/30">
            WS: 4000/api/v1/ws/vitals
          </Badge>
        </div>

        <ICULiveMonitor />
      </div>

      {/* Ward Bed Grid Section */}
      <Card className="border border-border bg-card shadow-xs">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-4">
          <div>
            <CardTitle className="text-base font-bold text-foreground">Ward & Bed Occupancy Grid</CardTitle>
            <CardDescription className="text-xs">
              Live status of hospital beds across departments and critical care units.
            </CardDescription>
          </div>

          {/* Ward Filter Pills */}
          <div className="flex overflow-x-auto no-scrollbar max-w-full bg-muted/60 p-1 rounded-lg border border-border gap-1">
            <button
              onClick={() => setSelectedWard("all")}
              className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-all ${
                selectedWard === "all"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All Wards ({beds.length})
            </button>
            {wards.map((w) => (
              <button
                key={w.id}
                onClick={() => setSelectedWard(String(w.id))}
                className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-all ${
                  selectedWard === String(w.id)
                    ? "bg-background text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {w.name}
              </button>
            ))}
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          {loading ? (
            <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
              <RefreshCw className="size-4 animate-spin mr-2" /> Loading bed layout...
            </div>
          ) : filteredBeds.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              No beds found matching this ward filter.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
              {filteredBeds.map((bed) => {
                const isOccupied = bed.status?.toLowerCase() === "occupied";
                const matchingAdm = admissions.find((a) => a.bedId === bed.id && a.status === "admitted");

                return (
                  <div
                    key={bed.id}
                    className={`rounded-xl border p-4 transition-all flex flex-col justify-between ${
                      isOccupied
                        ? "border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20"
                        : "border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/20"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <BedDouble className={`size-4 ${isOccupied ? "text-amber-500" : "text-emerald-500"}`} />
                          <span className="font-bold text-sm text-foreground">Bed {bed.bedNumber}</span>
                        </div>
                        <Badge
                          variant={isOccupied ? "default" : "secondary"}
                          className={`text-[10px] capitalize ${
                            isOccupied
                              ? "bg-amber-500 text-slate-950 hover:bg-amber-500"
                              : "bg-emerald-500 text-white hover:bg-emerald-500"
                          }`}
                        >
                          {bed.status || "available"}
                        </Badge>
                      </div>

                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Layers className="size-3" />
                        {bed.ward?.name || `Ward #${bed.wardId || "General"}`}
                      </p>

                      {matchingAdm && (
                        <div className="mt-3 pt-2.5 border-t border-border/60 text-xs space-y-1">
                          <div className="flex items-center gap-1 font-medium text-foreground">
                            <User className="size-3 text-primary" />
                            <span className="truncate">
                              {matchingAdm.patient?.user
                                ? `${matchingAdm.patient.user.firstName} ${matchingAdm.patient.user.lastName}`
                                : `Patient #${matchingAdm.patientId}`}
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground truncate">
                            Admitted: {matchingAdm.admissionDate ? new Date(matchingAdm.admissionDate).toLocaleDateString() : "—"}
                          </p>
                        </div>
                      )}
                    </div>

                    {matchingAdm && (
                      <div className="mt-3 pt-2 border-t border-border/40 flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs gap-1 text-primary hover:bg-primary/10"
                          onClick={() => downloadDischargeSummaryPdf(matchingAdm.id)}
                          title="Download Discharge Summary PDF"
                        >
                          <FileDown className="size-3.5" /> Discharge Summary PDF
                        </Button>
                      </div>
                    )}
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
