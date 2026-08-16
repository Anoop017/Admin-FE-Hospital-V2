import type { Metadata } from "next";
import { StaffClient } from "@/components/staff/staff-client";

export const metadata: Metadata = {
  title: "Staff Management — MedAdmin",
  description: "Manage hospital staff members.",
};

export default function StaffPage() {
  return <StaffClient />;
}
