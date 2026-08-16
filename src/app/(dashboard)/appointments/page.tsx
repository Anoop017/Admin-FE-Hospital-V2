import type { Metadata } from "next";
import { AppointmentsClient } from "@/components/appointments/appointments-client";

export const metadata: Metadata = {
  title: "Appointment Management — Admin - Hospital Dashboard",
  description: "Manage patient appointments.",
};

export default function AppointmentsPage() {
  return <AppointmentsClient />;
}
