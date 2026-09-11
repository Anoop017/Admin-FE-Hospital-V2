"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  FileDown,
  FileText,
  CreditCard,
  FlaskConical,
  Activity,
  Zap,
  Download,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import {
  getAdmissions,
  findAllBillsBilling,
  getLaboratory,
  exportAuditLogs,
} from "@/lib/api";
import {
  downloadDischargeSummaryPdf,
  downloadInvoicePdf,
  downloadLabReportPdf,
} from "@/lib/reports";
import { formatId, formatDate, formatCurrency } from "@/lib/formatters";
import type { Admission, Bill, Laborator } from "@/types";

export default function ReportPage() {
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [labs, setLabs] = useState<Laborator[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedAdmissionId, setSelectedAdmissionId] = useState("");
  const [selectedBillId, setSelectedBillId] = useState("");
  const [selectedLabId, setSelectedLabId] = useState("");
  const [isExportingAudit, setIsExportingAudit] = useState(false);

  useEffect(() => {
    async function loadSampleData() {
      try {
        const [admsRes, billsRes, labsRes] = await Promise.all([
          getAdmissions().catch(() => []),
          findAllBillsBilling().catch(() => []),
          getLaboratory().catch(() => []),
        ]);
        const billsList = Array.isArray(billsRes) ? billsRes : (billsRes as any)?.data || [];
        setAdmissions(admsRes || []);
        setBills(billsList);
        setLabs(labsRes || []);

        if (admsRes?.length) setSelectedAdmissionId(String(admsRes[0].id));
        if (billsList.length) setSelectedBillId(String(billsList[0].id));
        if (labsRes?.length) setSelectedLabId(String(labsRes[0].id));
      } catch (err) {
        console.error("Failed to load report options:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSampleData();
  }, []);

  const handleExportAudit = async (format: "csv" | "json") => {
    setIsExportingAudit(true);
    try {
      await exportAuditLogs({ format, isAdmin: true });
    } catch (e) {
      console.error("Audit export error:", e);
    } finally {
      setIsExportingAudit(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <FileDown className="size-7 text-primary" /> Reports & Clinical Document Center
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            High-speed medical PDF document rendering and compliance data exports.
          </p>
        </div>
        <Badge
          variant="outline"
          className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 gap-1.5 py-1 px-3 self-start font-mono text-xs"
        >
          <Zap className="size-3.5 fill-emerald-500 text-emerald-500" /> Go Engine: &lt;15ms Latency
        </Badge>
      </div>

      {/* Tech Architecture Banner for Recruiters */}
      <div className="rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 via-blue-500/5 to-card p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              Go
            </div>
            <div>
              <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                Distributed Microservice PDF Architecture
                <Badge variant="secondary" className="text-[10px] uppercase font-mono">maroto/v2</Badge>
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Hospital discharge summaries, tax invoices, and diagnostic lab reports are generated on-demand by our dedicated Go microservice.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Core PDF Document Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* 1. Discharge Summary */}
        <Card className="border border-border bg-card shadow-xs flex flex-col justify-between">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <FileText className="size-5" />
              </div>
              <Badge variant="outline" className="text-[10px] font-mono">CLINICAL</Badge>
            </div>
            <CardTitle className="text-base font-bold mt-2">Discharge Summary PDF</CardTitle>
            <CardDescription className="text-xs">
              Full clinical summary: patient demographics, admission dates, attending doctor, diagnosis, and medications.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Select Admission</label>
              <Select value={selectedAdmissionId} onValueChange={(val) => setSelectedAdmissionId(val || "")}>
                <SelectTrigger className="w-full text-xs">
                  <SelectValue placeholder="Choose admission record" />
                </SelectTrigger>
                <SelectContent>
                  {admissions.map((adm) => (
                    <SelectItem key={adm.id} value={String(adm.id)}>
                      {formatId("admission", adm.id)} • {adm.patient?.user?.firstName || "Patient"} ({adm.reason || "Admitted"})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              className="w-full gap-2 mt-1"
              disabled={!selectedAdmissionId}
              onClick={() => downloadDischargeSummaryPdf(selectedAdmissionId)}
            >
              <FileDown className="size-4" /> Download Discharge PDF
            </Button>
          </CardContent>
        </Card>

        {/* 2. Billing Tax Invoice */}
        <Card className="border border-border bg-card shadow-xs flex flex-col justify-between">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CreditCard className="size-5" />
              </div>
              <Badge variant="outline" className="text-[10px] font-mono">FINANCIAL</Badge>
            </div>
            <CardTitle className="text-base font-bold mt-2">Itemized Tax Invoice PDF</CardTitle>
            <CardDescription className="text-xs">
              Itemized charges for consultation, room & nursing, pharmacy, payment history ledger, and balance due.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Select Invoice</label>
              <Select value={selectedBillId} onValueChange={(val) => setSelectedBillId(val || "")}>
                <SelectTrigger className="w-full text-xs">
                  <SelectValue placeholder="Choose billing invoice" />
                </SelectTrigger>
                <SelectContent>
                  {bills.map((b) => (
                    <SelectItem key={b.id} value={String(b.id)}>
                      {formatId("bill", b.id)} • {formatCurrency(b.totalAmount)} ({b.status})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              className="w-full gap-2 mt-1"
              disabled={!selectedBillId}
              onClick={() => downloadInvoicePdf(selectedBillId)}
            >
              <FileDown className="size-4" /> Download Invoice PDF
            </Button>
          </CardContent>
        </Card>

        {/* 3. Diagnostic Lab Report */}
        <Card className="border border-border bg-card shadow-xs flex flex-col justify-between">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                <FlaskConical className="size-5" />
              </div>
              <Badge variant="outline" className="text-[10px] font-mono">DIAGNOSTIC</Badge>
            </div>
            <CardTitle className="text-base font-bold mt-2">Official Lab Report PDF</CardTitle>
            <CardDescription className="text-xs">
              Specimen collection date, diagnostic test results, reference ranges, and verified pathologist signature block.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Select Lab Test</label>
              <Select value={selectedLabId} onValueChange={(val) => setSelectedLabId(val || "")}>
                <SelectTrigger className="w-full text-xs">
                  <SelectValue placeholder="Choose lab diagnostic test" />
                </SelectTrigger>
                <SelectContent>
                  {labs.map((l) => (
                    <SelectItem key={l.id} value={String(l.id)}>
                      {formatId("lab", l.id)} • {l.testName} ({l.status || "completed"})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              className="w-full gap-2 mt-1"
              disabled={!selectedLabId}
              onClick={() => downloadLabReportPdf(selectedLabId)}
            >
              <FileDown className="size-4" /> Download Lab Report PDF
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Audit Log & Compliance Exports */}
      <Card className="border border-border bg-card shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-5 text-indigo-600" />
            <CardTitle className="text-base font-bold">HIPAA Audit Logs & Compliance Data Export</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Export comprehensive system activity records, user actions, and administrative security logs stored in MongoDB.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 border-t border-border/60">
          <div>
            <p className="text-xs font-medium text-foreground">Format Options: Comma-Separated Values (CSV) or JSON Payload</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Includes actor email, IP address, user agent, affected entity ID, and timestamp.
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              disabled={isExportingAudit}
              onClick={() => handleExportAudit("csv")}
            >
              <Download className="size-3.5" /> Export as CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              disabled={isExportingAudit}
              onClick={() => handleExportAudit("json")}
            >
              <Download className="size-3.5" /> Export as JSON
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
