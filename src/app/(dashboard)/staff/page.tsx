import type { Metadata } from "next";
import { StaffClient } from "@/components/staff/staff-client";

export const metadata: Metadata = {
  title: "Staff Management — Admin - Hospital Dashboard",
  description: "Manage hospital staff members.",
};

export default function StaffPage() {
  return <StaffClient />;
}
