import { getToken } from "./auth";

const GO_SERVICE_URL = process.env.NEXT_PUBLIC_GO_SERVICE_URL || "http://localhost:4000";
const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:4000/api/v1/ws/vitals";

/**
 * Returns the authenticated PDF report download URL for an invoice.
 */
export function getInvoicePdfUrl(billId: number | string): string {
  const token = getToken() || "";
  return `${GO_SERVICE_URL}/api/v1/reports/billing/${billId}?token=${encodeURIComponent(token)}`;
}

/**
 * Returns the authenticated PDF report download URL for a discharge summary.
 */
export function getDischargeSummaryPdfUrl(admissionId: number | string): string {
  const token = getToken() || "";
  return `${GO_SERVICE_URL}/api/v1/reports/discharge/${admissionId}?token=${encodeURIComponent(token)}`;
}

/**
 * Returns the authenticated PDF report download URL for a laboratory test report.
 */
export function getLabReportPdfUrl(labTestId: number | string): string {
  const token = getToken() || "";
  return `${GO_SERVICE_URL}/api/v1/reports/lab/${labTestId}?token=${encodeURIComponent(token)}`;
}

/**
 * Triggers browser download for an invoice PDF report.
 */
export function downloadInvoicePdf(billId: number | string): void {
  const url = getInvoicePdfUrl(billId);
  window.open(url, "_blank", "noopener,noreferrer");
}

/**
 * Triggers browser download for a discharge summary PDF report.
 */
export function downloadDischargeSummaryPdf(admissionId: number | string): void {
  const url = getDischargeSummaryPdfUrl(admissionId);
  window.open(url, "_blank", "noopener,noreferrer");
}

/**
 * Triggers browser download for a laboratory test PDF report.
 */
export function downloadLabReportPdf(labTestId: number | string): void {
  const url = getLabReportPdfUrl(labTestId);
  window.open(url, "_blank", "noopener,noreferrer");
}

/**
 * Returns the WebSocket endpoint for real-time patient ICU telemetry.
 */
export function getVitalsWsUrl(patientId?: number | string): string {
  if (patientId) {
    return `${WS_BASE_URL}?patientId=${encodeURIComponent(patientId)}`;
  }
  return WS_BASE_URL;
}
