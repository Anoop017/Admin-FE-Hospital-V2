import type { Metadata } from "next";
import { MedicalRecordsClient } from "@/components/medicalrecords/medicalrecords-client";

export const metadata: Metadata = {
  title: "Medical Records — MedAdmin",
  description: "Manage patient medical records.",
};

export default function MedicalRecordsPage() {
  return <MedicalRecordsClient />;
}
