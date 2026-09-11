/**
 * Enterprise Clinical Formatting & ID Utilities
 * Standardizes raw database identifiers, timestamps, and currency for human-friendly healthcare display.
 */

export type EntityType =
  | "patient"
  | "doctor"
  | "staff"
  | "user"
  | "appointment"
  | "admission"
  | "bill"
  | "payment"
  | "bed"
  | "ward"
  | "department"
  | "lab"
  | "prescription"
  | "medicine"
  | "record";

const PREFIX_MAP: Record<EntityType, string> = {
  patient: "PT",
  doctor: "DR",
  staff: "STF",
  user: "USR",
  appointment: "APT",
  admission: "ADM",
  bill: "INV",
  payment: "PAY",
  bed: "BED",
  ward: "WRD",
  department: "DEP",
  lab: "LAB",
  prescription: "RX",
  medicine: "MED",
  record: "REC",
};

/**
 * Transforms raw database IDs (integers or UUIDs) into human-friendly clinical badges.
 * Examples:
 *   formatId('patient', 14) -> "PT-0014"
 *   formatId('bill', 'c4b9d7a2-...') -> "INV-D7A2"
 */
export function formatId(type: EntityType, id: number | string | undefined | null): string {
  if (id === undefined || id === null || id === "") return "—";
  const prefix = PREFIX_MAP[type] || "ID";
  const strId = String(id).trim();

  // If numeric, pad to 4 digits
  const num = Number(strId);
  if (!isNaN(num) && Number.isInteger(num)) {
    return `${prefix}-${strId.padStart(4, "0")}`;
  }

  // If UUID or alphanumeric string, extract a clean 6-character suffix
  const clean = strId.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  const suffix = clean.length > 6 ? clean.slice(-6) : clean;
  return `${prefix}-${suffix}`;
}

/**
 * Safely extracts a display ID from an unknown ID type without crashing on .substring
 */
export function safeId(id: any): string {
  if (id === undefined || id === null) return "—";
  const str = String(id);
  if (str.length <= 8) return str;
  return str.slice(0, 8).toUpperCase();
}

/**
 * Formats a currency amount into standard US Dollar format ($1,250.00).
 */
export function formatCurrency(amount: number | string | undefined | null): string {
  if (amount === undefined || amount === null || amount === "") return "$0.00";
  const num = typeof amount === "number" ? amount : parseFloat(String(amount));
  if (isNaN(num)) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

/**
 * Formats an ISO date into standard clinical format: "Sep 11, 2026".
 */
export function formatDate(dateInput: string | Date | undefined | null): string {
  if (!dateInput) return "—";
  try {
    const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

/**
 * Formats an ISO date into clinical date and time: "Sep 11, 2026 • 10:30 AM".
 */
export function formatDateTime(dateInput: string | Date | undefined | null): string {
  if (!dateInput) return "—";
  try {
    const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime())) return "—";
    const datePart = d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const timePart = d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return `${datePart} • ${timePart}`;
  } catch {
    return "—";
  }
}

/**
 * Formats time only: "10:30 AM".
 */
export function formatTime(dateInput: string | Date | undefined | null): string {
  if (!dateInput) return "—";
  try {
    const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "—";
  }
}

/**
 * Returns a human-friendly relative time string ("Just now", "5m ago", "2h ago", "Yesterday").
 */
export function formatRelativeTime(dateInput: string | Date | undefined | null): string {
  if (!dateInput) return "—";
  try {
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    if (isNaN(date.getTime())) return "—";
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 45) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour}h ago`;
    if (diffDay === 1) return "Yesterday";
    if (diffDay < 7) return `${diffDay}d ago`;
    return formatDate(date);
  } catch {
    return "—";
  }
}

/**
 * Generates uppercase user avatar initials.
 */
export function getInitials(firstName?: string, lastName?: string): string {
  const f = firstName?.trim()?.charAt(0) || "";
  const l = lastName?.trim()?.charAt(0) || "";
  return (f + l).toUpperCase() || "U";
}

/**
 * Returns formatted avatar background color based on name hash.
 */
export function getAvatarColor(name: string): string {
  const colors = [
    "bg-teal-600 text-white",
    "bg-blue-600 text-white",
    "bg-indigo-600 text-white",
    "bg-purple-600 text-white",
    "bg-emerald-600 text-white",
    "bg-amber-600 text-white",
    "bg-rose-600 text-white",
  ];
  let hash = 0;
  for (let i = 0; i < (name || "").length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}
