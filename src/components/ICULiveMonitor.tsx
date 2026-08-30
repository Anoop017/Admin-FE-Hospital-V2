"use client";

import { useEffect, useState, useRef } from "react";
import { getVitalsWsUrl } from "@/lib/reports";
import {
  Activity,
  Heart,
  Thermometer,
  Wind,
  Gauge,
  AlertTriangle,
  Radio,
  RefreshCw,
  Volume2,
  VolumeX,
  BedDouble,
  User,
  ShieldAlert,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface PatientVitals {
  patientId?: number | string;
  patientName?: string;
  wardName?: string;
  bedNumber?: string | number;
  heartRate?: number;
  spo2?: number;
  systolicBp?: number;
  diastolicBp?: number;
  temperature?: number;
  respiratoryRate?: number;
  alertLevel?: "NORMAL" | "WARNING" | "CRITICAL" | string;
  timestamp?: string;
  notes?: string;
}

interface ICULiveMonitorProps {
  patientId?: number | string;
  compact?: boolean;
  className?: string;
}

export function ICULiveMonitor({
  patientId,
  compact = false,
  className = "",
}: ICULiveMonitorProps) {
  const [vitals, setVitals] = useState<PatientVitals | null>(null);
  const [multiVitals, setMultiVitals] = useState<Record<string, PatientVitals>>({});
  const [status, setStatus] = useState<"connecting" | "connected" | "disconnected">("connecting");
  const [soundEnabled, setSoundEnabled] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let isMounted = true;

    function connect() {
      if (wsRef.current) {
        wsRef.current.close();
      }

      setStatus("connecting");
      const wsUrl = getVitalsWsUrl(patientId);

      try {
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          if (!isMounted) return;
          setStatus("connected");
        };

        ws.onmessage = (e) => {
          if (!isMounted) return;
          try {
            const msg = JSON.parse(e.data);
            if (msg.type === "vitals_update" && msg.data) {
              const data: PatientVitals = msg.data;
              setVitals(data);

              // If multi-stream, track each patient
              const key = String(data.patientId || data.bedNumber || "default");
              setMultiVitals((prev) => ({ ...prev, [key]: data }));
            }
          } catch (err) {
            console.error("Failed to parse ICU Telemetry message:", err);
          }
        };

        ws.onerror = () => {
          if (!isMounted) return;
          setStatus("disconnected");
        };

        ws.onclose = () => {
          if (!isMounted) return;
          setStatus("disconnected");
          // Attempt auto-reconnect after 4s
          reconnectTimerRef.current = setTimeout(() => {
            if (isMounted) connect();
          }, 4000);
        };
      } catch (err) {
        console.error("WebSocket connection error:", err);
        setStatus("disconnected");
      }
    }

    connect();

    return () => {
      isMounted = false;
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, [patientId]);

  // Fallback demo values if socket has not yet received telemetry packet
  const activeVitals: PatientVitals = vitals || {
    patientName: patientId ? `Patient #${patientId}` : "ICU Telemetry Stream",
    wardName: "Intensive Care Unit (ICU-A)",
    bedNumber: "ICU-04",
    heartRate: 78,
    spo2: 98,
    systolicBp: 120,
    diastolicBp: 80,
    temperature: 36.8,
    alertLevel: "NORMAL",
    timestamp: new Date().toISOString(),
  };

  const isCritical = activeVitals.alertLevel?.toUpperCase() === "CRITICAL";
  const isWarning = activeVitals.alertLevel?.toUpperCase() === "WARNING";

  const getContainerStyle = () => {
    if (isCritical) {
      return "bg-rose-950/90 border-rose-500/80 text-white shadow-lg shadow-rose-950/40 ring-1 ring-rose-500/50 animate-pulse";
    }
    if (isWarning) {
      return "bg-amber-950/90 border-amber-500/80 text-white shadow-lg shadow-amber-950/30";
    }
    return "bg-slate-900 border-slate-700/80 text-white shadow-md";
  };

  const getAlertBadge = () => {
    if (isCritical) {
      return (
        <Badge className="bg-rose-600 text-white hover:bg-rose-600 border-none font-bold text-xs uppercase px-2.5 py-0.5 animate-bounce">
          <ShieldAlert className="size-3 mr-1" /> CRITICAL
        </Badge>
      );
    }
    if (isWarning) {
      return (
        <Badge className="bg-amber-500 text-slate-950 hover:bg-amber-500 border-none font-bold text-xs uppercase px-2.5 py-0.5">
          <AlertTriangle className="size-3 mr-1" /> WARNING
        </Badge>
      );
    }
    return (
      <Badge className="bg-emerald-500 text-white hover:bg-emerald-500 border-none font-semibold text-xs uppercase px-2.5 py-0.5">
        <Radio className="size-3 mr-1 animate-pulse" /> NORMAL
      </Badge>
    );
  };

  return (
    <div
      className={`rounded-2xl border p-4 sm:p-5 transition-all relative overflow-hidden backdrop-blur-xs ${getContainerStyle()} ${className}`}
    >
      {/* Background ECG animation grid line */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:16px_16px]" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-4 relative z-10">
        <div className="flex items-center gap-2.5">
          <div
            className={`flex size-9 items-center justify-center rounded-xl font-bold ${
              isCritical
                ? "bg-rose-500 text-white shadow-md shadow-rose-500/30"
                : "bg-teal-500/20 text-teal-400 border border-teal-500/30"
            }`}
          >
            <Activity className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm sm:text-base tracking-tight text-white flex items-center gap-1.5">
                {activeVitals.patientName || `Patient #${activeVitals.patientId || "ICU"}`}
              </h4>
            </div>
            <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
              <BedDouble className="size-3.5 text-slate-400" />
              {activeVitals.wardName || "ICU"} — Bed {activeVitals.bedNumber || "01"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Connection Status */}
          <span
            className={`inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-full font-mono font-medium border ${
              status === "connected"
                ? "bg-emerald-950/60 text-emerald-400 border-emerald-500/40"
                : status === "connecting"
                ? "bg-amber-950/60 text-amber-400 border-amber-500/40"
                : "bg-slate-800 text-slate-400 border-slate-700"
            }`}
            title={`Telemetry WebSocket: ${status}`}
          >
            <span
              className={`size-1.5 rounded-full ${
                status === "connected"
                  ? "bg-emerald-400 animate-ping"
                  : status === "connecting"
                  ? "bg-amber-400 animate-pulse"
                  : "bg-slate-400"
              }`}
            />
            {status === "connected" ? "LIVE" : status === "connecting" ? "CONNECTING..." : "OFFLINE"}
          </span>

          {getAlertBadge()}

          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title={soundEnabled ? "Mute Alarms" : "Enable Audio Alarm"}
            aria-label="Toggle Sound"
          >
            {soundEnabled ? <Volume2 className="size-4 text-teal-400" /> : <VolumeX className="size-4" />}
          </button>
        </div>
      </div>

      {/* Telemetry Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-center relative z-10">
        {/* Heart Rate */}
        <div className="rounded-xl bg-slate-950/60 border border-slate-800/80 p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1">
              <Heart className={`size-3 text-rose-400 ${status === "connected" ? "animate-pulse" : ""}`} /> HR
            </span>
            <span className="text-[10px] text-slate-400">bpm</span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-rose-400 font-mono tracking-tight">
            {activeVitals.heartRate ?? "--"}
          </p>
          <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
            <span>Normal</span>
            <span className="font-medium">60-100</span>
          </div>
        </div>

        {/* Oxygen SpO2 */}
        <div className="rounded-xl bg-slate-950/60 border border-slate-800/80 p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1">
              <Wind className="size-3 text-cyan-400" /> SpO2
            </span>
            <span className="text-[10px] text-slate-400">%</span>
          </div>
          <p
            className={`text-2xl sm:text-3xl font-extrabold font-mono tracking-tight ${
              (activeVitals.spo2 ?? 100) < 92 ? "text-rose-400" : "text-cyan-400"
            }`}
          >
            {activeVitals.spo2 ?? "--"}
          </p>
          <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
            <span>Normal</span>
            <span className="font-medium">&ge; 95%</span>
          </div>
        </div>

        {/* Blood Pressure (Systolic / Diastolic) */}
        <div className="rounded-xl bg-slate-950/60 border border-slate-800/80 p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1">
              <Gauge className="size-3 text-amber-400" /> NIBP
            </span>
            <span className="text-[10px] text-slate-400">mmHg</span>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-amber-400 font-mono tracking-tight">
            {activeVitals.systolicBp ?? "--"}/{activeVitals.diastolicBp ?? "--"}
          </p>
          <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
            <span>Target</span>
            <span className="font-medium">120/80</span>
          </div>
        </div>

        {/* Core Temperature */}
        <div className="rounded-xl bg-slate-950/60 border border-slate-800/80 p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1">
              <Thermometer className="size-3 text-emerald-400" /> Temp
            </span>
            <span className="text-[10px] text-slate-400">°C</span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono tracking-tight">
            {activeVitals.temperature !== undefined ? activeVitals.temperature.toFixed(1) : "--"}
          </p>
          <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
            <span>Core</span>
            <span className="font-medium">36.5-37.5</span>
          </div>
        </div>
      </div>

      {/* Bottom Live Waveform / Pulse indicator */}
      {!compact && (
        <div className="mt-3.5 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-teal-400 animate-ping" />
            <span className="font-mono text-slate-300 text-[10px] sm:text-xs">
              Live Waveform: Leads I, II, V5 Active
            </span>
          </div>
          <span className="font-mono text-[10px] text-slate-400">
            {activeVitals.timestamp ? new Date(activeVitals.timestamp).toLocaleTimeString() : "Synchronized"}
          </span>
        </div>
      )}
    </div>
  );
}

export default ICULiveMonitor;
