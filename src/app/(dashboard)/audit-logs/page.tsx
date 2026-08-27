import type { Metadata } from "next";
import { AuditLogsClient } from "@/components/audit-logs/audit-logs-client";

export const metadata: Metadata = {
  title: "Audit Logs — Admin - Hospital Dashboard",
  description: "Track and monitor all system activities and user actions across the hospital dashboard.",
};

export default function AuditLogsPage() {
  return <AuditLogsClient />;
}
