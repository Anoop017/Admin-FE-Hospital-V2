import type { Metadata } from "next";
import { PatientsClient } from "@/components/patients/patients-client";

export const metadata: Metadata = {
  title: "Patient Management — MedAdmin",
  description: "Manage hospital patients, profiles, and records.",
};

export default function PatientsPage() {
  return <PatientsClient />;
}
