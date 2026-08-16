import type { Metadata } from "next";
import { AdmissionsClient } from "@/components/admissions/admissions-client";

export const metadata: Metadata = {
  title: "Admission Management — MedAdmin",
  description: "Manage patient admissions.",
};

export default function AdmissionsPage() {
  return <AdmissionsClient />;
}
